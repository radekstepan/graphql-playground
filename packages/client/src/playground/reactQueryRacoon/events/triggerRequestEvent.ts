import { type QueryKey } from "../keys";

export const triggerRequestEvent = Symbol("triggerRequest");

export type TriggerRequestEvent = QueryKey[];
