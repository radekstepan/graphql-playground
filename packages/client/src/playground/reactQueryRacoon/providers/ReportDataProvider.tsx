import React, {createContext, useMemo, useRef, type FC, type ReactNode} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query'
import {gqlClient} from '../client';
import { useFetchData } from '../hooks/useFetchData';
import { useOnInvalidate } from '../hooks/useOnInvalidate';
import {keys, type ReportDataType, type ReportDataFragment, type ReportQueryKey} from '../keys';
import { DataStatus } from '../interfaces';
import {GET_RACOON_REPORT} from '../../../queries';
import { listById } from '../utils';

export interface ReportDataValue {
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

export const ReportDataContext = createContext<ReportDataValue>(defaultValue);

// The provider that fetches the report data (and its fragments) and provides the data to the components.
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
      // TODO how can these deduplicate the entries ones?
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
        // Save the list.
        client.setQueryData(keys.report.getReportExceptions(reportId), data.racoon.report.exceptions);
        // Save the list by entryId.
        const byEntryId = listById(data.racoon.report.exceptions, 'entryId');
        // TODO Jesus Murphy! Need to first reset the cache for each entry.
        const entries = client.getQueryData<ReportDataType['entries']>(keys.report.getReportEntries(reportId)) ?? [];
        for (const entry of entries) {
          client.setQueryData(keys.report.getEntryExceptions(reportId, entry.id), []);
        }
        for (const [entryId, exceptions] of Object.entries(byEntryId)) {
          client.setQueryData(keys.report.getEntryExceptions(reportId, entryId), exceptions);
        }
        isStaleRef.current.exceptions = DataStatus.LATEST;
      }
      if (data.racoon.report.entries !== undefined) {
        // Save the list.
        client.setQueryData(keys.report.getReportEntries(reportId), data.racoon.report.entries);
        // Save the list by entryId.
        for (const entry of data.racoon.report.entries) {
          client.setQueryData(keys.reportEntry.getEntry(reportId, entry.id), entry);
          // TODO the fields between the report and entry won't be the same.
          client.setQueryData(keys.reportEntry.getEntryAmount(reportId, entry.id), entry.amount);
          client.setQueryData(keys.reportEntry.getEntryReceipt(reportId, entry.id), entry.receipt);
        }
        isStaleRef.current.entries = DataStatus.LATEST;
      }
    }
  });

  const requestData = useFetchData({
    isStaleRef,
    providerKey: 'reportDataProvider',
    refetch: refetchReport,
    getFragmentFromKey,
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
