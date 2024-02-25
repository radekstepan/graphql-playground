import React from 'react'
import {QueryClientProvider} from '@tanstack/react-query';
import client from './client';
import ReportName from './components/ReportName';
import ReportTotals from './components/ReportTotals';
import ReportExceptions from './components/ReportExceptions';
import Entries from './components/Entries';
import Loading from './components/Loading';
import {AtomStateProvider} from './providers/AtomStateProvider';
import {ReportDataProvider} from './providers/ReportDataProvider';
import './styles.less'

function App() {
  return (
    <div id="racoon">
      <ReportDataProvider reportId="REP_1">
        <div className="flex section">
          <ReportName />
          <ReportTotals />
        </div>
        <div>
          <ReportExceptions />
        </div>
        <div className="section">
          <Entries reportId="REP_1" />
        </div>
        <div className="section">
          <Loading />
        </div>
      </ReportDataProvider>
    </div>
  );
};

function Wrapper() {
  return (
    <AtomStateProvider>
      <QueryClientProvider client={client()}>
        <App />
      </QueryClientProvider>
    </AtomStateProvider>
  )
};

export default Wrapper;
