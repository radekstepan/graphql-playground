import { type GetRacoonReportQuery, type GetRacoonEntryQuery } from "../../__generated/graphql";

export type ReportDataType = GetRacoonReportQuery['racoon']['report'];
export type ReportDataFragment = keyof Pick<ReportDataType, 'name'|'totalAmount'|'exceptions'|'entries'>;
export type ReportQueryKey = [
  reportKey: "report", reportId: string,
  fragment: ReportDataFragment
];
export type ReportKeyFunction = (reportId: string) => ReportQueryKey;

const reportKeys: Record<string, ReportKeyFunction> = {
  getReportName: (reportId: string): ReportQueryKey => ['report', reportId, 'name'],
  getReportTotalAmount: (reportId: string): ReportQueryKey => ['report', reportId, 'totalAmount'],
  getReportExceptions: (reportId: string): ReportQueryKey => ['report', reportId, 'exceptions'],
  getReportEntries: (reportId: string): ReportQueryKey => ['report', reportId, 'entries'],
};

type EntryDataType = GetRacoonEntryQuery['racoon']['entry'];
export type EntryDataFragment = keyof Pick<EntryDataType, 'amount'|'receipt'>;
export type EntryQueryKey = [
  reportKey: "report", reportId: string,
  entriesKey: "entries", entryId: string,
  fragment?: EntryDataFragment]
;
export type EntryKeyFunction = (reportId: string, entryId: string) => EntryQueryKey;

const entryKeys: Record<string, EntryKeyFunction> = {
  getEntry: (reportId: string, entryId: string): EntryQueryKey => ['report', reportId, 'entries', entryId],
  getEntryAmount: (reportId: string, entryId: string): EntryQueryKey => ['report', reportId, 'entries', entryId, 'amount'],
  getEntryReceipt: (reportId: string, entryId: string): EntryQueryKey => ['report', reportId, 'entries', entryId, 'receipt']
};

export const keys = {
  report: reportKeys,
  entry: entryKeys
};
