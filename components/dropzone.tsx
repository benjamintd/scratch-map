import classnames from "classnames";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { addFeatures } from "../lib/actions";
import parseToGeoJSON from "../lib/parseToGeoJSON";
import { useStore } from "../lib/store";

export default function Dropzone({ children }: { children: React.ReactNode }) {
  const { set, isDragging } = useStore();
  const onDrop = useCallback(async (acceptedFiles: Blob[]) => {
    const features = await Promise.all(acceptedFiles.map(readFile));
    set(addFeatures(features.flat()));
  }, []);

  const onDragEnter = useCallback(() => {
    set((state) => {
      state.isDragging = true;
    });
  }, []);

  const onDragLeave = useCallback(() => {
    set((state) => {
      state.isDragging = false;
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    // accept: "application/gpx+xml",
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
            "bg-gray-900 bg-opacity-75": isDragging,
            "hidden opacity-0": !isDragging,
          }
        )}
      >
        Drag a .gpx file to show it on the map.
      </div>
    </div>
  );
}

function readFile(file): Promise<GeoJSON.Feature<GeoJSON.LineString>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onabort = () => reject("file reading was aborted");
    reader.onerror = () => reject("file reading has failed");
    reader.onload = () => {
      try {
        const str = Buffer.from(reader.result as ArrayBuffer).toString("utf-8");
        const { features } = parseToGeoJSON(str);
        resolve(features);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}
