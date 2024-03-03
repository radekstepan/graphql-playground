import {useContext} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {ReportEntryDataContext} from "../providers/ReportEntryDataProvider";
import {keys, type ReportEntryKeyFunction} from "../keys";
import {type RacoonEntry} from "../../../__generated/graphql";
import { useOverseer } from "./useOverseer";
import { requestDataEvent } from "../events/requestDataEvent";

export const useReportEntryData = () => useContext(ReportEntryDataContext);

// This hook reads off report entries cache.
function useGenericReadEntryData<T>(keyFunction: ReportEntryKeyFunction): T | undefined {
  const { reportId, entryId } = useContext(ReportEntryDataContext);
  const client = useQueryClient();
  const key = keyFunction(reportId, entryId);

  const {events} = useOverseer();

  const { data } = useQuery(
    key,
    () => {
      // Mark that a component requested the data.
      events.emit(requestDataEvent, key);
      // Get the data from the cache.
      return client.getQueryData<T>(key) ?? null;
    }
  );

  return data ?? undefined;
}

// Data access hooks for the entry data fragments.
export const useReadEntryAmountData = () => useGenericReadEntryData<RacoonEntry['amount']>(keys.reportEntry.getReportEntryAmount);
export const useReadEntryReceiptData = () => useGenericReadEntryData<RacoonEntry['receipt']>(keys.reportEntry.getReportEntryReceipt);
export const useReadEntryExceptionsData = () => {
  const { reportId, entryId } = useContext(ReportEntryDataContext);
  const client = useQueryClient();
  const key = keys.report.getEntryExceptions(reportId, entryId);

  const {events} = useOverseer();

  const { data } = useQuery(
    key,
    () => {
      // Mark that a component requested the data.
      events.emit(requestDataEvent, key);
      // Get the data from the cache.
      return client.getQueryData<RacoonEntry['exceptions']>(key) ?? null;
    }
  );

  return data ?? undefined;
};
