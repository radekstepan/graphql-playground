import React from 'react'
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useReadReportTotalAmountData } from '../hooks/useReportData';

const ReportTotals = () => {
  const componentRef = useFlashOnRender();
  const totalAmount = useReadReportTotalAmountData();

  return (
    <div ref={componentRef} className="component">
      {!totalAmount.loading && `$${totalAmount.data}`}
    </div>
  );
};

export default ReportTotals;
