import { IState } from "./store";

export const featuresSelector = (state: IState) => state.features || [];
