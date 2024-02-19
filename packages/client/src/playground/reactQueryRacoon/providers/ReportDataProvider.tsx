import React, {createContext, useMemo, useRef, type FC, type ReactNode} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query'
import {gqlClient} from '../client';
import { useFetchData } from '../hooks/useFetchData';
import { useOnInvalidate } from '../hooks/useOnInvalidate';
import {keys, type ReportDataFragment, type ReportQueryKey} from '../keys';
import { DataStatus } from '../interfaces';
import {GET_RACOON_REPORT} from '../../../queries';

interface ReportData {
  reportId: string
  // Request the data fragment from the server if it's stale.
  requestData: (key: ReportQueryKey) => void
}

const noop = () => {
  throw new Error('Must be used within a ReportDataProvider');
};

const defaultValue = {
  reportId: '',
  requestData: noop
};

// Pluck the data fragment from the query key.
const getFragmentFromKey = (queryKey: ReportQueryKey): ReportDataFragment => queryKey[2];
// Turn a data fragment into a query key.
// const getKeyFromFragment = (reportId: string, fragment: DataFragment): QueryKey => KEYS[`getReport${fragment[0].toUpperCase()}${fragment.slice(1)}`](reportId);

export const ReportDataContext = createContext<ReportData>(defaultValue);

/**
 * The provider that fetches the report data (and its fragments) and provides the data to the components.
 * TODO:
 * - Is it OK that data is fetched potentially for a component that is unmounted? Apollo would just ignore the result.
 * - Should we concatenate the GQL instead of passing booleans to the query? This would impact how we write tests.
 * - Check if graphql-request uses an AbortController under the hood for when we navigate away from the page.
 * - Have a pattern for invoking a request for data immediately (fetchData.flush).
 */
export const ReportDataProvider: FC<{reportId: string, children: ReactNode}> = ({ reportId, children }) => {
  const client = useQueryClient();

  // Mark all fragments as stale and request we fetch them.
  const isStaleRef = useRef<Record<ReportDataFragment, DataStatus>>({
    name: DataStatus.REQUESTED,
    totalAmount: DataStatus.REQUESTED,
    exceptions: DataStatus.REQUESTED,
    entries: DataStatus.REQUESTED
  });

  // Main query that fetches the report data and its fragments.
  const {refetch: refetchReport} = useQuery({
    queryKey: [`$GetReport:${reportId}`], // <-- ignore this key
    // Fetch the report's requested fragments.
    queryFn: () => gqlClient.request(GET_RACOON_REPORT, {
      includeName: isStaleRef.current.name === DataStatus.REQUESTED,
      includeTotalAmount: isStaleRef.current.totalAmount === DataStatus.REQUESTED,
      includeExceptions: isStaleRef.current.exceptions === DataStatus.REQUESTED,
      includeEntries: isStaleRef.current.entries === DataStatus.REQUESTED
    }),
    // Save each data fragment to the cache under the appropriate key.
    onSuccess: (data) => {
      // You could walk the fragments here, but leaving as is for simplicity.
      if (data.racoon.report.name !== undefined) {
        client.setQueryData(keys.report.getReportName(reportId), data.racoon.report.name);
        isStaleRef.current.name = DataStatus.LATEST;
      }
      if (data.racoon.report.totalAmount !== undefined) {
        client.setQueryData(keys.report.getReportTotalAmount(reportId), data.racoon.report.totalAmount);
        isStaleRef.current.totalAmount = DataStatus.LATEST;
      }
      if (data.racoon.report.exceptions !== undefined) {
        client.setQueryData(keys.report.getReportExceptions(reportId), data.racoon.report.exceptions);
        isStaleRef.current.exceptions = DataStatus.LATEST;
      }
      // TODO "byId", "order"
      if (data.racoon.report.entries !== undefined) {
        client.setQueryData(keys.report.getReportEntries(reportId), data.racoon.report.entries);
        isStaleRef.current.entries = DataStatus.LATEST;
      }
    }
  });

  const requestData = useFetchData({
    isStaleRef,
    refetch: refetchReport,
    getFragmentFromKey
  });

  useOnInvalidate(keys.report.getReportExceptions(reportId), () => {
    isStaleRef.current.exceptions = DataStatus.STALE;
  });
  useOnInvalidate(keys.report.getReportTotalAmount(reportId), () => {
    isStaleRef.current.totalAmount = DataStatus.STALE;
  });

  const value = useMemo(() => ({
    reportId,
    requestData
  }), []);

  return (
    <ReportDataContext.Provider value={value}>
      {children}
    </ReportDataContext.Provider>
  );
};
