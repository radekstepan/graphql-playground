import {atom} from '../providers/AtomStateProvider';
import { DataStatus } from '../interfaces';
import { QueryKey } from '../keys';

export type Queries = Map<QueryKey, DataStatus>;

const queries: Queries = new Map();

// The staleness of all queries (fragments).
export const queriesAtom = atom(queries);
