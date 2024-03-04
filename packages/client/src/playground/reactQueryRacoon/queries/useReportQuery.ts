import {useContext} from "react";
import {ReportQueryContext} from "../providers/ReportQueryProvider";
import { useQuery } from "../hooks/useQuery";
import {keys} from "../keys";

export const useReportNameQuery = () => {
  const { reportId } = useContext(ReportQueryContext);
  return useQuery(keys.report.getReportName(reportId));
};
export const useReportTotalAmountQuery = () => {
  const { reportId } = useContext(ReportQueryContext);
  return useQuery(keys.report.getReportTotalAmount(reportId));
};
export const useReportExceptionsQuery = () => {
  const { reportId } = useContext(ReportQueryContext);
  return useQuery(keys.report.getReportExceptions(reportId));
};
export const useReportEntriesQuery = () => {
  const { reportId } = useContext(ReportQueryContext);
  return useQuery(keys.report.getReportEntries(reportId));
};
