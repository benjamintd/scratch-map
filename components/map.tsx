import { BBox2d } from "@turf/helpers/lib/geojson";
import { bbox } from "@turf/turf";
import mapboxgl, { GeoJSONSource } from "mapbox-gl";
import Head from "next/head";
import React, { useEffect } from "react";

import { mapStateSelector } from "../lib/selectors";
import { IState, useStore } from "../lib/store";

export default function Map() {
  const { map, segments, features, set } = useStore((state) =>
    mapStateSelector(state)
  );

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/outdoors-v11",
      center: [2, 48],
      zoom: 2,
      logoPosition: "bottom-right",
      attributionControl: false,
      preserveDrawingBuffer: true,
    });

    map.on("load", () => {
      setStyle(map);

      set((state: IState) => {
        state.map = map;
      });
    });
  }, []);

  useEffect(() => {
    if (features.length) {
      map.fitBounds(bbox({ type: "FeatureCollection", features }) as BBox2d, {
        padding: 100,
        duration: 300,
      });
    }
  }, [map, features]);

  useEffect(() => {
    if (map && map.getSource("features")) {
      (map.getSource("features") as GeoJSONSource).setData({
        type: "FeatureCollection",
        features: segments,
      });
    }
  }, [segments, map]);

  return (
    <div className="w-full h-full" id="map">
      <Head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.css"
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
      id: "features",
      type: "line",
      source: "features",
      layout: {
        "line-cap": "round",
      },
      paint: {
        "line-width": 4,
        "line-color": [
          "interpolate",
          ["linear"],
          ["get", "speed"],
          0,
          "#ffffb2",
          5,
          "#fecc5c",
          20,
          "#fd8d3c",
          50,
          "#f03b20",
          100,
          "#bd0026",
        ],
      },
    },
    "waterway-label"
  );
}
