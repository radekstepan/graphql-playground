import { type GetRacoonReportQuery, type GetRacoonEntryQuery } from "../../__generated/graphql";
import { REPORT_KEY, ENTRIES_KEY, EXCEPTIONS_KEY } from "./constants";
import { memoize } from "./utils";

export type ReportDataType = GetRacoonReportQuery['racoon']['report'];
export type ReportDataFragment = keyof Pick<ReportDataType, 'name'|'totalAmount'|'exceptions'|'entries'>;
export type ReportQueryKey = [typeof REPORT_KEY, reportId: string, ReportDataFragment, typeof ENTRIES_KEY?, entryId?: string];
export type ReportKeyFunction = (reportId: string) => ReportQueryKey;

const reportKeys = {
  getReportName: memoize((reportId: string): ReportQueryKey => [REPORT_KEY, reportId, 'name']),
  getReportTotalAmount: memoize((reportId: string): ReportQueryKey => [REPORT_KEY, reportId, 'totalAmount']),
  getReportEntries: memoize((reportId: string): ReportQueryKey => [REPORT_KEY, reportId, ENTRIES_KEY]),
  getReportExceptions: memoize((reportId: string): ReportQueryKey => [REPORT_KEY, reportId, EXCEPTIONS_KEY]),
  getEntryExceptions: memoize((reportId: string, entryId: string): ReportQueryKey => [REPORT_KEY, reportId, EXCEPTIONS_KEY, ENTRIES_KEY, entryId]),
};

type ReportEntryDataType = GetRacoonEntryQuery['racoon']['entry'];
export type ReportEntryDataFragment = keyof Pick<ReportEntryDataType, 'amount'|'receipt'|'exceptions'>;
export type ReportEntryQueryKey = [typeof REPORT_KEY, reportId: string, typeof ENTRIES_KEY, string, ReportEntryDataFragment?];
export type ReportEntryKeyFunction = (reportId: string, entryId: string) => ReportEntryQueryKey;

const reportEntryKeys = {
  getReportEntry: memoize((reportId: string, entryId: string): ReportEntryQueryKey => [REPORT_KEY, reportId, ENTRIES_KEY, entryId]),
  getReportEntryAmount: memoize((reportId: string, entryId: string): ReportEntryQueryKey => [REPORT_KEY, reportId, ENTRIES_KEY, entryId, 'amount']),
  getReportEntryReceipt: memoize((reportId: string, entryId: string): ReportEntryQueryKey => [REPORT_KEY, reportId, ENTRIES_KEY, entryId, 'receipt']),
};

export type QueryKey = ReportQueryKey | ReportEntryQueryKey;
export type KeyFunction = ReportKeyFunction | ReportEntryKeyFunction;

export const keys = {
  report: reportKeys,
  reportEntry: reportEntryKeys
};
