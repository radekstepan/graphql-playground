import React, {createContext, useMemo, useEffect, useRef, type FC, type ReactNode} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query'
import {gqlClient} from '../client';
import { triggerRequestEvent } from '../events/triggerRequestEvent';
import { loadingAtom } from '../atoms/loadingAtom';
import { useAtomLazy } from '../hooks/useAtomLazy';
import { useOverseer } from '../hooks/useOverseer';
import { useSetQueryData } from '../hooks/useSetQueryData';
import { useGetQueryData } from '../hooks/useGetQueryData';
import { listById } from '../utils';
import {keys} from '../keys';
import { DataStatus } from '../interfaces';
import {GET_RACOON_REPORT} from '../../../queries';

export interface ReportDataValue {
  reportId: string
}

const defaultValue = {
  reportId: '',
};

export const ReportDataContext = createContext<ReportDataValue>(defaultValue);

// The provider that fetches the report data (and its fragments) and provides the data to the components.
export const ReportDataProvider: FC<{reportId: string, children: ReactNode}> = ({ reportId, children }) => {
  const {events} = useOverseer();

  const [, setIsLoading] = useAtomLazy(loadingAtom);

  const setQueryData = useSetQueryData();
  const getQueryData = useGetQueryData();

  // Immediately set a list of fragments to include as the below query fetches on mount.
  const includeFragmentsRef = useRef(new Set<
    | 'includeName'
    | 'includeTotalAmount'
    | 'includeExceptions'
    | 'includeEntries'>([
      'includeName',
      'includeTotalAmount',
      'includeExceptions',
      'includeEntries'
    ])
  );

  // Main query that fetches the report data and its fragments.
  const {refetch} = useQuery({
    queryKey: [`$GetReport:${reportId}`], // <-- ignore this key
    // Fetch the report's requested fragments.
    queryFn: () => {
      setIsLoading(true);
      return gqlClient.request(GET_RACOON_REPORT, {
        includeName: includeFragmentsRef.current.has('includeName'),
        includeTotalAmount: includeFragmentsRef.current.has('includeTotalAmount'),
        includeExceptions: includeFragmentsRef.current.has('includeExceptions'),
        includeEntries: includeFragmentsRef.current.has('includeEntries'),
      });
    },
    // Save each data fragment to the cache under the appropriate key.
    onSuccess: (data) => {
      // You could walk the fragments here, but leaving as is for simplicity.
      if (data.racoon.report.name !== undefined) {
        includeFragmentsRef.current.delete('includeName');
        setQueryData(DataStatus.LATEST, keys.report.getReportName(reportId), data.racoon.report.name);
      }
      if (data.racoon.report.totalAmount !== undefined) {
        includeFragmentsRef.current.delete('includeTotalAmount');
        setQueryData(DataStatus.LATEST, keys.report.getReportTotalAmount(reportId), data.racoon.report.totalAmount);
      }
      if (data.racoon.report.entries !== undefined) {
        includeFragmentsRef.current.delete('includeEntries');
        // Save the data for each entry.
        for (const entry of data.racoon.report.entries) {
          setQueryData(DataStatus.LATEST, keys.reportEntry.getReportEntry(reportId, entry.id), entry);
          setQueryData(DataStatus.LATEST, keys.reportEntry.getReportEntryAmount(reportId, entry.id), entry.amount);
          setQueryData(DataStatus.LATEST, keys.reportEntry.getReportEntryReceipt(reportId, entry.id), entry.receipt);
        }
        // Save the list.
        setQueryData(DataStatus.LATEST, keys.report.getReportEntries(reportId), data.racoon.report.entries);
      }
      if (data.racoon.report.exceptions !== undefined) {
        includeFragmentsRef.current.delete('includeExceptions');
        // Save the exceptions for each entry.
        const entries = getQueryData(keys.report.getReportEntries(reportId)) ?? [];
        const entryExceptions = listById(data.racoon.report.exceptions, "entryId");
        for (const entryStub of entries) {
          setQueryData(DataStatus.LATEST, keys.report.getEntryExceptions(reportId, entryStub.id), entryExceptions[entryStub.id] ?? []);
        }
        // Save the list.
        setQueryData(DataStatus.LATEST, keys.report.getReportExceptions(reportId), data.racoon.report.exceptions);
      }
    },
    onSettled: () => {
      if (!includeFragmentsRef.current.size) {
        setIsLoading(false);
      }
    }
  });

  useEffect(() => events.on(triggerRequestEvent, (queryKeys) => {
    for (const queryKey of queryKeys) {
      switch (queryKey) {
        case keys.report.getReportName(reportId):
          includeFragmentsRef.current.add('includeName');
          break;
        case keys.report.getReportTotalAmount(reportId):
          includeFragmentsRef.current.add('includeTotalAmount');
          break;
        case keys.report.getReportExceptions(reportId):
          includeFragmentsRef.current.add('includeExceptions');
          break;
        case keys.report.getReportEntries(reportId):
          includeFragmentsRef.current.add('includeEntries');
          break;
        default:
          break;
      }
    }

    // NOTE: refetch doesn't accept arguments, so we need to use a ref.
    if (includeFragmentsRef.current.size) {
      refetch();
    }
  }), []);

  const value = useMemo(() => ({
    reportId,
  }), []);

  return (
    <ReportDataContext.Provider value={value}>
      {children}
    </ReportDataContext.Provider>
  );
};
