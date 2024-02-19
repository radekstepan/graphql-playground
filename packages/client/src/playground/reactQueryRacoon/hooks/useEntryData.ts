import {useContext} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {EntryDataContext} from "../providers/EntryDataProvider";
import {keys, type EntryKeyFunction, type ReportDataType} from "../keys";
import {type RacoonEntry} from "../../../__generated/graphql";

export const useEntryData = () => useContext(EntryDataContext);

// This hook reads off report entries cache.
function useGenericReadEntryData<T>(keyFunction: EntryKeyFunction): T | undefined {
  const { reportId, entryId, requestData } = useContext(EntryDataContext);
  const client = useQueryClient();
  const key = keyFunction(reportId, entryId);

  // TODO loading state and error handling.
  const { data } = useQuery(
    key,
    () => {
      // Signal that data is requested.
      requestData(key);
      // Get the data from the cache.
      const reportEntriesKey = keys.report.getReportEntries(reportId);
      const entries = client.getQueryData<ReportDataType['entries']>(reportEntriesKey) ?? null;
      const entry = entries?.find((entry) => entry.id === entryId);
      if (!entry) {
        return null;
      }
      if (key[4]) {
        return entry[key[4]!] as T ?? null;
      }
      return entry as T;
    }
  );

  return data ?? undefined;
}

// Data access hooks for the entry data fragments.
export const useReadEntryAmountData = () => useGenericReadEntryData<RacoonEntry['amount']>(keys.entry.getEntryAmount);
export const useReadEntryReceiptData = () => useGenericReadEntryData<RacoonEntry['receipt']>(keys.entry.getEntryReceipt);
