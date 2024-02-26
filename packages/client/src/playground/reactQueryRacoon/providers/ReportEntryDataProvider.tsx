import React, {createContext, useMemo, useRef, type FC, type ReactNode, useCallback, useContext} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {gqlClient} from '../client';
import { ReportDataContext } from './ReportDataProvider';
import { useAtom } from '../hooks/useAtom';
import { useFetchData } from '../hooks/useFetchData';
import { useOnInvalidate } from '../hooks/useOnInvalidate';
import { useInvalidateQuery } from '../hooks/useInvalidateQuery';
import { loadingAtom } from '../atoms/loadingAtom';
import {keys, type ReportEntryQueryKey, type ReportEntryDataFragment, type ReportDataType} from '../keys';
import { DataStatus } from '../interfaces';
import {
  GET_RACOON_ENTRY,
  UPDATE_RACOON_ENTRY_AMOUNT,
  UPDATE_RACOON_ENTRY_RECEIPT
} from '../../../queries';
import {
  type UpdateRacoonEntryAmountMutationVariables,
  type UpdateRacoonEntryReceiptMutationVariables
} from '../../../__generated/graphql';
import { REPORT_KEY } from '../constants';

export interface ReportEntryDataValue {
  reportId: string
  entryId: string
  // Request the data fragment from the server if it's stale.
  requestData: (key:  ReportEntryQueryKey) => void
  // Update the entry amount and mark the total amount and entry as stale.
  updateEntryAmount: (
    variables: UpdateRacoonEntryAmountMutationVariables
  ) => void
  // Update the entry receipt and mark the exceptions and entry as stale.
  updateEntryReceipt: (
    variables: UpdateRacoonEntryReceiptMutationVariables
  ) => void
}

const noop = () => {
  throw new Error('Must be used within an ReportEntryDataProvider');
};

const defaultValue = {
  reportId: '',
  entryId: '',
  requestData: noop,
  updateEntryAmount: noop,
  updateEntryReceipt: noop
};

export const ReportEntryDataContext = createContext<ReportEntryDataValue>(defaultValue);

