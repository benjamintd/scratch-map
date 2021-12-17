import localforage from "localforage";
import mapboxgl, { GeoJSONSource } from "mapbox-gl";
import Head from "next/head";
import React, { useEffect } from "react";

import { IState, useStore } from "../lib/store";

export default function Map() {
  const { map, featureCollection, set } = useStore();

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/benjamintd/ckfzcwnmc140m19mldf36aq6x",
      center: [0, 0],
      zoom: 1,
      logoPosition: "bottom-right",
      attributionControl: false,
      preserveDrawingBuffer: true,
    } as any);

    map.on("load", async () => {
      setStyle(map);

      set((state: IState) => {
        state.map = map;
      });

      try {
        const featureCollection = (await localforage.getItem(
          "featureCollection"
        )) as GeoJSON.FeatureCollection;
        if (featureCollection) {
          set((state) => {
            state.featureCollection = featureCollection;
          });
        }
      } catch (err) {
        console.log(err);
      }
    });
  }, []);

  useEffect(() => {
    if (map && map.getSource("features")) {
      (map.getSource("features") as GeoJSONSource).setData(featureCollection);
    }
  }, [featureCollection, map]);

  return (
    <div className="w-full h-full appearance-none" id="map">
      <Head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
    </div>
  );
}

function setStyle(map: mapboxgl.Map) {
  map.addSource("features", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  });

  map.addLayer(
    {
      id: "fc-low-res",
      type: "fill",
      source: "features",
      layout: {},
      filter: ["==", ["get", "precision"], 3],
      paint: {
        "fill-opacity": 1,
        "fill-color": "hsla(233, 0%, 100%, 0.94)",
      },
      minzoom: 0,
      maxzoom: 7,
    },
    "settlement-subdivision-label"
  );

  map.addLayer(
    {
      id: "fc-mid-low-res",
      type: "fill",
      source: "features",
      layout: {},
      filter: ["==", ["get", "precision"], 5],
      paint: {
        "fill-opacity": 1,
        "fill-color": "hsla(233, 0%, 100%, 0.94)",
      },
      minzoom: 5,
      maxzoom: 9,
    },
    "settlement-subdivision-label"
  );

  map.addLayer(
    {
      id: "fc-mid-hi-res",
      type: "fill",
      source: "features",
      layout: {},
      filter: ["==", ["get", "precision"], 7],
      paint: {
        "fill-opacity": 1,
        "fill-color": "hsla(233, 0%, 100%, 0.94)",
      },
      minzoom: 8,
      maxzoom: 12,
    },
    "settlement-subdivision-label"
  );

  map.addLayer(
    {
      id: "fc-hi-res",
      type: "fill",
      source: "features",
      layout: {},
      paint: {
        "fill-opacity": 1,
        "fill-color": [
          "match",
          ["get", "kring"],
          [2],
          "hsla(233, 0%, 100%, 0.94)",
          [1],
          "hsla(0, 0%, 100%, 0.66)",
          0,
          "hsla(0, 0%, 100%, 0.33)",
          "hsla(0, 0%, 100%, 0.66)",
        ],
        "fill-outline-color": "hsla(0, 0%, 0%, 0)",
      },
      minzoom: 10,
    },
    "settlement-subdivision-label"
  );

  map.addLayer(
    {
      id: "water-fade",
      type: "fill",
      source: "composite",
      "source-layer": "water",
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0,
          "hsl(231, 14%, 84%)",
          8.81,
          "hsla(231, 14%, 84%, 0.7)",
          12,
          "hsla(231, 14%, 84%, 0.5)",
        ],
      },
    },
    "settlement-subdivision-label"
  );

  map.addLayer({
    id: "over-labels",
    type: "fill",
    source: "features",
    filter: ["match", ["get", "kring"], [2], true, false],
    layout: {},
    paint: {
      "fill-opacity": ["interpolate", ["linear"], ["zoom"], 6, 0, 8, 1],
      "fill-outline-color": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0,
        "hsla(31, 60%, 65%, 0.88)",
        7.8,
        "hsla(0, 0%, 0%, 0)",
        22,
        "hsla(0, 0%, 0%, 0)",
      ],
      "fill-color": "hsla(0, 0%, 100%, 0.44)",
    },
  });
}
