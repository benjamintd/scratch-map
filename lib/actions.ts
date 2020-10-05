import { IState } from "./store";

export const addFeatures = (
  features: GeoJSON.Feature<GeoJSON.LineString>[]
) => (state: IState) => {
  state.features = state.features.concat(features);
  const times = state.features.flatMap((f) =>
    (f.properties.coordTimes || []).map((t) => new Date(t).getTime())
  );
  state.minTimestamp = Math.min(...times, state.minTimestamp);
  state.maxTimestamp = Math.max(...times, state.maxTimestamp);
  state.isDragging = false;
};
