import localforage from "localforage";
import React from "react";

import { useStore } from "../lib/store";

export default function ClearButton() {
  const { set } = useStore();

  const onClick = () => {
    const fc = {
      type: "FeatureCollection",
      features: [],
    } as GeoJSON.FeatureCollection;
    set((state) => {
      state.featureCollection = fc;
    });
    localforage.setItem("featureCollection", fc);
  };

  return (
    <button
      className="absolute rounded top-0 left-0 m-4 bg-gray-100 border px-4 py-2 font-bold text-sm"
      onClick={onClick}
    >
      clear
    </button>
  );
}
