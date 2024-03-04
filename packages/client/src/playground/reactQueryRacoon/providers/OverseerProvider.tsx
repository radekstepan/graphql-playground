import React, { type FC, type ReactNode, useEffect, useContext, useRef, createContext } from "react";
import debounce from "debounce";
import { type QueryKey } from "../keys";
import {queriesAtom } from "../atoms/queriesAtom";
import { AtomStateContext } from "./AtomStateProvider";
import { useAtomLazy } from "../hooks/useAtomLazy";
import { DataStatus } from "../interfaces";
import { removeChildKeys } from "../utils";
import { type RequestDataEvent, requestDataEvent } from "../events/requestDataEvent";
import { type TriggerRequestEvent, triggerRequestEvent } from "../events/triggerRequestEvent";
import { EventEmitter } from "../classes/EventEmitter";
import { useOverseer } from "../hooks/useOverseer";

interface Events {
  [requestDataEvent]: RequestDataEvent;
  [triggerRequestEvent]: TriggerRequestEvent;
}

export interface OverseerValue {
  events: EventEmitter<Events>;
}

const defaultValue: OverseerValue = {
  events: new EventEmitter<Events>(),
};

export const OverseerContext = createContext<OverseerValue>(defaultValue);

export const OverseerProvider: FC<{children: ReactNode}> = ({ children }) => {
  const context = useContext(AtomStateContext);
  if (!context) {
    throw new Error('OverseerProvider must be used within an AtomStateProvider');
  }
  const requestsRef = useRef(new Set<QueryKey>());

  const {events} = useOverseer();

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

  return (
    <>
      {children}
    </>
  );
};
