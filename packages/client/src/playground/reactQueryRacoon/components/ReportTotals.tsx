import React from 'react'
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useReportDataTotalAmount } from '../hooks/useReportData';

const ReportTotals = () => {
  const componentRef = useFlashOnRender();
  const totalAmount = useReportDataTotalAmount('REP_1');

  return (
    <div ref={componentRef} className="component">
      {totalAmount !== null && `$${totalAmount}`}
    </div>
  );
};

export default ReportTotals;
