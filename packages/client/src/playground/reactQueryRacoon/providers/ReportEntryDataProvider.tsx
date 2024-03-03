import React, {createContext, useMemo, type FC, type ReactNode, useRef, useEffect} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {gqlClient} from '../client';
import { useAtom } from '../hooks/useAtom';
import { loadingAtom } from '../atoms/loadingAtom';
import {keys, type ReportDataType} from '../keys';
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
import { useOverseer } from '../hooks/useOverseer';
import { queriesAtom } from '../atoms/queriesAtom';
import { useAtomLazy } from '../hooks/useAtomLazy';
import { triggerRequestEvent } from '../events/triggerRequestEvent';

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
  const client = useQueryClient();

  const {events} = useOverseer();

  const [, setQueries] = useAtomLazy(queriesAtom);
  const [, setIsLoading] = useAtom(loadingAtom);

  const includeFragmentsRef = useRef(new Set<
    | 'includeAmount'
    | 'includeReceipt'
    | 'includeExceptions'>()
  );

  // Main query that fetches the entry data and its fragments.
  const {refetch} = useQuery({
    queryKey: [`$GetReportEntry:${entryId}`],
    // TODO disable initial fetch, how can we do this better?
    enabled: false,
    // Fetch the entry's requested fragments.
    queryFn: () => gqlClient.request(GET_RACOON_ENTRY, {
      id: entryId,
      includeAmount: includeFragmentsRef.current.has('includeAmount'),
      includeReceipt: includeFragmentsRef.current.has('includeReceipt'),
      includeExceptions: includeFragmentsRef.current.has('includeExceptions')
    }),
    // Save each data fragment to the cache under the appropriate key.
    onSuccess: (data) => {
      if (data.racoon.entry.amount !== undefined) {
        includeFragmentsRef.current.delete('includeAmount');
        setQueries((queries) => queries.set(keys.reportEntry.getReportEntryAmount(reportId, entryId), DataStatus.LATEST));
        // TODO
        client.setQueryData<ReportDataType['entries']|void>(keys.report.getReportEntries(reportId), (entries) => {
          for (const entry of entries!) {
            if (entry.id === entryId) {
              entry.amount = data.racoon.entry.amount!;
              break;
            }
          }
        });
        client.setQueryData(keys.reportEntry.getReportEntryAmount(reportId, entryId), data.racoon.entry.amount);
      }
      if (data.racoon.entry.receipt !== undefined) {
        includeFragmentsRef.current.delete('includeReceipt');
        setQueries((queries) => queries.set(keys.reportEntry.getReportEntryReceipt(reportId, entryId), DataStatus.LATEST));
        // TODO
        client.setQueryData<ReportDataType['entries']|void>(keys.report.getReportEntries(reportId), (entries) => {
          for (const entry of entries!) {
            if (entry.id === entryId) {
              entry.receipt = data.racoon.entry.receipt;
              break;
            }
          }
        });
        client.setQueryData(keys.reportEntry.getReportEntryReceipt(reportId, entryId), data.racoon.entry.receipt);
      }
      if (data.racoon.entry.exceptions !== undefined) {
        includeFragmentsRef.current.delete('includeExceptions');
        // TODO what about the report exceptions??
        setQueries((queries) => queries.set(keys.report.getEntryExceptions(reportId, entryId), DataStatus.LATEST));
        client.setQueryData(keys.report.getEntryExceptions(reportId, entryId), data.racoon.entry.exceptions);
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
      setQueries((queries) => queries.set(keys.reportEntry.getReportEntryAmount(reportId, entryId), DataStatus.STALE));
      setQueries((queries) => queries.set(keys.report.getReportTotalAmount(reportId), DataStatus.STALE));

      // Invalidate the report total amount and entry queries so that components can ask for fresh data.
      client.invalidateQueries(keys.reportEntry.getReportEntryAmount(reportId, entryId));
      client.invalidateQueries(keys.report.getReportTotalAmount(reportId));
    }
  });

  // Mutate the entry receipt (attach/detach).
  const {mutate: updateEntryReceipt} = useMutation({
    mutationFn: (variables: UpdateRacoonEntryReceiptMutationVariables) => {
      setIsLoading(true);
      return gqlClient.request(UPDATE_RACOON_ENTRY_RECEIPT, variables);
    },
    onSuccess: () => {
      // TODO wrap client.invalidateQueries and setQueries in a helper hook function.
      setQueries((queries) => queries.set(keys.reportEntry.getReportEntryReceipt(reportId, entryId), DataStatus.STALE));
      setQueries((queries) => queries.set(keys.report.getReportExceptions(reportId), DataStatus.STALE));
      setQueries((queries) => queries.set(keys.report.getEntryExceptions(reportId, entryId), DataStatus.STALE));

      // Invalidate the exceptions and entry queries so that components can ask for fresh data.
      client.invalidateQueries(keys.reportEntry.getReportEntryReceipt(reportId, entryId));
      client.invalidateQueries({
        queryKey: keys.report.getReportExceptions(reportId),
        // NOTE: We need to evict only the report exceptions, else the entry exceptions for
        //  both entries (even if unchanged) will be refetched.
        exact: true
      });
      client.invalidateQueries(keys.report.getEntryExceptions(reportId, entryId));
    }
  });

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

    // NOTE: refetch doesn't accept arguments, so we need to use a ref.
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
