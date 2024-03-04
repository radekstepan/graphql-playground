import React, {createContext, useMemo, useRef, useEffect, type FC, type ReactNode} from 'react';
import {useQuery, useMutation} from '@tanstack/react-query'
import {gqlClient} from '../client';
import { loadingAtom } from '../atoms/loadingAtom';
import { useOverseer } from '../hooks/useOverseer';
import { useAtomSetter } from '../hooks/useAtom';
import { useSetQueryData } from '../hooks/useSetQueryData';
import { triggerRequestEvent } from '../events/triggerRequestEvent';
import {keys} from '../keys';
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

export interface ReportEntryDataValue {
  reportId: string
  entryId: string
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
  const {events} = useOverseer();

  const setIsLoading = useAtomSetter(loadingAtom);

  const setQueryData = useSetQueryData();

  const includeFragmentsRef = useRef(new Set<
    | 'includeAmount'
    | 'includeReceipt'
    | 'includeExceptions'>()
  );

  // Main query that fetches the entry data and its fragments.
  const {refetch} = useQuery({
    queryKey: [`$GetReportEntry:${entryId}`], // <-- ignore this key
    enabled: false,
    // Fetch the entry's requested fragments.
    queryFn: () => {
      setIsLoading(true);
      return gqlClient.request(GET_RACOON_ENTRY, {
        id: entryId,
        includeAmount: includeFragmentsRef.current.has('includeAmount'),
        includeReceipt: includeFragmentsRef.current.has('includeReceipt'),
        includeExceptions: includeFragmentsRef.current.has('includeExceptions')
      });
    },
    // Save each data fragment to the cache under the appropriate key.
    onSuccess: (data) => {
      if (data.racoon.entry.amount !== undefined) {
        includeFragmentsRef.current.delete('includeAmount');
        // NOTE: the report entries list is not modified.
        setQueryData(DataStatus.LATEST, keys.reportEntry.getReportEntryAmount(reportId, entryId), data.racoon.entry.amount);
      }
      if (data.racoon.entry.receipt !== undefined) {
        includeFragmentsRef.current.delete('includeReceipt');
        // NOTE: the report entries list is not modified.
        setQueryData(DataStatus.LATEST, keys.reportEntry.getReportEntryReceipt(reportId, entryId), data.racoon.entry.receipt);
      }
      if (data.racoon.entry.exceptions !== undefined) {
        includeFragmentsRef.current.delete('includeExceptions');
        setQueryData(DataStatus.LATEST, keys.report.getEntryExceptions(reportId, entryId), data.racoon.entry.exceptions);
      }
    },
    onSettled: () => {
      if (!includeFragmentsRef.current.size) {
        setIsLoading(false);
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
      setQueryData(DataStatus.STALE, keys.reportEntry.getReportEntryAmount(reportId, entryId));
      setQueryData(DataStatus.STALE, keys.report.getReportTotalAmount(reportId));
    }
  });

  // Mutate the entry receipt (attach/detach).
  const {mutate: updateEntryReceipt} = useMutation({
    mutationFn: (variables: UpdateRacoonEntryReceiptMutationVariables) => {
      setIsLoading(true);
      return gqlClient.request(UPDATE_RACOON_ENTRY_RECEIPT, variables);
    },
    onSuccess: () => {
      setQueryData(DataStatus.STALE, keys.report.getReportExceptions(reportId));
      setQueryData(DataStatus.STALE, keys.report.getEntryExceptions(reportId, entryId));
      setQueryData(DataStatus.STALE, keys.reportEntry.getReportEntryReceipt(reportId, entryId));
    }
  });

  // Refetch the data when one of our known query keys is triggered.
  // NOTE: refetch doesn't accept arguments, so we need to use this and a ref.
  useEffect(() => events.on(triggerRequestEvent, (queryKeys) => {
    for (const queryKey of queryKeys) {
      switch (queryKey) {
        case keys.reportEntry.getReportEntryAmount(reportId, entryId):
          includeFragmentsRef.current.add('includeAmount');
          break;
        case keys.reportEntry.getReportEntryReceipt(reportId, entryId):
          includeFragmentsRef.current.add('includeReceipt');
          break;
        case keys.report.getEntryExceptions(reportId, entryId):
          includeFragmentsRef.current.add('includeExceptions');
          break;
        default:
          break;
      }
    }

    if (includeFragmentsRef.current.size) {
      refetch();
    }
  }), []);

  const value = useMemo(() => ({
    reportId,
    entryId,
    updateEntryAmount,
    updateEntryReceipt
  }), []);

  return (
    <ReportEntryDataContext.Provider value={value}>
      {children}
    </ReportEntryDataContext.Provider>
  );
};
