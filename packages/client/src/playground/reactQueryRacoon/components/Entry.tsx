import React from 'react'
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useReportData, useReportDataExpenses } from '../hooks/useReportData';

const Entry = () => {
  const componentRef = useFlashOnRender();
  const {updateEntry} = useReportData();
  const expenses = useReportDataExpenses('REP_1');

  return (
    <div ref={componentRef} className="component">
      Entry
      {expenses !== null && (
        <input type="button" value={`$${expenses[0].amount}`} onClick={updateEntry} />
      )}
    </div>
  );
};

export default Entry;
