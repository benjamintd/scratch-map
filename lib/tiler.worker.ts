import {
  bboxPolygon,
  coordEach,
  difference,
  featureCollection,
} from "@turf/turf";
import {
  geoToH3,
  h3SetToMultiPolygon,
  h3ToParent,
  kRing,
} from "h3-js/dist/browser/h3-js";
import { flatMap } from "lodash";

function bufferToTilesCollection(
  str: Uint8Array,
  logStatus
): GeoJSON.FeatureCollection {
  let marker = 0;
  const precision = 10;
  const tiles = new Map();
  let tile, i, j, k, l;

  logStatus("loading");

  // build a buffer from the uint8array to be able to search through it
  const buffer = Buffer.alloc(str.buffer.byteLength);
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = str[i];
  }

  logStatus("incrementing");

  while (true) {
    i = buffer.indexOf('"latitudeE7" : ', marker, "utf-8");
    j = buffer.indexOf(",\n", i, "utf-8");
    k = buffer.indexOf('"longitudeE7" : ', j, "utf-8");
    l = buffer.indexOf(",\n", k, "utf-8");

    if (l > -1) {
      marker = l + 1;
    } else {
      break;
    }

    tile = geoToH3(
      +buffer.slice(i + 15, j).toString("utf-8") * 1e-7, // latitude
      +buffer.slice(k + 16, l).toString("utf-8") * 1e-7, // longitude
      precision
    );

    incrementTile(tile, tiles);
  }

  logStatus("masking");

  const fc = featureCollection([
    getMaskPolygon(tiles, 1),
    getMaskPolygon(tiles, 2),
    getMaskPolygon(tiles, 0, 7, 2),
    getMaskPolygon(tiles, 0, 5, 2),
    getMaskPolygon(tiles, 0, 3, 2),
  ]) as GeoJSON.FeatureCollection;

  logStatus("finishing");

  return fc;
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
  precision?: number,
  minProbes?: number
): GeoJSON.Feature<GeoJSON.MultiPolygon> {
  let tilesArray = Array.from(tiles.keys());
  tilesArray = Array.from(
    new Set(
      flatMap(tilesArray, (t) => {
        if (minProbes && tiles.get(t) < minProbes) {
          return [];
        }
        const tile = precision > 0 ? h3ToParent(t, precision) : t;
        return kring ? kRing(tile, kring) : [tile];
      })
    )
  );

  const feature: GeoJSON.Feature<GeoJSON.MultiPolygon> = {
    type: "Feature",
    properties: {
      kring,
    },
    geometry: {
      type: "MultiPolygon",
      coordinates: h3SetToMultiPolygon(tilesArray, true),
    },
  };

  coordEach(feature, (p) => {
    p[0] = Math.round(p[0] * 1e5) / 1e5;
    p[1] = Math.round(p[1] * 1e5) / 1e5;
  });

  return feature;
}

function getMaskPolygon(
  tiles: Map<string, number>,
  kring: number,
  precision?: number,
  minProbes?: number
): GeoJSON.Feature<GeoJSON.MultiPolygon> {
  const feature = difference(
    bboxPolygon([-179.99, -89.99, 179.99, 89.99]),
    getPolygon(tiles, kring, precision, minProbes)
  ) as GeoJSON.Feature<GeoJSON.MultiPolygon>;
  feature.properties.kring = kring;
  feature.properties.precision = precision;
  return feature;
}

self.addEventListener("message", (event) => {
  try {
    const featureCollection = bufferToTilesCollection(event.data, (s: string) =>
      self.postMessage(JSON.stringify({ status: s }))
    );

    self.postMessage(
      JSON.stringify({
        status: "idle",
        featureCollection,
      })
    );
  } catch (error) {
    self.postMessage(JSON.stringify({ status: "error", error }));
  }
});
