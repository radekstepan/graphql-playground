import React, { type FC } from 'react'
import {useAtom} from '../hooks/useAtom';
import { pageAtom } from '../atoms/pageAtom';
import { ReportEntryQueryProvider } from '../providers/ReportEntryQueryProvider';
import Entry from '../components/Entry';
import Receipt from '../components/Receipt';

const EntryPage = () => {
  const [page, setPage] = useAtom(pageAtom);

  if (!page.entryId) {
    return null;
  }

  return (
    <ReportEntryQueryProvider reportId={page.reportId} entryId={page.entryId}>
      <div className='section'>
        <a onClick={() => setPage({reportId: page.reportId})}>Back</a>
      </div>
      <div className="section">
        <div className="flex">
          <Entry />
          <Receipt />
        </div>
      </div>
    </ReportEntryQueryProvider>
  );
};

export default EntryPage;
