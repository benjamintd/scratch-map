const { geoToH3, h3SetToMultiPolygon, kRing } = require("h3-js");
const { flatMap } = require("lodash");
const { difference, bboxPolygon } = require("@turf/turf");
const history = require("./data/input/history.json");

function incrementTile(tile, tiles) {
  if (tiles.has(tile)) {
    tiles.set(tile, tiles.get(tile) + 1);
  } else {
    tiles.set(tile, 1);
  }
}

function getHistoryTiles(history, precision) {
  const tiles = new Map();

  history.locations.forEach((loc) => {
    const tile = geoToH3(
      loc.latitudeE7 / 1e7,
      loc.longitudeE7 / 1e7,
      precision
    );
    incrementTile(tile, tiles);
  });

  return tiles;
}

function getTimelineTiles(history, precision) {
  const tiles = new Map();

  history.timelineObjects.forEach((seg) => {
    if (seg.activitySegment && seg.activitySegment.waypointPath) {
      seg.activitySegment.waypointPath.waypoints.forEach((wpt) => {
        const tile = geoToH3(wpt.latE7 / 1e7, wpt.lngE7 / 1e7, precision);
        incrementTile(tile, tiles);
      });
    } else if (seg.placeVisit) {
      const tile = geoToH3(
        seg.placeVisit.location.latE7 / 1e7,
        seg.placeVisit.location.lngE7 / 1e7,
        precision
      );
      incrementTile(tile, tiles);
    }
  });

  return tiles;
}

function getPolygon(tiles, kring) {
  let tilesArray = Array.from(tiles.keys());
  if (kring) {
    tilesArray = Array.from(
      new Set(flatMap(tilesArray, (t) => kRing(t, kring)))
    );
  }

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

function getMaskPolygon(tiles, kring) {
  const feature = difference(
    bboxPolygon([-179.9, -89.9, 179.9, 89.9]),
    getPolygon(tiles, kring)
  );
  feature.properties.kring = kring;
  return feature;
}

function main() {
  const tiles = getHistoryTiles(history, 10);

  const fc = {
    type: "FeatureCollection",
    features: [
      getMaskPolygon(tiles, 0),
      getMaskPolygon(tiles, 1),
      getMaskPolygon(tiles, 2),
    ],
  };

  console.log(JSON.stringify(fc));
}

main();
