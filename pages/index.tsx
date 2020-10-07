import dynamic from "next/dynamic";
import React from "react";

import ClearButton from "../components/clearButton";
import Dropzone from "../components/dropzone";
import Meta from "../components/meta";
import Panel from "../components/panel";

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
        <Panel />
      </div>
    </div>
  );
}
