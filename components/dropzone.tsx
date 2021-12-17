import classnames from "classnames";
import localforage from "localforage";
import NProgress from "nprogress";
import React, { useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";

import { IState, useStore } from "../lib/store";

NProgress.configure({ showSpinner: false });

export default function Dropzone({
  children,
  noClick,
}: {
  children: React.ReactNode;
  noClick: boolean;
}) {
  const workerRef = useRef<Worker>();

  const { set, dragStatus } = useStore();

  useEffect(() => {
    workerRef.current = new Worker("../lib/tiler.worker.ts", {
      type: "module",
    });
    workerRef.current.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      switch (data.status as IState["dragStatus"]) {
        case "idle":
          const featureCollection = data.featureCollection;
          localforage.setItem("featureCollection", featureCollection);
          set((state) => {
            state.featureCollection = featureCollection;
          });
          NProgress.done();
          break;

        case "loading":
          NProgress.set(0.1);
          break;
        case "incrementing":
          NProgress.set(0.2);
          break;
        case "masking":
          NProgress.set(0.5);
          break;
        case "finishing":
          NProgress.set(0.9);
          break;
        case "error":
          console.error(data.error);
          NProgress.done();
          break;
        default:
          NProgress.done();
          break;
      }

      // set the current drag status depending on the worker response
      set((state) => {
        state.dragStatus = data.status;
      });
    };
    return () => {
      workerRef.current.terminate();
    };
  }, []);

  const onDrop = useCallback(async (acceptedFiles: Blob[]) => {
    NProgress.start();
    try {
      set((state) => {
        state.dragStatus = "loading";
      });
      const buffer = await readFile(acceptedFiles[0]);
      workerRef.current.postMessage(buffer);
    } catch (error) {
      set((state) => (state.dragStatus = "error"));
      NProgress.done();
    }
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
    accept: "application/json",
    noClick,
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
          "absolute top-0 left-0 w-full h-full pointer-events-none flex items-center justify-center text-center p-6 text-lg font-bold text-white text-shadow",
          {
            "bg-gray-900 bg-opacity-75": dragStatus !== "idle",
            "hidden opacity-0": dragStatus === "idle",
          }
        )}
      >
        {dragStatus === "dragging"
          ? "Drag a file to show it on the map."
          : dragStatus === "loading"
          ? "Loading... This might take a couple minutes."
          : dragStatus === "error"
          ? "There was an error processing your file. Have you selected the right one?"
          : dragStatus === "masking"
          ? "Creating geometries..."
          : dragStatus === "incrementing"
          ? "Tiling location points..."
          : dragStatus === "finishing"
          ? "Finishing up..."
          : dragStatus === "done"
          ? "Creating map..."
          : ""}
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

        resolve(str);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}
