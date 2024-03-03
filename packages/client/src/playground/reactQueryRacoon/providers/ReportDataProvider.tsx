import React, {createContext, useMemo, type FC, type ReactNode, useEffect, useRef} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query'
import {gqlClient} from '../client';
import {keys, type ReportDataType} from '../keys';
import { DataStatus } from '../interfaces';
import {GET_RACOON_REPORT} from '../../../queries';
import { useAtomLazy } from '../hooks/useAtomLazy';
import { queriesAtom } from '../atoms/queriesAtom';
import { triggerRequestEvent } from '../events/triggerRequestEvent';
import { useOverseer } from '../hooks/useOverseer';

export interface ReportDataValue {
  reportId: string
}

const noop = () => {
  throw new Error('Must be used within a ReportDataProvider');
};

const defaultValue = {
  reportId: '',
};

export const ReportDataContext = createContext<ReportDataValue>(defaultValue);

// The provider that fetches the report data (and its fragments) and provides the data to the components.
export const ReportDataProvider: FC<{reportId: string, children: ReactNode}> = ({ reportId, children }) => {
  const client = useQueryClient();

  const {events} = useOverseer();

  const [, setQueries] = useAtomLazy(queriesAtom);

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
    queryKey: [`$GetReport:${reportId}`],
    // Fetch the report's requested fragments.
    queryFn: () => gqlClient.request(GET_RACOON_REPORT, {
      includeName: includeFragmentsRef.current.has('includeName'),
      includeTotalAmount: includeFragmentsRef.current.has('includeTotalAmount'),
      includeExceptions: includeFragmentsRef.current.has('includeExceptions'),
      includeEntries: includeFragmentsRef.current.has('includeEntries'),
    }),
    // Save each data fragment to the cache under the appropriate key.
    onSuccess: (data) => {
      // You could walk the fragments here, but leaving as is for simplicity.
      if (data.racoon.report.name !== undefined) {
        includeFragmentsRef.current.delete('includeName');
        setQueries((queries) => queries.set(keys.report.getReportName(reportId), DataStatus.LATEST));
        client.setQueryData(keys.report.getReportName(reportId), data.racoon.report.name);
      }
      if (data.racoon.report.totalAmount !== undefined) {
        includeFragmentsRef.current.delete('includeTotalAmount');
        setQueries((queries) => queries.set(keys.report.getReportTotalAmount(reportId), DataStatus.LATEST));
        client.setQueryData(keys.report.getReportTotalAmount(reportId), data.racoon.report.totalAmount);
      }
      if (data.racoon.report.exceptions !== undefined) {
        includeFragmentsRef.current.delete('includeExceptions');
        // Save the exceptions for each entry.
        const entries = client.getQueryData<ReportDataType['entries']>(keys.report.getReportEntries(reportId)) ?? [];
        for (const entry of entries) {
          setQueries((queries) => queries.set(keys.report.getEntryExceptions(reportId, entry.id), DataStatus.LATEST));
          client.setQueryData(keys.report.getEntryExceptions(reportId, entry.id), []);
        }
        // Save the list.
        setQueries((queries) => queries.set(keys.report.getReportExceptions(reportId), DataStatus.LATEST));
        client.setQueryData(keys.report.getReportExceptions(reportId), data.racoon.report.exceptions);
      }
      if (data.racoon.report.entries !== undefined) {
        includeFragmentsRef.current.delete('includeEntries');
        // Save the data for each entry.
        for (const entry of data.racoon.report.entries) {
          setQueries((queries) => queries.set(keys.reportEntry.getReportEntry(reportId, entry.id), DataStatus.LATEST));
          setQueries((queries) => queries.set(keys.reportEntry.getReportEntryAmount(reportId, entry.id), DataStatus.LATEST));
          setQueries((queries) => queries.set(keys.reportEntry.getReportEntryReceipt(reportId, entry.id), DataStatus.LATEST));

          client.setQueryData(keys.reportEntry.getReportEntry(reportId, entry.id), entry);
          client.setQueryData(keys.reportEntry.getReportEntryAmount(reportId, entry.id), entry.amount);
          client.setQueryData(keys.reportEntry.getReportEntryReceipt(reportId, entry.id), entry.receipt);
        }
        // Save the list.
        setQueries((queries) => queries.set(keys.report.getReportEntries(reportId), DataStatus.LATEST));
        client.setQueryData(keys.report.getReportEntries(reportId), data.racoon.report.entries);
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
