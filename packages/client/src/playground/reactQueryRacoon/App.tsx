import React from 'react'
import {QueryClientProvider} from '@tanstack/react-query';
import client from './client';
import ReportPage from './pages/ReportPage';
import EntryPage from './pages/EntryPage';
import Loading from './components/Loading';
import {AtomStateProvider} from './providers/AtomStateProvider';
import { OverseerProvider } from './providers/OverseerProvider';
import './styles.less'

function App() {
  return (
    <div id="racoon">
      <ReportPage />
      <EntryPage />
      <div className="section">
        <Loading />
      </div>
    </div>
  );
};

function Wrapper() {
  return (
    <AtomStateProvider>
      <QueryClientProvider client={client()}>
        <OverseerProvider>
          <App />
        </OverseerProvider>
      </QueryClientProvider>
    </AtomStateProvider>
  )
};

export default Wrapper;
