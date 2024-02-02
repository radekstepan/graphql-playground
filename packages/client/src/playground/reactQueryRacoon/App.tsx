import React from 'react'
import {QueryClientProvider} from '@tanstack/react-query';
import client from './client';
import ReportName from './components/ReportName';
import ReportTotals from './components/ReportTotals';
import Exceptions from './components/Exceptions';
import Entry from './components/Entry';
import Receipt from './components/Receipt';
import { ReportDataProvider } from './providers/ReportDataProvider';
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
          <Exceptions />
        </div>
        <div className="flex section">
          <Entry />
          <Receipt />
        </div>
      </ReportDataProvider>
    </div>
  );
};

function Wrapper() {
  return (
    <QueryClientProvider client={client()}>
      <App />
    </QueryClientProvider>
  )
};

export default Wrapper;