// The provider that fetches the entry data (and its fragments) and provides the data to the components.
export const ReportEntryDataProvider: FC<{
  reportId: string,
  entryId: string,
  children: ReactNode
}> = ({ reportId, entryId, children }) => {
  const reportContext = useContext(ReportDataContext);

  const client = useQueryClient();
  const invalidate = useInvalidateQuery();

  const [, setIsLoading] = useAtom(loadingAtom);

  // Mark all fragments as stale and request we fetch them.
  // TODO have an "indeterminate" state to only fetch the data if it is not in the cache
  //  already so that we can work independently or as child of ReportDataProvider.
  const isStaleRef = useRef<Record<ReportEntryDataFragment, DataStatus>>({
    amount: DataStatus.LATEST,
    receipt: DataStatus.LATEST,
    exceptions: DataStatus.LATEST
  });

  // Main query that fetches the entry data and its fragments.
  const {refetch: refetchEntry} = useQuery({
    queryKey: [`$GetEntry:${entryId}`], // <-- ignore this key
    // TODO disable initial fetch, how can we do this better?
    enabled: false,
    // Fetch the entry's requested fragments.
    queryFn: () => gqlClient.request(GET_RACOON_ENTRY, {
      id: entryId,
      includeAmount: isStaleRef.current.amount === DataStatus.REQUESTED,
      includeReceipt: isStaleRef.current.receipt === DataStatus.REQUESTED,
      includeExceptions: isStaleRef.current.exceptions === DataStatus.REQUESTED,
    }),
    // Save each data fragment to the cache under the appropriate key.
    onSuccess: (data) => {
      if (data.racoon.entry.amount !== undefined) {
        // TODO
        client.setQueryData<ReportDataType['entries']|void>(keys.report.getReportEntries(reportId), (entries) => {
          for (const entry of entries!) {
            if (entry.id === entryId) {
              entry.amount = data.racoon.entry.amount!;
              break;
            }
          }
        });
        client.setQueryData(keys.reportEntry.getEntryAmount(reportId, entryId), data.racoon.entry.amount);

        client.invalidateQueries(keys.reportEntry.getEntryAmount(reportId, entryId));
        client.invalidateQueries(keys.report.getReportEntries(reportId));

        isStaleRef.current.amount = DataStatus.LATEST;
      }
      if (data.racoon.entry.receipt !== undefined) {
        // TODO
        client.setQueryData<ReportDataType['entries']|void>(keys.report.getReportEntries(reportId), (entries) => {
          for (const entry of entries!) {
            if (entry.id === entryId) {
              entry.receipt = data.racoon.entry.receipt;
              break;
            }
          }
        });
        client.setQueryData(keys.reportEntry.getEntryReceipt(reportId, entryId), data.racoon.entry.receipt);

        client.invalidateQueries(keys.reportEntry.getEntryReceipt(reportId, entryId));
        client.invalidateQueries(keys.report.getReportEntries(reportId));

        isStaleRef.current.receipt = DataStatus.LATEST;
      }
      if (data.racoon.entry.exceptions !== undefined) {
        // TODO what about the report exceptions??
        client.setQueryData(keys.report.getEntryExceptions(reportId, entryId), data.racoon.entry.exceptions);
        client.invalidateQueries(keys.report.getEntryExceptions(reportId, entryId));

        isStaleRef.current.receipt = DataStatus.LATEST;
      }
    }
  });

  // Mutate the entry amount ++.
  const {mutate: updateEntryAmount} = useMutation({
    mutationFn: (variables: UpdateRacoonEntryAmountMutationVariables) => {
      setIsLoading(true);
      return gqlClient.request(UPDATE_RACOON_ENTRY_AMOUNT, variables);
    },
    onSuccess: () => {
      isStaleRef.current.amount = DataStatus.STALE;
      // Invalidate the report total amount and entry queries so that components can ask for fresh data.
      invalidate(keys.reportEntry.getEntryAmount(reportId, entryId));
      invalidate(keys.report.getReportTotalAmount(reportId));
    }
  });

  // Mutate the entry receipt (attach/detach).
  const {mutate: updateEntryReceipt} = useMutation({
    mutationFn: (variables: UpdateRacoonEntryReceiptMutationVariables) => {
      setIsLoading(true);
      return gqlClient.request(UPDATE_RACOON_ENTRY_RECEIPT, variables);
    },
    onSuccess: () => {
      isStaleRef.current.receipt = DataStatus.STALE;
      // Invalidate the exceptions and entry queries so that components can ask for fresh data.
      invalidate(keys.reportEntry.getEntryReceipt(reportId, entryId));
      invalidate(keys.report.getReportExceptions(reportId), true);
      invalidate(keys.report.getEntryExceptions(reportId, entryId));
    }
  });

  const requestData = useFetchData({
    isStaleRef,
    refetch: refetchEntry,
    providerKey: 'reportEntryDataProvider',
    // TODO
    getFragmentFromKey: (queryKey: any): ReportEntryDataFragment|null => {
      switch (JSON.stringify(queryKey)) {
        case JSON.stringify(keys.report.getEntryExceptions(reportId, entryId)):
          return 'exceptions';
        default:
          return queryKey[4] ?? null
      }
    },
  });

  // Mark our fragments as stale when a key gets invalidated.
  useOnInvalidate(keys.reportEntry.getEntryAmount(reportId, entryId), () => {
    isStaleRef.current.amount = DataStatus.STALE;
  });
  useOnInvalidate(keys.reportEntry.getEntryReceipt(reportId, entryId), () => {
    isStaleRef.current.receipt = DataStatus.STALE;
  });
  useOnInvalidate(keys.report.getEntryExceptions(reportId, entryId), () => {
    isStaleRef.current.exceptions = DataStatus.STALE;
  });

  const value = useMemo(() => ({
    reportId,
    entryId,
    requestData,
    updateEntryAmount,
    updateEntryReceipt
  }), []);

  return (
    <ReportEntryDataContext.Provider value={value}>
      {children}
    </ReportEntryDataContext.Provider>
  );
};
