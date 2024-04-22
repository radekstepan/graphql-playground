import { type QueryKey } from "../keys";

// To tell providers to actually request the data.
export const triggerRequestEvent = Symbol("triggerRequest");

export type TriggerRequestEvent = QueryKey[];
