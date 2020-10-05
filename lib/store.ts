import produce from "immer";
import mapboxgl from "mapbox-gl";
import create, { State, StateCreator } from "zustand";

export type IState = {
  features: GeoJSON.Feature<GeoJSON.LineString>[];
  map: mapboxgl.Map | null;
  data: any;
  dragStatus: "idle" | "loading" | "dragging";
  set: (fn: (state: IState) => void) => void;
};

const immer = <T extends State>(
  config: StateCreator<T, (fn: (draft: T) => void) => void>
): StateCreator<T> => (set, get, api) =>
  config((fn) => set(produce(fn) as (state: T) => T), get, api);

export const useStore = create<IState>(
  immer<IState>((set) => ({
    map: null,
    data: null,
    features: [],
    dragStatus: "idle",
    set,
  }))
);
