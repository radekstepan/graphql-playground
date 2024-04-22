import { type GetReportQuery, type GetEntryQuery, type GetCashAdvancesQuery } from "../__generated/graphql";
import { REPORT_KEY, ENTRIES_KEY, EXCEPTIONS_KEY } from "./constants";
import { memoize } from "./utils";

export const ReportNameType = "ReportName" as const;
export const ReportTotalAmountType = "ReportTotalAmount" as const;
export const ReportEntriesType = "ReportEntries" as const;
export const ReportCashAdvancesType = "ReportCashAdvances" as const;
export const ReportExceptionsType = "ReportExceptions" as const;
export const ReportEntryExceptionsType = "ReportEntryExceptions" as const;

const reportKeys = {
  getReportName: memoize((reportId: string) => ({key: [REPORT_KEY, reportId, 'name'] as const, type: ReportNameType})),
  getReportTotalAmount: memoize((reportId: string) => ({key: [REPORT_KEY, reportId, 'totalAmount'] as const, type: ReportTotalAmountType})),
  getReportEntries: memoize((reportId: string) => ({key: [REPORT_KEY, reportId, ENTRIES_KEY] as const, type: ReportEntriesType})),
  getReportCashAdvances: memoize((reportId: string) => ({key: [REPORT_KEY, reportId, 'cashAdvances'] as const, type: ReportCashAdvancesType})),
  getReportExceptions: memoize((reportId: string) => ({key: [REPORT_KEY, reportId, EXCEPTIONS_KEY] as const, type: ReportExceptionsType})),
  getEntryExceptions: memoize((reportId: string, entryId: string) => ({key: [REPORT_KEY, reportId, EXCEPTIONS_KEY, ENTRIES_KEY, entryId] as const, type: ReportEntryExceptionsType})),
};

export const ReportEntryAmountType = "ReportEntryAmount" as const;
export const ReportEntryReceiptType = "ReportEntryReceipt" as const;

const reportEntryKeys = {
  getReportEntryAmount: memoize((reportId: string, entryId: string) => ({key: [REPORT_KEY, reportId, ENTRIES_KEY, entryId, 'amount'] as const, type: ReportEntryAmountType})),
  getReportEntryReceipt: memoize((reportId: string, entryId: string) => ({key: [REPORT_KEY, reportId, ENTRIES_KEY, entryId, 'receipt'] as const, type: ReportEntryReceiptType})),
};

export type ReportKeyFunction = (reportId: string) => ReturnType<typeof reportKeys[keyof typeof reportKeys]>;
export type ReportEntryKeyFunction = (reportId: string, entryId: string) => ReturnType<typeof reportEntryKeys[keyof typeof reportEntryKeys]>;

export type QueryKey =
  | ReturnType<typeof reportKeys[keyof typeof reportKeys]>
  | ReturnType<typeof reportEntryKeys[keyof typeof reportEntryKeys]>;
export type KeyFunction = ReportKeyFunction | ReportEntryKeyFunction;

// Key type to data type mapping.
export type QueryDataType = {
  [ReportNameType]: GetReportQuery['report']['name'];
  [ReportTotalAmountType]: GetReportQuery['report']['totalAmount'];
  // NOTE: notice that we do not make any claims about the rest of the fields, we only need the id. If you wanted to access the rest of
  //  the fields, you'd have to make sure that mutating a single entry would update the cache in the list of entries as well. Yes,
  //  data duplication. Example:
  // client.setQueryData<ReportDataType['entries']|void>(keys.report.getReportEntries(reportId), (entries) => {
  //   for (const entry of entries ?? []) {
  //     // An example of how you'd update the receipt of a single entry.
  //     if (entry.id === entryId) {
  //       entry.receipt = data.entry.receipt;
  //       break;
  //     }
  //   }
  // });
  [ReportEntriesType]: Pick<NonNullable<GetReportQuery['report']['entries']>[number], 'id'>[];
  [ReportCashAdvancesType]: GetCashAdvancesQuery; // <-- full query
  [ReportExceptionsType]: GetReportQuery['report']['exceptions'];
  [ReportEntryExceptionsType]: GetEntryQuery['entry']['exceptions'];
  [ReportEntryAmountType]: GetEntryQuery['entry']['amount'];
  [ReportEntryReceiptType]: GetEntryQuery['entry']['receipt'];
}

export const keys = {
  report: reportKeys,
  reportEntry: reportEntryKeys
};
