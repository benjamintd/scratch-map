import produce from "immer";
import mapboxgl from "mapbox-gl";
import create, { State, StateCreator } from "zustand";

export type IState = {
  features: GeoJSON.Feature<GeoJSON.LineString>[];
  map: mapboxgl.Map | null;
  isDragging: boolean;
  set: (fn: (state: IState) => void) => void;
  minTimestamp: number;
  maxTimestamp: number;
  currentTimestamp: number;
};

const immer = <T extends State>(
  config: StateCreator<T, (fn: (draft: T) => void) => void>
): StateCreator<T> => (set, get, api) =>
  config((fn) => set(produce(fn) as (state: T) => T), get, api);

export const useStore = create<IState>(
  immer<IState>((set) => ({
    map: null,
    features: [],
    isDragging: false,
    minTimestamp: Infinity,
    maxTimestamp: 0,
    currentTimestamp: Infinity,
    set,
  }))
);
