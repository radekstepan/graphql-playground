import React from 'react'
import Entry from './Entry';
import Receipt from './Receipt';
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useReportEntriesQuery } from '../queries/useReportQuery';
import { ReportEntryQueryProvider } from '../providers/ReportEntryQueryProvider';

const Entries = ({reportId}: {reportId: string}) => {
  const componentRef = useFlashOnRender();
  const entries = useReportEntriesQuery();

  return (
    <div ref={componentRef}>{
      !entries.isFetching && entries.data?.map((entry) => (
        <div key={entry.id} className="flex">
          <ReportEntryQueryProvider reportId={reportId} entryId={entry.id}>
            <Entry />
            <Receipt />
          </ReportEntryQueryProvider>
        </div>
      ))
    }</div>
  );
};

export default Entries;
