import { lineString } from "@turf/turf";
import cheapRuler, { Point } from "cheap-ruler";
import { LineString } from "geojson";
import { flatMap } from "lodash";
import { createSelector } from "reselect";

import { IState } from "./store";

export const featuresSelector = (state: IState) => state.features || [];
export const currentTimestampSelector = (state: IState) =>
  state.currentTimestamp;

export const segmentsSelector = createSelector(
  featuresSelector,
  currentTimestampSelector,
  (
    features: IState["features"],
    currentTimestamp: number
  ): GeoJSON.Feature<LineString, { speed: number }>[] => {
    const segments = flatMap(features, (f) => {
      if (!f.properties.coordTimes) return [f];

      const coords = f.geometry.coordinates as Point[];
      const ruler = new cheapRuler(coords[0][1], "kilometers");

      const s = [];

      let currentCoords = [];
      let currentSpeed;
      for (let i = 0; i < coords.length - 1; i++) {
        // don't include points in the future
        if (currentTimestamp < new Date(f.properties.coordTimes[i]).getTime()) {
          break;
        }

        const distanceInKm = ruler.distance(coords[i + 1], coords[i]);

        const timeInH =
          (new Date(f.properties.coordTimes[i + 1]).getTime() -
            new Date(f.properties.coordTimes[i]).getTime()) /
          (1000 * 60 * 60);
        // avoid 0 speed pb.
        const speed = Math.max(0.1, distanceInKm / timeInH);

        // we have a 15% tolerance to aggregate segments to avoid too many linestrings to render
        if (
          currentSpeed &&
          Math.abs(speed - currentSpeed) / currentSpeed > 0.15
        ) {
          s.push(
            lineString(currentCoords, {
              speed: currentSpeed,
            })
          );
          currentCoords = [coords[i], coords[i + 1]];
          currentSpeed = speed;
        } else if (currentCoords.length) {
          currentCoords.push(coords[i + 1]);
        } else {
          // we're starting a segment
          currentCoords = [coords[i], coords[i + 1]];
          currentSpeed = speed;
        }
      }

      // push last segment
      if (currentCoords.length > 1) {
        s.push(
          lineString(currentCoords, {
            speed: currentSpeed,
          })
        );
      }

      return s;
    });

    return segments;
  }
);

export const mapStateSelector = (state: IState) => ({
  map: state.map,
  segments: segmentsSelector(state),
  features: state.features,
  set: state.set,
});

export const controlsStateSelector = (state: IState) => ({
  minTimestamp: state.minTimestamp,
  maxTimestamp: state.maxTimestamp,
  currentTimestamp: state.currentTimestamp,
  hasFeatures: state.features.length > 0,
  set: state.set,
});
