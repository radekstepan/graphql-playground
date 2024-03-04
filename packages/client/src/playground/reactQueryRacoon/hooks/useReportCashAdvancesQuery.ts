import { useQuery } from "@tanstack/react-query";
import {gqlClient} from '../client';
import { keys } from "../keys";
import { useReportData } from "./useReportData";
import { GET_RACOON_CASH_ADVANCES } from "../../../queries";

// An example of a query that is separate from all our providers.
export const useReportCashAdvancesQuery = () => {
  const { reportId } = useReportData();

  return useQuery({
    queryKey: keys.report.getReportCashAdvances(reportId).key,
    queryFn: () => gqlClient.request(GET_RACOON_CASH_ADVANCES, { reportId })
  });
};
