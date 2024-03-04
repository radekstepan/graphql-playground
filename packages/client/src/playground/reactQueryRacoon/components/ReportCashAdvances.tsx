import React from 'react'
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useReportCashAdvancesQuery } from '../queries/useReportCashAdvancesQuery';

const ReportCashAdvances = () => {
  const componentRef = useFlashOnRender();
  const cashAdvances = useReportCashAdvancesQuery();

  return (
    <div ref={componentRef} className="component">
      {!cashAdvances.isFetching && !!cashAdvances.data?.racoon.report.cashAdvances.length && (
        <div>Cash advances: ${cashAdvances.data.racoon.report.cashAdvances.reduce((acc, ca) => acc + ca.amount, 0)}</div>
      )}
      {!cashAdvances.isFetching && !cashAdvances.data?.racoon.report.cashAdvances.length && 'No cash advances'}
      {cashAdvances.isFetching && '...'}
    </div>
  );
};

export default ReportCashAdvances;
