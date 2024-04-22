import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { ReportEntryQueryContext } from "../providers/ReportEntryQueryProvider";
import { loadingAtom } from "../atoms/loadingAtom";
import { useAtomSetter } from "../hooks/useAtom";
import { useSetQueryData } from "../hooks/useSetQueryData";
import { gqlClient } from "../client";
import { keys } from "../keys";
import { DataStatus } from "../interfaces";
import { UPDATE_ENTRY_RECEIPT } from "../../queries";
import { type UpdateEntryReceiptMutationVariables } from "../../__generated/graphql";

// Mutate the entry receipt (attach/detach).
export const useUpdateEntryReceiptMutation = () => {
  const {reportId, entryId} = useContext(ReportEntryQueryContext);

  const setIsLoading = useAtomSetter(loadingAtom);
  const setQueryData = useSetQueryData();

  return useMutation({
    mutationFn: (variables: UpdateEntryReceiptMutationVariables) => {
      setIsLoading(true);
      return gqlClient.request(UPDATE_ENTRY_RECEIPT, variables);
    },
    onSuccess: () => {
      setQueryData(DataStatus.STALE, keys.report.getReportExceptions(reportId));
      setQueryData(DataStatus.STALE, keys.report.getEntryExceptions(reportId, entryId));
      setQueryData(DataStatus.STALE, keys.reportEntry.getReportEntryReceipt(reportId, entryId));
    }
  });
};
