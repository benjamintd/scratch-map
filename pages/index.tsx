import dynamic from "next/dynamic";
import React from "react";

import Controls from "../components/controls";
import Dropzone from "../components/dropzone";

const Map = dynamic(() => import("../components/map"));

export default function IndexPage() {
  return (
    <div className="w-screen h-screen">
      <Dropzone>
        <div className="w-full h-full flex flex-col">
          <Map />
          <Controls />
        </div>
      </Dropzone>
    </div>
  );
}
