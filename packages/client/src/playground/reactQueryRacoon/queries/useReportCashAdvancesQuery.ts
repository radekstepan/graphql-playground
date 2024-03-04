import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { ReportQueryContext } from "../providers/ReportQueryProvider";
import {gqlClient} from '../client';
import { keys } from "../keys";
import { GET_RACOON_CASH_ADVANCES } from "../../../queries";

// An example of a query that is separate from all our providers.
export const useReportCashAdvancesQuery = () => {
  const { reportId } = useContext(ReportQueryContext);

  return useQuery({
    queryKey: keys.report.getReportCashAdvances(reportId).key,
    queryFn: () => gqlClient.request(GET_RACOON_CASH_ADVANCES, { reportId })
  });
};
