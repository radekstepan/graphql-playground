import React, { type FC } from 'react'
import { ReportQueryProvider } from '../providers/ReportQueryProvider';
import {useAtom} from '../hooks/useAtom';
import { pageAtom } from '../atoms/pageAtom';
import ReportName from '../components/ReportName';
import ReportTotals from '../components/ReportTotals';
import ReportCashAdvances from '../components/ReportCashAdvances';
import ReportExceptions from '../components/ReportExceptions';
import Entries from '../components/Entries';

const ReportPage = () => {
  const [page] = useAtom(pageAtom);

  if (page.entryId) {
    return null;
  }

  return (
    <ReportQueryProvider reportId={page.reportId}>
      <div className="flex section">
        <ReportName />
        <ReportTotals />
      </div>
      <div className="section">
        <ReportCashAdvances />
      </div>
      <div>
        <ReportExceptions />
      </div>
      <div className="section">
        <Entries reportId={page.reportId} />
      </div>
    </ReportQueryProvider>
  );
};

export default ReportPage;
