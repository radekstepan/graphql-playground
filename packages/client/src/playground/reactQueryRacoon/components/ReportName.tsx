import React from 'react'
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useReadReportNameData } from '../hooks/useReportData';

const ReportName = () => {
  const componentRef = useFlashOnRender();
  const name = useReadReportNameData();

  return (
    <div ref={componentRef} className="component">
      {!name.loading && name.data}
    </div>
  );
};

export default ReportName;
