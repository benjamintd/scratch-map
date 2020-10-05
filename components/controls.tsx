import { throttle } from "lodash";
import React from "react";

import { controlsStateSelector } from "../lib/selectors";
import { useStore } from "../lib/store";

export default function Controls() {
  const {
    minTimestamp,
    maxTimestamp,
    currentTimestamp,
    hasFeatures,
    set,
  } = useStore(controlsStateSelector);

  const onChange = throttle(
    (e) =>
      set((state) => {
        state.currentTimestamp = +e.target.value;
      }),
    1000
  );

  const onClear = () => {
    set((state) => {
      state.features = [];
    });
  };

  return (
    <div className="w-full h-20 bg-gray-100 p-6 flex items-center gap-6 shadow-lg">
      {hasFeatures ? (
        <>
          <input
            className="flex-grow bg-gray-500 appearance-none"
            max={maxTimestamp}
            min={minTimestamp}
            step={1000}
            type="range"
            value={currentTimestamp}
            onChange={onChange}
          />
          <button
            className="bg-teal-700 text-white font-bold shadow-sm rounded px-4 py-2"
            onClick={onClear}
          >
            clear
          </button>
        </>
      ) : (
        <p>Drag and drop a .gpx file to get started.</p>
      )}
    </div>
  );
}
