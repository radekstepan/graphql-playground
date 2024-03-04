import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { ReportEntryQueryContext } from "../providers/ReportEntryQueryProvider";
import { loadingAtom } from "../atoms/loadingAtom";
import { useAtomSetter } from "../hooks/useAtom";
import { useSetQueryData } from "../hooks/useSetQueryData";
import { gqlClient } from "../client";
import { keys } from "../keys";
import { DataStatus } from "../interfaces";
import { UPDATE_RACOON_ENTRY_AMOUNT } from "../../../queries";
import { type UpdateRacoonEntryAmountMutationVariables } from "../../../__generated/graphql";

// Mutate the entry amount ++.
export const useUpdateEntryAmountMutation = () => {
  const { reportId, entryId } = useContext(ReportEntryQueryContext);

  const setIsLoading = useAtomSetter(loadingAtom);
  const setQueryData = useSetQueryData();

  return useMutation({
    mutationFn: (variables: UpdateRacoonEntryAmountMutationVariables) => {
      setIsLoading(true);
      return gqlClient.request(UPDATE_RACOON_ENTRY_AMOUNT, variables);
    },
    onSuccess: () => {
      // Managed by the ReportEntryQueryProvider.
      setQueryData(DataStatus.STALE, keys.reportEntry.getReportEntryAmount(reportId, entryId));
      // Managed by the ReportQueryProvider.
      setQueryData(DataStatus.STALE, keys.report.getReportTotalAmount(reportId));
      // A completely separate query not managed by any provider.
      setQueryData(DataStatus.STALE, keys.report.getReportCashAdvances(reportId));
    }
  });
};
