import React from 'react'
import Entry from './Entry';
import Receipt from './Receipt';
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useReadReportEntriesData } from '../hooks/useReportData';
import { ReportEntryDataProvider } from '../providers/ReportEntryDataProvider';

const Entries = ({reportId}: {reportId: string}) => {
  const componentRef = useFlashOnRender();
  const entries = useReadReportEntriesData();

  return (
    <div ref={componentRef}>{
      entries?.map((entry) => (
        <div key={entry.id} className="flex">
          <ReportEntryDataProvider reportId={reportId} entryId={entry.id}>
            <Entry />
            <Receipt />
          </ReportEntryDataProvider>
        </div>
      ))
    }</div>
  );
};

export default Entries;
