import {atom} from '../providers/AtomStateProvider';

interface Page {
  reportId: string;
  entryId?: string;
}

// The page we are on.
export const pageAtom = atom<Page>({reportId: "REP_1"});
