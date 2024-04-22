import React from 'react'
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useReportTotalAmountQuery } from '../queries/useReportQuery';

const ReportTotals = () => {
  const componentRef = useFlashOnRender();
  const totalAmount = useReportTotalAmountQuery();

  return (
    <div ref={componentRef} className="component">
      {!totalAmount.isLoading && `$${totalAmount.data}`}
    </div>
  );
};

export default ReportTotals;
