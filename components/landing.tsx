import React from "react";

import { useStore } from "../lib/store";
import Dropzone from "./dropzone";

export default function Landing() {
  const { featureCollection, dragStatus } = useStore();
  if (featureCollection?.features?.length) return null;

  return (
    <div className="absolute h-full w-full overflow-y-scroll bg-gradient-to-b from-orange-100 to-orange-200 z-50 text-lg">
      <div className="w-full bg-white h-16 shadow-md flex items-center justify-between  p-4">
        <span>
          <span className="font-raleway mr-1">a tool from </span>
          <span className="font-bold font-raleway text-3xl">Pelica</span>
        </span>
        <a
          className="cursor-pointer"
          href="https://github.com/benjamintd/scratch-map"
        >
          <img className="h-10 w-10" src="/GitHub-Mark-64px.png" />
        </a>
      </div>
      <div className="max-w-3xl mx-auto py-12">
        <h1 className="text-center text-5xl text-orange-800 font-lora mb-6">
          How much of the world have you <strong>scratched</strong>?
        </h1>
        <h2 className="font-lora font-bold text-xl text-center">
          Create your own map, using your Google Location history.
        </h2>
        <p className="text-center mb-6">
          (your data never leaves your computer)
        </p>
        <div className="relative my-16">
          <div className="absolute w-full h-full rounded-lg bg-orange-400 transform rotate-3 -translate-x-1 translate-y-2 z-0 shadow-lg" />
          <img
            className="relative w-full mb-6 mx-auto border rounded-lg z-10 shadow-lg"
            src="/example.png"
          />
        </div>

        <h2 className="font-bold text-2xl font-lora pb-6">
          1. Download your Google Location History
        </h2>
        <p className="mb-6">
          Head to{" "}
          <a
            className="text-blue-800 hover:text-blue-700 underline"
            href="https://takeout.google.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            takeout.google.com
          </a>
          , then make a download request for your location history. Unselecting
          everything except the location history will make the download faster.
        </p>

        <div className="relative my-16">
          <div className="absolute w-full h-full rounded-lg bg-orange-600 transform rotate-3 -translate-x-1 translate-y-2 z-0 shadow-lg" />
          <img
            className="relative w-full mb-6 mx-auto border rounded-lg z-10 shadow-lg"
            src="/google-takeout.png"
          />
        </div>
        <p className="mb-6">
          Files of other formats are not supported right now.{" "}
          <a
            className="text-blue-800 hover:text-blue-700 underline"
            href="mailto:benjamin.tdm@gmail.com"
          >
            Let us know
          </a>{" "}
          if you have other data that you'd like us to handle.
        </p>

        <h2 className="font-bold text-2xl font-lora pb-6">
          2. Find your location data file
        </h2>
        <p className="mb-6">
          Once the archive is ready, download it and unzip the folder. Find the
          file that is called{" "}
          <code className="bg-gray-100 border rounded p-1 shadow-md">
            location history.json
          </code>
          . This file may be named differently depending on your location and
          locale, but it's the one located at the root of the folder.
        </p>
        <h2 className="font-bold text-xl font-lora pb-6">
          3. Drag and drop it here
        </h2>
        <p className="mb-6">
          Drag and drop the file here. The data is processed locally and never
          leaves your computer.
        </p>
        <Dropzone noClick={false}>
          <button className="w-full h-40 bg-white border flex items-center justify-center cursor-pointer mb-6">
            {dragStatus === "idle" && (
              <span className="text-lg font-bold">drop your file here!</span>
            )}
          </button>
        </Dropzone>

        <h2 className="font-bold text-xl font-lora pb-6">4. Browse the map!</h2>
        <p className="mb-6">
          You can try zooming around the cities you have visited 🤩.
        </p>
        <div className="relative my-16">
          <div className="absolute w-full h-full rounded-lg bg-orange-300 transform -rotate-3 -translate-x-1 translate-y-2 z-0 shadow-lg" />
          <img
            className="relative w-full mb-6 mx-auto border rounded-lg z-10 shadow-lg"
            src="/paris-closeup.png"
          />
        </div>

        <p className="mt-12 text-3xl font-lora text-center">
          Did you like this tool?{" "}
          <a
            className="underline hover:text-gray-800"
            href="https://twitter.com/intent/tweet?text=#scratchmap"
          >
            Tweet us your screenshots!
          </a>
        </p>
      </div>
    </div>
  );
}
