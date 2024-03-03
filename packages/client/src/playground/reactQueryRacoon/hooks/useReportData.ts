import {useContext} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {ReportDataContext} from "../providers/ReportDataProvider";
import {keys, type ReportKeyFunction} from "../keys";
import {type RacoonReport} from "../../../__generated/graphql";
import { useOverseer } from "./useOverseer";
import { requestDataEvent } from "../events/requestDataEvent";

export const useReportData = () => useContext(ReportDataContext);

function useGenericReadReportData<T>(keyFunction: ReportKeyFunction): T | undefined {
  const { reportId } = useContext(ReportDataContext);
  const client = useQueryClient();
  const key = keyFunction(reportId);

  const {events} = useOverseer();

  // TODO loading state and error handling.
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

// Data access hooks for the report data fragments.
export const useReadReportNameData = () => useGenericReadReportData<RacoonReport['name']>(keys.report.getReportName);
export const useReadReportTotalAmountData = () => useGenericReadReportData<RacoonReport['totalAmount']>(keys.report.getReportTotalAmount);
export const useReadReportExceptionsData = () => useGenericReadReportData<RacoonReport['exceptions']>(keys.report.getReportExceptions);
export const useReadReportEntriesData = () => useGenericReadReportData<RacoonReport['entries']>(keys.report.getReportEntries);
