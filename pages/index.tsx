import dynamic from "next/dynamic";
import React from "react";

import ClearButton from "../components/clearButton";
import Dropzone from "../components/dropzone";
import Landing from "../components/landing";
import Meta from "../components/meta";

const Map = dynamic(() => import("../components/map"));

export default function IndexPage() {
  return (
    <div className="w-screen h-screen">
      <Meta />
      <div className="relative h-full w-full">
        <div className="absolute w-full h-full z-0">
          <Dropzone noClick={true}>
            <Map />
          </Dropzone>
          <ClearButton />
        </div>
        <Landing />
      </div>
    </div>
  );
}
