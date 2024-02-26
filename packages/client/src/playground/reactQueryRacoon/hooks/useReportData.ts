import {useContext} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {ReportDataContext} from "../providers/ReportDataProvider";
import {keys, type ReportKeyFunction} from "../keys";
import {type RacoonReport} from "../../../__generated/graphql";

export const useReportData = () => useContext(ReportDataContext);

function useGenericReadReportData<T>(keyFunction: ReportKeyFunction): T | undefined {
  const { reportId, requestData } = useContext(ReportDataContext);
  const client = useQueryClient();
  const key = keyFunction(reportId);

  // TODO loading state and error handling.
  const { data } = useQuery(
    key,
    () => {
      // Signal that data is requested.
      requestData(key as any); // TODO
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
