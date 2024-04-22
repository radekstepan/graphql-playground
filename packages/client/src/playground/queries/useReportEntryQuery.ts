import {useContext} from "react";
import {ReportEntryQueryContext} from "../providers/ReportEntryQueryProvider";
import { useQuery } from "../hooks/useQuery";
import {keys} from "../keys";

export const useEntryAmountQuery = () => {
  const { reportId, entryId } = useContext(ReportEntryQueryContext);
  return useQuery(keys.reportEntry.getReportEntryAmount(reportId, entryId));
};
export const useEntryReceiptQuery = () => {
  const { reportId, entryId } = useContext(ReportEntryQueryContext);
  return useQuery(keys.reportEntry.getReportEntryReceipt(reportId, entryId));
};
export const useEntryExceptionsQuery = () => {
  const { reportId, entryId } = useContext(ReportEntryQueryContext);
  return useQuery(keys.report.getEntryExceptions(reportId, entryId));
};
