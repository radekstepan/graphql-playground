import React, {createContext, useMemo, useEffect, useRef, useContext, type FC, type ReactNode} from 'react';
import {useQuery} from '@tanstack/react-query'
import { OverseerContext } from './OverseerProvider';
import {gqlClient} from '../client';
import { triggerRequestEvent } from '../events/triggerRequestEvent';
import { loadingAtom } from '../atoms/loadingAtom';
import { queriesAtom } from '../atoms/queriesAtom';
import { useAtomLazy, useAtomSetter } from '../hooks/useAtom';
import { useSetQueryData } from '../hooks/useSetQueryData';
import { useGetQueryData } from '../hooks/useGetQueryData';
import { listById } from '../utils';
import {keys} from '../keys';
import { DataStatus } from '../interfaces';
import {GET_REPORT} from '../../queries';

export interface ReportQueryValue {
  reportId: string
}

const defaultValue = {
  reportId: '',
};

export const ReportQueryContext = createContext<ReportQueryValue>(defaultValue);

// The provider that fetches the report data (and its fragments) and provides the data to the components.
export const ReportQueryProvider: FC<{reportId: string, children: ReactNode}> = ({ reportId, children }) => {
  const {events} = useContext(OverseerContext);
  const setIsLoading = useAtomSetter(loadingAtom);
  const setQueryData = useSetQueryData();
  const getQueryData = useGetQueryData();

  // Immediately set a list of fragments to include as the below query fetches on mount.
  const includeFragmentsRef = useRef(new Set<
    | 'includeName'
    | 'includeTotalAmount'
    | 'includeExceptions'
    | 'includeEntries'>()
  );

  // Main query that fetches the report data and its fragments.
  const {refetch} = useQuery({
    queryKey: [`$GetReport:${reportId}`], // <-- ignore this key
    enabled: false,
    // Fetch the report's requested fragments.
    queryFn: () => {
      setIsLoading(true);
      return gqlClient.request(GET_REPORT, {
        reportId,
        includeName: includeFragmentsRef.current.has('includeName'),
        includeTotalAmount: includeFragmentsRef.current.has('includeTotalAmount'),
        includeExceptions: includeFragmentsRef.current.has('includeExceptions'),
        includeEntries: includeFragmentsRef.current.has('includeEntries'),
      });
    },
    // Save each data fragment to the cache under the appropriate key.
    onSuccess: (data) => {
      // You could walk the fragments here, but leaving as is for simplicity.
      if (data.report.name !== undefined) {
        includeFragmentsRef.current.delete('includeName');
        setQueryData(DataStatus.LATEST, keys.report.getReportName(reportId), data.report.name);
      }
      if (data.report.totalAmount !== undefined) {
        includeFragmentsRef.current.delete('includeTotalAmount');
        setQueryData(DataStatus.LATEST, keys.report.getReportTotalAmount(reportId), data.report.totalAmount);
      }
      if (data.report.entries !== undefined) {
        includeFragmentsRef.current.delete('includeEntries');
        // Save the data for each entry.
        for (const entry of data.report.entries) {
          setQueryData(DataStatus.LATEST, keys.reportEntry.getReportEntryAmount(reportId, entry.id), entry.amount);
          setQueryData(DataStatus.LATEST, keys.reportEntry.getReportEntryReceipt(reportId, entry.id), entry.receipt);
        }
        // Save the list.
        setQueryData(DataStatus.LATEST, keys.report.getReportEntries(reportId), data.report.entries);
      }
      if (data.report.exceptions !== undefined) {
        includeFragmentsRef.current.delete('includeExceptions');
        // Save the exceptions for each entry.
        const entries = getQueryData(keys.report.getReportEntries(reportId)) ?? [];
        const entryExceptions = listById(data.report.exceptions, "entryId");
        for (const entryStub of entries) {
          setQueryData(DataStatus.LATEST, keys.report.getEntryExceptions(reportId, entryStub.id), entryExceptions[entryStub.id] ?? []);
        }
        // Save the list.
        setQueryData(DataStatus.LATEST, keys.report.getReportExceptions(reportId), data.report.exceptions);
      }
    },
    onSettled: () => {
      if (!includeFragmentsRef.current.size) {
        setIsLoading(false);
      }
    }
  });

  // Refetch the data when one of our known query keys is triggered.
  // NOTE: refetch doesn't accept arguments, so we need to use this and a ref.
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

    if (includeFragmentsRef.current.size) {
      refetch();
    }
  }), []);

  const [queries] = useAtomLazy(queriesAtom);

  // Trigger the initial load.
  // NOTE: you'd likely want to check what the status of all queries
  //  we care about is instead.
  useEffect(() => {
    const q = queries();
    if (!q.size) {
      includeFragmentsRef.current.add('includeName');
      includeFragmentsRef.current.add('includeTotalAmount');
      includeFragmentsRef.current.add('includeExceptions');
      includeFragmentsRef.current.add('includeEntries');
      refetch();
    }
  }, []);

  const value = useMemo(() => ({
    reportId,
  }), []);

  return (
    <ReportQueryContext.Provider value={value}>
      {children}
    </ReportQueryContext.Provider>
  );
};
