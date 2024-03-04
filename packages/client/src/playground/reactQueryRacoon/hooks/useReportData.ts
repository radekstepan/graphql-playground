import {useContext} from "react";
import {ReportDataContext} from "../providers/ReportDataProvider";
import { useQuery } from "./useQuery";
import {keys} from "../keys";

export const useReportData = () => useContext(ReportDataContext);

export const useReadReportNameData = () => {
  const { reportId } = useContext(ReportDataContext);
  return useQuery(keys.report.getReportName(reportId));
};
export const useReadReportTotalAmountData = () => {
  const { reportId } = useContext(ReportDataContext);
  return useQuery(keys.report.getReportTotalAmount(reportId));
};
export const useReadReportExceptionsData = () => {
  const { reportId } = useContext(ReportDataContext);
  return useQuery(keys.report.getReportExceptions(reportId));
};
export const useReadReportEntriesData = () => {
  const { reportId } = useContext(ReportDataContext);
  return useQuery(keys.report.getReportEntries(reportId));
};
