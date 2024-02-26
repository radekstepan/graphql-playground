import { type GetRacoonReportQuery, type GetRacoonEntryQuery } from "../../__generated/graphql";
import { REPORT_KEY, ENTRIES_KEY, EXCEPTIONS_KEY } from "./constants";

export type ReportDataType = GetRacoonReportQuery['racoon']['report'];
export type ReportDataFragment = keyof Pick<ReportDataType, 'name'|'totalAmount'|'exceptions'|'entries'>;
export type ReportQueryKey = [typeof REPORT_KEY, reportId: string, ReportDataFragment, typeof ENTRIES_KEY?, entryId?: string];
export type ReportKeyFunction = (reportId: string) => ReportQueryKey;

const reportKeys = {
  getReportName: (reportId: string): ReportQueryKey => [REPORT_KEY, reportId, 'name'],
  getReportTotalAmount: (reportId: string): ReportQueryKey => [REPORT_KEY, reportId, 'totalAmount'],
  getReportEntries: (reportId: string): ReportQueryKey => [REPORT_KEY, reportId, ENTRIES_KEY],
  getReportExceptions: (reportId: string): ReportQueryKey => [REPORT_KEY, reportId, EXCEPTIONS_KEY],
  getEntryExceptions: (reportId: string, entryId: string): ReportQueryKey => [REPORT_KEY, reportId, EXCEPTIONS_KEY, ENTRIES_KEY, entryId],
};

type ReportEntryDataType = GetRacoonEntryQuery['racoon']['entry'];
export type ReportEntryDataFragment = keyof Pick<ReportEntryDataType, 'amount'|'receipt'|'exceptions'>;
export type ReportEntryQueryKey = [typeof REPORT_KEY, entryId: string, typeof ENTRIES_KEY, string, ReportEntryDataFragment?];
export type ReportEntryKeyFunction = (reportId: string, entryId: string) => ReportEntryQueryKey;

const reportEntryKeys = {
  getEntry: (reportId: string, entryId: string): ReportEntryQueryKey => [REPORT_KEY, reportId, ENTRIES_KEY, entryId],
  getEntryAmount: (reportId: string, entryId: string): ReportEntryQueryKey => [REPORT_KEY, reportId, ENTRIES_KEY, entryId, 'amount'],
  getEntryReceipt: (reportId: string, entryId: string): ReportEntryQueryKey => [REPORT_KEY, reportId, ENTRIES_KEY, entryId, 'receipt'],
};

export type QueryKey = ReportQueryKey | ReportEntryQueryKey;
export type KeyFunction = ReportKeyFunction | ReportEntryKeyFunction;

export const keys = {
  report: reportKeys,
  reportEntry: reportEntryKeys
};
