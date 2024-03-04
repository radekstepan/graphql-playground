import {useContext} from "react";
import {ReportEntryDataContext} from "../providers/ReportEntryDataProvider";
import { useQuery } from "./useQuery";
import {keys} from "../keys";

export const useReportEntryData = () => useContext(ReportEntryDataContext);

export const useReadEntryAmountData = () => {
  const { reportId, entryId } = useReportEntryData();
  return useQuery(keys.reportEntry.getReportEntryAmount(reportId, entryId));
};
export const useReadEntryReceiptData = () => {
  const { reportId, entryId } = useReportEntryData();
  return useQuery(keys.reportEntry.getReportEntryReceipt(reportId, entryId));
};
export const useReadEntryExceptionsData = () => {
  const { reportId, entryId } = useReportEntryData();
  return useQuery(keys.report.getEntryExceptions(reportId, entryId));
};
