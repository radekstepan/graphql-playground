import React, {type FC, type ReactNode, createContext, useCallback, useEffect, useMemo, useRef} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import debounce from 'debounce';
import {gqlClient} from '../client';
import {loadingAtom} from '../atoms/loadingAtom';
import {GET_RACOON_REPORT, UPDATE_RACOON_ENTRY, UPDATE_RACOON_RECEIPT} from '../../../queries';
import {type GetRacoonReportQuery} from '../../../__generated/graphql';
import { useAtom } from '../hooks/useAtom';

type ReportDataType = GetRacoonReportQuery['racoon']['report'];
// The data fragments that we can request from the server.
type DataFragment = keyof Pick<ReportDataType, 'name'|'totalAmount'|'exceptions'|'expenses'>;

interface ReportData {
  // Request the data fragment from the server if it's stale.
  requestData: (key: QueryKey) => void
  // Update the entry and mark the total amount and expenses as stale.
  updateEntry: () => void
  // Update the receipt and mark the exceptions and expenses as stale.
  updateReceipt: () => void
}

// The status of the data fragment.
const enum DataStatus {
  LATEST = 1, // data is up to date
  REQUESTED = 2, // data is being fetched
  STALE = 3, // data is stale
}

// The query keys that we store in the cache.
type QueryKey = [string, {report: string} & {[key in DataFragment]?: true}];
// The function that returns the query key for the given reportId.
export type KeyFunction = (reportId: string) => QueryKey;

const noop = () => {
  throw new Error('ReportDataProvider is not provided');
};

const defaultValue = {
  requestData: noop,
  updateEntry: noop,
  updateReceipt: noop
};

export const KEYS: Record<string, KeyFunction> = {
  getReport: (reportId: string) => ['racoon', {report: reportId}],
  getReportName: (reportId: string) => ['racoon', {report: reportId, name: true}],
  getReportTotalAmount: (reportId: string) => ['racoon', {report: reportId, totalAmount: true}],
  getReportExceptions: (reportId: string) => ['racoon', {report: reportId, exceptions: true}],
  getReportExpenses: (reportId: string) => ['racoon', {report: reportId, expenses: true}],
}

// Pluck the data fragment from the query key.
const getFragmentFromKey = (queryKey: QueryKey): DataFragment => {
  const [key] = Object.keys(queryKey[1]).filter(key => key !== 'report');
  return key as DataFragment;
}
// Turn a data fragment into a query key.
const getKeyFromFragment = (reportId: string, fragment: DataFragment): QueryKey => KEYS[`getReport${fragment[0].toUpperCase()}${fragment.slice(1)}`](reportId);

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

  const isMounted = useRef(true);

  // Track if there's a request in flight and if there's a queued request.
  const isReqInFlightRef = useRef(false);
  const isReqQueued = useRef(false);

  const [, setIsLoading] = useAtom(loadingAtom);

  // Mark all fragments as stale and request we fetch them.
  const isStaleRef = useRef<Record<DataFragment, DataStatus>>({
    name: DataStatus.REQUESTED,
    totalAmount: DataStatus.REQUESTED,
    exceptions: DataStatus.REQUESTED,
    expenses: DataStatus.REQUESTED
  });

  // Main query that fetches the report data and its fragments.
  const {refetch: refetchReport} = useQuery({
    queryKey: KEYS.getReport(reportId),
    // Fetch the report's requested fragments.
    queryFn: () => gqlClient.request(GET_RACOON_REPORT, {
      includeName: isStaleRef.current.name === DataStatus.REQUESTED,
      includeTotalAmount: isStaleRef.current.totalAmount === DataStatus.REQUESTED,
      includeExceptions: isStaleRef.current.exceptions === DataStatus.REQUESTED,
      includeExpenses: isStaleRef.current.expenses === DataStatus.REQUESTED
    }),
    // Save each data fragment to the cache under the appropriate key.
    onSuccess: (data) => {
      // You could walk the fragments here, but leaving as is for simplicity.
      if (data.racoon.report.name !== undefined) {
        client.setQueryData(KEYS.getReportName(reportId), data.racoon.report.name);
        isStaleRef.current.name = DataStatus.LATEST;
      }
      if (data.racoon.report.totalAmount !== undefined) {
        client.setQueryData(KEYS.getReportTotalAmount(reportId), data.racoon.report.totalAmount);
        isStaleRef.current.totalAmount = DataStatus.LATEST;
      }
      if (data.racoon.report.exceptions !== undefined) {
        client.setQueryData(KEYS.getReportExceptions(reportId), data.racoon.report.exceptions);
        isStaleRef.current.exceptions = DataStatus.LATEST;
      }
      if (data.racoon.report.expenses !== undefined) {
        client.setQueryData(KEYS.getReportExpenses(reportId), data.racoon.report.expenses);
        isStaleRef.current.expenses = DataStatus.LATEST;
      }
    }
  });

  // Fire off a network request if any data is stale and requested by a component.
  const fetchData = debounce(async () => {
    // If there's no data to fetch, bail out.
    if (!Object.values(isStaleRef.current).find(status => status === DataStatus.REQUESTED)) {
      return;
    }
    // If there's a request in flight, queue another one.
    if (isReqInFlightRef.current) {
      isReqQueued.current = true;
      return;
    }
    isReqInFlightRef.current = true;
    setIsLoading(true);
    refetchReport().finally(() => {
      isReqInFlightRef.current = false;
      setIsLoading(false);
      // Trigger any queued requests.
      if (isReqQueued.current && isMounted.current) {
        isReqQueued.current = false;
        fetchData();
      }
    });
  }, 200);

  useEffect(() => () => {
    isMounted.current = false;
    fetchData.clear();
  }, []);

  // Mark stale data as requested by a component.
  const requestData = useCallback((queryKey: QueryKey) => {
    const fragment = getFragmentFromKey(queryKey);
    if (isStaleRef.current[fragment] === DataStatus.STALE) {
      isStaleRef.current[fragment] = DataStatus.REQUESTED;
      fetchData();
    }
  }, []);

  // Mutate the report entry (amount ++).
  const {mutate: updateEntry} = useMutation({
    mutationFn: () => {
      setIsLoading(true);
      return gqlClient.request(UPDATE_RACOON_ENTRY);
    },
    onSuccess: () => {
      isStaleRef.current.totalAmount = DataStatus.STALE;
      isStaleRef.current.expenses = DataStatus.STALE;
      // Invalidate the total amount and expenses queries so that components can ask for fresh data.
      client.invalidateQueries({queryKey: KEYS.getReportTotalAmount(reportId)});
      client.invalidateQueries({queryKey: KEYS.getReportExpenses(reportId)});
    }
  });

  // Mutate the report receipt (attach/detach).
  const {mutate: updateReceipt} = useMutation({
    mutationFn: () => {
      setIsLoading(true);
      return gqlClient.request(UPDATE_RACOON_RECEIPT);
    },
    onSuccess: () => {
      isStaleRef.current.exceptions = DataStatus.STALE;
      isStaleRef.current.expenses = DataStatus.STALE;
      // Invalidate the exceptions and expenses queries so that components can ask for fresh data.
      client.invalidateQueries({queryKey: KEYS.getReportExceptions(reportId)});
      client.invalidateQueries({queryKey: KEYS.getReportExpenses(reportId)});
    }
  });

  const value = useMemo(() => ({
    requestData,
    updateEntry,
    updateReceipt
  }), []);

  return (
    <ReportDataContext.Provider value={value}>
      {children}
    </ReportDataContext.Provider>
  );
};
