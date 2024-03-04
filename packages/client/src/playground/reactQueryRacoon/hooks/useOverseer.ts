import { useContext } from "react";
import { OverseerContext } from "../providers/OverseerProvider";

// Use the events off the Overseer.
export const useOverseer = () => useContext(OverseerContext);
