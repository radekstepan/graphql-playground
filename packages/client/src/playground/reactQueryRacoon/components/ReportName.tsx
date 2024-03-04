import React from 'react'
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useReportNameQuery } from '../queries/useReportQuery';

const ReportName = () => {
  const componentRef = useFlashOnRender();
  const name = useReportNameQuery();

  return (
    <div ref={componentRef} className="component">
      {!name.isLoading && <strong>{name.data}</strong>}
    </div>
  );
};

export default ReportName;
