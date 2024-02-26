import {useContext} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {ReportEntryDataContext} from "../providers/ReportEntryDataProvider";
import {keys, type ReportEntryKeyFunction} from "../keys";
import {type RacoonEntry} from "../../../__generated/graphql";

export const useReportEntryData = () => useContext(ReportEntryDataContext);

// This hook reads off report entries cache.
function useGenericReadEntryData<T>(keyFunction: ReportEntryKeyFunction): T | undefined {
  const { reportId, entryId, requestData } = useContext(ReportEntryDataContext);
  const client = useQueryClient();
  const key = keyFunction(reportId, entryId);

  const { data } = useQuery(
    key,
    () => {
      // Signal that data is requested.
      requestData(key);
      // Get the data from the cache.
      return client.getQueryData<T>(key) ?? null;
    }
  );

  return data ?? undefined;
}

// Data access hooks for the entry data fragments.
export const useReadEntryAmountData = () => useGenericReadEntryData<RacoonEntry['amount']>(keys.reportEntry.getEntryAmount);
export const useReadEntryReceiptData = () => useGenericReadEntryData<RacoonEntry['receipt']>(keys.reportEntry.getEntryReceipt);
export const useReadEntryExceptionsData = () => {
  const { reportId, entryId, requestData } = useContext(ReportEntryDataContext);
  const client = useQueryClient();
  const key = keys.report.getEntryExceptions(reportId, entryId);

  const { data } = useQuery(
    key,
    () => {
      requestData(key as any); // TODO
      return client.getQueryData<RacoonEntry['exceptions']>(key) ?? null;
    }
  );

  return data ?? undefined;
};
