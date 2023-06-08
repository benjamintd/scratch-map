import classnames from "classnames";
import Image from "next/image";
import React from "react";

import { useStore } from "../lib/store";
import Dropzone from "./dropzone";

const H2 = (props: React.HTMLProps<HTMLHeadingElement>) => (
  <h2
    className={classnames(
      "font-bold text-2xl font-raleway pb-6",
      props.className
    )}
  >
    {props.children}
  </h2>
);

const Paragraph = (props: React.HTMLProps<HTMLParagraphElement>) => (
  <p className={classnames("mb-6", props.className)}>{props.children}</p>
);

const Step = (props: React.HTMLProps<HTMLParagraphElement>) => (
  <h3 className={classnames("mb-6 font-raleway font-bold", props.className)}>
    {props.children}
  </h3>
);

const TutorialImage = (props: React.HTMLProps<HTMLImageElement>) => (
  <div
    className={classnames(
      "relative mb-6 w-full mx-auto border rounded-lg z-10 shadow-lg overflow-hidden",
      props.className
    )}
  >
    <Image height={1504} src={props.src} width={2774} />
  </div>
);

const ExternalLink = (props: React.HTMLProps<HTMLAnchorElement>) => (
  <a
    className="text-blue-800 underline hover:text-blue-700"
    href={props.href}
    rel="noopener noreferrer"
    target="_blank"
  >
    {props.children}
  </a>
);

export default function Landing() {
  const { featureCollection, dragStatus } = useStore();
  if (featureCollection?.features?.length) return null;

  return (
    <div className="absolute z-50 w-full h-full overflow-y-scroll text-lg bg-gray-100">
      <div className="max-w-3xl px-4 py-12 mx-auto">
        <h1 className="mb-6 text-5xl text-center text-orange-600 font-raleway">
          How much of the world have you <strong>scratched</strong>?
        </h1>
        <h2 className="text-xl font-bold text-center font-raleway">
          Create your own map, using your Google Location history.
        </h2>
        <Paragraph className="text-center font-raleway">
          (your data never leaves your computer)
        </Paragraph>
        <div className="relative my-16">
          <div className="absolute z-0 w-full h-full transform -translate-x-1 translate-y-2 bg-orange-400 rounded-lg shadow-lg rotate-3" />
          <Image
            className="relative z-10 w-full mx-auto mb-6 border rounded-lg shadow-lg"
            height={1328}
            src="/example.png"
            width={1813}
          />
        </div>

        <section id="retrieve-history">
          <H2>1. Retrieve your Google Location History</H2>

          <Paragraph>
            Head to{" "}
            <ExternalLink href="https://takeout.google.com">
              takeout.google.com
            </ExternalLink>
            , then make a download request for your location history.
            Unselecting everything except the location history will make the
            download faster.
          </Paragraph>

          <Paragraph>
            Once the archive is ready, download it and unzip the folder. Find
            the file that is called{" "}
            <code className="p-1 text-sm bg-gray-100 border rounded shadow-sm">
              Location History.json
            </code>
            . This file may be named differently depending on your location and
            locale, but it's the one located at the root of the namesake folder.
          </Paragraph>

          <details className="mb-6 bg-white border rounded shadow-md">
            <summary className="px-4 py-2">
              Need some guidance? Follow this step by step tutorial
            </summary>
            <div className="px-4 pt-4">
              <Paragraph>
                Google Takeout lists your Google data sources and enables you to
                export that data. Go to{" "}
                <ExternalLink href="https://takeout.google.com">
                  takeout.google.com
                </ExternalLink>{" "}
                and log in to your Google account.
              </Paragraph>
              <Step>First, unselect all possible exports</Step>
              <Paragraph>
                Click on the "Deselect All" button. You will only need your
                location data.
              </Paragraph>
              <TutorialImage src="/google-deselect.png" />
              <Step>
                Head to the Location History section and select the report
              </Step>
              <Paragraph>
                Scroll or look for the Location History Section. Then, click on
                the checkbox to select this report.
              </Paragraph>
              <TutorialImage src="/google-location.png" />
              <Step>Proceed to the next step</Step>
              <Paragraph>
                Scroll down the page and click on the "Next step" button
              </Paragraph>
              <TutorialImage src="/google-next.png" />
              <Step>Export and settings</Step>
              <Paragraph>
                Choose how you want the export to be delivered (for ex: email).
                We recommend using the default values (export once, .zip, 2GB).
                Finally, click on "Create export".
              </Paragraph>
              <TutorialImage src="/google-settings.png" />
              <Step>Extract the Location file</Step>
              <Paragraph>
                You will shortly receive the archive. Navigate to export it, it
                should automatically download once you have confirmed your
                identity and logged in again.
              </Paragraph>
              <TutorialImage src="/google-download.png" />
              <Step>Unzip the folder and find the Location History file</Step>
              <Paragraph>
                Once downloaded, unzip the folder. Find the file that is called{" "}
                <code className="p-1 text-sm bg-gray-100 border rounded shadow-sm">
                  Location History.json
                </code>
                . This file may be named differently depending on your location
                and locale.
              </Paragraph>
              <TutorialImage src="/unzip.png" />
              <Paragraph>
                Files of other formats are not supported right now.{" "}
                <ExternalLink href="mailto:benjamin.tdm+scratch@gmail.com">
                  Let us know
                </ExternalLink>{" "}
                if you have other data that you'd like us to handle.
              </Paragraph>
            </div>
          </details>
        </section>
        <section id="drop-history">
          <H2>2. Drag and drop it here</H2>
          <Paragraph>
            Drag and drop the file here. The data is processed locally and never
            leaves your computer.
          </Paragraph>
          <Dropzone noClick={false}>
            <button className="w-full h-64 p-2 bg-white border shadow-md cursor-pointer">
              {dragStatus === "idle" && (
                <div className="flex flex-col items-center justify-center w-full h-full p-4 border-4 border-dashed rounded-lg">
                  <img
                    className="w-32 mb-6 transition duration-200 transform hover:scale-110"
                    draggable={false}
                    src="/add-file.svg"
                  />
                  <div className="text-lg font-bold">drop your file here!</div>
                </div>
              )}
            </button>
          </Dropzone>
          {/* spacer */}
          <div className="h-6" />
        </section>

        <section id="browse-map">
          <H2>3. Browse the map!</H2>
          <Paragraph>
            You can try zooming around the cities you have visited 🤩.
          </Paragraph>
          <div className="relative my-16">
            <div className="absolute z-0 w-full h-full transform -translate-x-1 translate-y-2 bg-orange-300 rounded-lg shadow-lg -rotate-3" />
            <Image
              className="relative z-10 w-full mx-auto mb-6 border rounded-lg shadow-lg"
              height={1182}
              src="/paris-closeup.png"
              width={1518}
            />
          </div>
        </section>

        <Paragraph className="mt-12 text-3xl text-center font-raleway">
          Do you like this tool?
          <br />
          <ExternalLink href="https://twitter.com/intent/tweet?text=%23scratchmap">
            Tweet us your screenshots!
          </ExternalLink>
        </Paragraph>
      </div>
      <div className="flex items-center justify-between w-full h-16 p-4 bg-white border shadow-md">
        <a
          className="cursor-pointer"
          href="https://github.com/benjamintd/scratch-map"
        >
          <div className="w-10 h-10">
            <Image height={64} src="/GitHub-Mark-64px.png" width={64} />
          </div>
        </a>
      </div>
    </div>
  );
}
