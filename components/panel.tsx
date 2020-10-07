import React from "react";

import Dropzone from "../components/dropzone";
import { useStore } from "../lib/store";

export default function Panel() {
  const { featureCollection, dragStatus } = useStore();
  if (featureCollection?.features?.length) return null;

  return (
    <div className="absolute p-6 h-full w-full overflow-y-scroll bg-gray-100 z-50">
      <div className="max-w-2xl mx-auto py-12">
        <h1 className="text-3xl font-lora font-bold mb-6">
          How much of the world have you scratched?
        </h1>
        <p className="mb-6">
          Find out now, using your Google Location history. Your data never
          leaves your computer.
        </p>
        <img className="w-full mb-6 mx-auto border" src="/example.png" />

        <h2 className="font-bold text-xl font-lora pb-6">
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

        <img className="w-full mb-6 mx-auto border" src="/google-takeout.png" />

        <p className="mb-6">
          We unfortunately only accept files from Google Takeout for now. Let us
          know if you have some other file format for use!
        </p>

        <h2 className="font-bold text-xl font-lora pb-6">
          2. Find your location data file
        </h2>
        <p className="mb-6">
          Once the archive is ready, download it and unzip the folder. Find the
          file that is called{" "}
          <code className="bg-gray-200 border rounded p-1">
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
        <img className="w-full mb-6 mx-auto border" src="/paris-closeup.png" />

        <p>Did you like this tool? Send us your screenshots!</p>
      </div>
    </div>
  );
}
