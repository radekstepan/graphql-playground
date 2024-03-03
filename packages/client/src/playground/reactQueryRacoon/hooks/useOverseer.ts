import { useContext } from "react";
import { OverseerContext } from "../providers/OverseerProvider";

export const useOverseer = () => useContext(OverseerContext);
