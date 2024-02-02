import {useContext} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {KEYS, ReportDataContext, type KeyFunction} from "../providers/ReportDataProvider";
import {type RacoonReport} from "../../../__generated/graphql";

export const useReportData = () => useContext(ReportDataContext);

function useGenericReportData<T>(reportId: string, keyFunction: KeyFunction): T | null {
  const { requestData } = useContext(ReportDataContext);
  const client = useQueryClient();
  const key = keyFunction(reportId);

  // TODO loading state and error handling.
  const { data } = useQuery(
    key,
    () => {
      // Signal that data is requested.
      requestData(key);
      // Get the data from the cache.
      return client.getQueryData<T>(key) ?? null;
    }
  );

  return data ?? null;
}

// Data access hooks for the report data fragments.
export const useReportDataName = (reportId: string) => useGenericReportData<string>(reportId, KEYS.getReportName);
export const useReportDataTotalAmount = (reportId: string) => useGenericReportData<number>(reportId, KEYS.getReportTotalAmount);
export const useReportDataExceptions = (reportId: string) => useGenericReportData<RacoonReport['exceptions']>(reportId, KEYS.getReportExceptions);
export const useReportDataExpenses = (reportId: string) => useGenericReportData<RacoonReport['expenses']>(reportId, KEYS.getReportExpenses);
