import React from 'react'
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useReadReportNameData } from '../hooks/useReportData';

const ReportName = () => {
  const componentRef = useFlashOnRender();
  const name = useReadReportNameData();

  return (
    <div ref={componentRef} className="component">
      {!name.isFetching && <strong>{name.data}</strong>}
    </div>
  );
};

export default ReportName;
