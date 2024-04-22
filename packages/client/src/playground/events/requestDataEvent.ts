import { type QueryKey } from "../keys";

// For components to say they need data.
export const requestDataEvent = Symbol("requestData");

export type RequestDataEvent = QueryKey;
