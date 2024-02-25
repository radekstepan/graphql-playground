import { type GetRacoonReportQuery, type GetRacoonEntryQuery } from "../../__generated/graphql";
import { REPORT_KEY, ENTRIES_KEY } from "./constants";

export type ReportDataType = GetRacoonReportQuery['racoon']['report'];
export type ReportDataFragment = keyof Pick<ReportDataType, 'name'|'totalAmount'|'exceptions'|'entries'>;
export type ReportQueryKey = [
  reportKey: typeof REPORT_KEY, reportId: string,
  fragment: ReportDataFragment
];
export type ReportKeyFunction = (reportId: string) => ReportQueryKey;

const reportKeys: Record<string, ReportKeyFunction> = {
  getReportName: (reportId: string): ReportQueryKey => [REPORT_KEY, reportId, 'name'],
  getReportTotalAmount: (reportId: string): ReportQueryKey => [REPORT_KEY, reportId, 'totalAmount'],
  getReportExceptions: (reportId: string): ReportQueryKey => [REPORT_KEY, reportId, 'exceptions'],
  getReportEntries: (reportId: string): ReportQueryKey => [REPORT_KEY, reportId, ENTRIES_KEY],
};

type EntryDataType = GetRacoonEntryQuery['racoon']['entry'];
export type EntryDataFragment = keyof Pick<EntryDataType, 'amount'|'receipt'|'exceptions'>;
export type EntryQueryKey = [
  reportKey: typeof REPORT_KEY, reportId: string,
  entriesKey: typeof ENTRIES_KEY, entryId: string,
  fragment?: EntryDataFragment
];
export type EntryKeyFunction = (reportId: string, entryId: string) => EntryQueryKey;

const entryKeys: Record<string, EntryKeyFunction> = {
  getEntry: (reportId: string, entryId: string): EntryQueryKey => [REPORT_KEY, reportId, ENTRIES_KEY, entryId],
  getEntryAmount: (reportId: string, entryId: string): EntryQueryKey => [REPORT_KEY, reportId, ENTRIES_KEY, entryId, 'amount'],
  getEntryReceipt: (reportId: string, entryId: string): EntryQueryKey => [REPORT_KEY, reportId, ENTRIES_KEY, entryId, 'receipt']
};

export const keys = {
  report: reportKeys,
  entry: entryKeys
};
