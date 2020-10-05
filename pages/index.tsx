import dynamic from "next/dynamic";
import React from "react";

import Dropzone from "../components/dropzone";

const Map = dynamic(() => import("../components/map"));

export default function IndexPage() {
  return (
    <div className="w-screen h-screen">
      <Dropzone>
        <Map />
      </Dropzone>
    </div>
  );
}
