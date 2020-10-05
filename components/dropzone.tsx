import classnames from "classnames";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { useStore } from "../lib/store";

export default function Dropzone({ children }: { children: React.ReactNode }) {
  const { set, dragStatus } = useStore();
  const onDrop = useCallback(async (acceptedFiles: Blob[]) => {
    set((state) => {
      state.dragStatus = "loading";
    });
    const data = await Promise.all(acceptedFiles.map(readFile));
    console.log(data);
    set((state) => {
      state.data = data;
      state.dragStatus = "idle";
    });
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
            "bg-gray-900 bg-opacity-75": dragStatus !== "idle",
            "hidden opacity-0": dragStatus === "idle",
          }
        )}
      >
        {dragStatus === "dragging"
          ? "Drag a file to show it on the map."
          : "Loading..."}
      </div>
    </div>
  );
}

function readFile(file): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onabort = () => reject("file reading was aborted");
    reader.onerror = () => reject("file reading has failed");
    reader.onload = () => {
      try {
        const str = Buffer.from(reader.result as ArrayBuffer);
        let marker = 0;
        let still = true;
        while (still) {
          const i = str.indexOf('"latitudeE7" : ', marker, "utf-8");
          const j = str.indexOf(",\n", i, "utf-8");
          const k = str.indexOf('"longitudeE7" : ', j, "utf-8");
          const l = str.indexOf(",\n", k, "utf-8");
          console.log(str.slice(i, j));
          if (l > -1) {
            marker = l + 1;
          } else {
            still = false;
          }
        }
        console.log();
        resolve(str);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}
