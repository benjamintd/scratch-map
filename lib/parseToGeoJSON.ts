import { gpx } from "@tmcw/togeojson";

export default function parseToGeoJSON(
  str: string
): GeoJSON.FeatureCollection<GeoJSON.LineString> {
  const dom = new DOMParser().parseFromString(str.toString(), "text/xml");
  return gpx(dom);
}
