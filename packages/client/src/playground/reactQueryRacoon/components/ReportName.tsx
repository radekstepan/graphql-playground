import React from 'react'
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useReportDataName } from '../hooks/useReportData';

const ReportName = () => {
  const componentRef = useFlashOnRender();
  const name = useReportDataName('REP_1');

  return (
    <div ref={componentRef} className="component">
      {name}
    </div>
  );
};

export default ReportName;
