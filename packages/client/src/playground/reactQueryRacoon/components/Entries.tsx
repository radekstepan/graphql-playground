import React from 'react'
import Entry from './Entry';
import Receipt from './Receipt';
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useReadReportEntriesData } from '../hooks/useReportData';
import { EntryDataProvider } from '../providers/EntryDataProvider';

const Entries = ({reportId}: {reportId: string}) => {
  const componentRef = useFlashOnRender();
  const entries = useReadReportEntriesData();

  return (
    <div ref={componentRef}>{
      entries?.map((entry) => (
        <div key={entry.id} className="flex">
          <EntryDataProvider reportId={reportId} entryId={entry.id}>
            <Entry />
            <Receipt />
          </EntryDataProvider>
        </div>
      ))
    }</div>
  );
};

export default Entries;
