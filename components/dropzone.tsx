import { bboxPolygon, difference, featureCollection } from "@turf/turf";
import classnames from "classnames";
import { geoToH3, h3SetToMultiPolygon, h3ToParent, kRing } from "h3-js";
import localforage from "localforage";
import { flatMap } from "lodash";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { useStore } from "../lib/store";

export default function Dropzone({ children }: { children: React.ReactNode }) {
  const { set, dragStatus } = useStore();
  const onDrop = useCallback(async (acceptedFiles: Blob[]) => {
    set((state) => {
      state.dragStatus = "loading";
    });
    const fc = await readFile(acceptedFiles[0]);

    set((state) => {
      state.featureCollection = fc;
      state.dragStatus = "idle";
    });

    localforage.setItem("featureCollection", fc);
  }, []);

  const onDragEnter = useCallback(() => {
    set((state) => {
      state.dragStatus = "dragging";
    });
  }, []);

  const onDragLeave = useCallback(() => {
    set((state) => {
      state.dragStatus = "idle";
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    // accept: "application/json",
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps({
        className: "w-full h-full relative",
      })}
    >
      <input {...getInputProps()} />
      {children}
      <div
        className={classnames(
          "absolute top-0 left-0 w-full h-full pointer-events-none flex items-center justify-center text-3xl font-bold text-white text-shadow",
          {
            "bg-gray-900 bg-opacity-75": dragStatus !== "idle",
            "hidden opacity-0": dragStatus === "idle",
          }
        )}
      >
        {dragStatus === "dragging"
          ? "Drag a file to show it on the map."
          : "Loading... This might take a while. Staying on this tab makes processing faster."}
      </div>
    </div>
  );
}

function readFile(file): Promise<GeoJSON.FeatureCollection> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onabort = () => reject("file reading was aborted");
    reader.onerror = () => reject("file reading has failed");
    reader.onload = () => {
      try {
        const str = Buffer.from(reader.result as ArrayBuffer);
        let marker = 0;
        const precision = 10;
        const tiles = new Map();
        let tile, i, j, k, l;
        while (true) {
          i = str.indexOf('"latitudeE7" : ', marker, "utf-8");
          j = str.indexOf(",\n", i, "utf-8");
          k = str.indexOf('"longitudeE7" : ', j, "utf-8");
          l = str.indexOf(",\n", k, "utf-8");

          if (l > -1) {
            marker = l + 1;
          } else {
            break;
          }

          tile = geoToH3(
            +str.slice(i + 15, j).toString("utf-8") * 1e-7, // latitude
            +str.slice(k + 16, l).toString("utf-8") * 1e-7, // longitude
            precision
          );

          incrementTile(tile, tiles);
        }
        const fc = featureCollection([
          getMaskPolygon(tiles, 0),
          getMaskPolygon(tiles, 1),
          getMaskPolygon(tiles, 2),
          getMaskPolygon(tiles, 0, 3),
        ]) as GeoJSON.FeatureCollection;
        resolve(fc);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

function incrementTile(tile, tiles) {
  if (tiles.has(tile)) {
    tiles.set(tile, tiles.get(tile) + 1);
  } else {
    tiles.set(tile, 1);
  }
}

function getPolygon(
  tiles: Map<string, number>,
  kring: number,
  precision?: number
): GeoJSON.Feature<GeoJSON.MultiPolygon> {
  let tilesArray = Array.from(tiles.keys());
  tilesArray = Array.from(
    new Set(
      flatMap(tilesArray, (t) => {
        const tile = precision > 0 ? h3ToParent(t, precision) : t;
        return kring ? kRing(tile, kring) : [tile];
      })
    )
  );

  return {
    type: "Feature",
    properties: {
      kring,
    },
    geometry: {
      type: "MultiPolygon",
      coordinates: h3SetToMultiPolygon(tilesArray, true),
    },
  };
}

function getMaskPolygon(
  tiles: Map<string, number>,
  kring: number,
  precision?: number
): GeoJSON.Feature<GeoJSON.MultiPolygon> {
  const feature = difference(
    bboxPolygon([-179.99, -89.99, 179.99, 89.99]),
    getPolygon(tiles, kring, precision)
  ) as GeoJSON.Feature<GeoJSON.MultiPolygon>;
  feature.properties.kring = kring;
  feature.properties.precision = precision;
  return feature;
}
