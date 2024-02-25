import React, {createContext, useMemo, useRef, type FC, type ReactNode} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {gqlClient} from '../client';
import { useAtom } from '../hooks/useAtom';
import { useFetchData } from '../hooks/useFetchData';
import { useOnInvalidate } from '../hooks/useOnInvalidate';
import { useInvalidateQuery } from '../hooks/useInvalidateQuery';
import { loadingAtom } from '../atoms/loadingAtom';
import {keys, type EntryQueryKey, type EntryDataFragment, type ReportDataType} from '../keys';
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

interface EntryData {
  reportId: string
  entryId: string
  // Request the data fragment from the server if it's stale.
  requestData: (key: EntryQueryKey) => void
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
  throw new Error('Must be used within an EntryDataProvider');
};

const defaultValue = {
  reportId: '',
  entryId: '',
  requestData: noop,
  updateEntryAmount: noop,
  updateEntryReceipt: noop
};

// Pluck the data fragment from the query key.
const getFragmentFromKey = (queryKey: EntryQueryKey): EntryDataFragment|null => queryKey[4] ?? null;

export const EntryDataContext = createContext<EntryData>(defaultValue);

// The provider that fetches the entry data (and its fragments) and provides the data to the components.
export const EntryDataProvider: FC<{
  reportId: string,
  entryId: string,
  children: ReactNode
}> = ({ reportId, entryId, children }) => {
  const client = useQueryClient();
  const invalidate = useInvalidateQuery();

  const [, setIsLoading] = useAtom(loadingAtom);

  // Mark all fragments as stale and request we fetch them.
  // TODO have an "indeterminate" state to only fetch the data if it is not in the cache
  //  already so that we can work independently or as child of ReportDataProvider.
  const isStaleRef = useRef<Record<EntryDataFragment, DataStatus>>({
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
          // TODO save by "byId"
          for (const entry of entries!) {
            if (entry.id === entryId) {
              entry.amount = data.racoon.entry.amount!;
              break;
            }
          }
        });
        client.invalidateQueries(keys.report.getReportEntries(reportId));
        isStaleRef.current.amount = DataStatus.LATEST;
      }
      if (data.racoon.entry.receipt !== undefined) {
        // TODO
        client.setQueryData<ReportDataType['entries']|void>(keys.report.getReportEntries(reportId), (entries) => {
          // TODO save by "byId"
          for (const entry of entries!) {
            if (entry.id === entryId) {
              entry.receipt = data.racoon.entry.receipt;
              break;
            }
          }
        });
        client.invalidateQueries(keys.report.getReportEntries(reportId));
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
      invalidate(keys.entry.getEntryAmount(reportId, entryId));
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
      invalidate(keys.entry.getEntryReceipt(reportId, entryId));
      invalidate(keys.report.getReportExceptions(reportId));
    }
  });

  const requestData = useFetchData({
    isStaleRef,
    refetch: refetchEntry,
    getFragmentFromKey
  });

  useOnInvalidate(keys.entry.getEntryAmount(reportId, entryId), () => {
    isStaleRef.current.amount = DataStatus.STALE;
  });
  useOnInvalidate(keys.entry.getEntryReceipt(reportId, entryId), () => {
    isStaleRef.current.receipt = DataStatus.STALE;
  });

  const value = useMemo(() => ({
    reportId,
    entryId,
    requestData,
    updateEntryAmount,
    updateEntryReceipt
  }), []);

  return (
    <EntryDataContext.Provider value={value}>
      {children}
    </EntryDataContext.Provider>
  );
};
