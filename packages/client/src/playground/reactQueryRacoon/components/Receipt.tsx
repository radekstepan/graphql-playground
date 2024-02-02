import React from 'react'
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useReportData, useReportDataExpenses } from '../hooks/useReportData';

const Receipt = () => {
  const componentRef = useFlashOnRender();
  const {updateReceipt} = useReportData();
  const expenses = useReportDataExpenses('REP_1');

  return (
    <div ref={componentRef} className="component">
      {expenses !== null && (
        <input type="button" value={expenses[0].receipt ? 'Detach Receipt' : 'Attach Receipt'} onClick={updateReceipt} />
      )}
    </div>
  );
};

export default Receipt;
