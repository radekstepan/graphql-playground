import React, { useEffect, useContext, useRef, createContext, type FC, type ReactNode } from "react";
import debounce from "debounce";
import { AtomStateContext } from "./AtomStateProvider";
import {queriesAtom } from "../atoms/queriesAtom";
import { useAtomLazy } from "../hooks/useAtom";
import { type RequestDataEvent, requestDataEvent } from "../events/requestDataEvent";
import { type TriggerRequestEvent, triggerRequestEvent } from "../events/triggerRequestEvent";
import { EventEmitter } from "../classes/EventEmitter";
import { removeChildKeys } from "../utils";
import { type QueryKey } from "../keys";
import { DataStatus } from "../interfaces";

// Overseer manages requesting data and triggering requests.
interface Events {
  [requestDataEvent]: RequestDataEvent;
  [triggerRequestEvent]: TriggerRequestEvent;
}

export interface OverseerValue {
  events: EventEmitter<Events>;
}

const defaultValue: OverseerValue = {
  events: new EventEmitter<Events>()
};

export const OverseerContext = createContext<OverseerValue>(defaultValue);

export const OverseerProvider: FC<{children: ReactNode}> = ({ children }) => {
  const {events} = useContext(OverseerContext);
  const context = useContext(AtomStateContext);
  if (!context) {
    throw new Error('OverseerProvider must be used within an AtomStateProvider');
  }

  // A set of pending requests.
  const requestsRef = useRef(new Set<QueryKey>());

  const [getQueries, setQueries] = useAtomLazy(queriesAtom);

  // Debounced requests, dedupe, remove children and trigger the requests.
  const triggerRequests = debounce(() => {
    if (!requestsRef.current.size) {
      return;
    }
    const res = removeChildKeys(Array.from(requestsRef.current));
    requestsRef.current.clear();
    events.emit(triggerRequestEvent, res);
  }, 200);

  // Check if the fragment is stale and mark it as requested.
  useEffect(() => events.on(requestDataEvent, (requestedQuery) => {
    const queries = getQueries();
    const query = queries.get(requestedQuery);
    if (query === DataStatus.STALE) {
      setQueries((map) => map.set(requestedQuery, DataStatus.REQUESTED));
      requestsRef.current.add(requestedQuery);
    }
    triggerRequests();
  }), []);

  return <>{children}</>;
};
