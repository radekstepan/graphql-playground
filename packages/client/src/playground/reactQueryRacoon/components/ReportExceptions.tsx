import React, { useState } from 'react'
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useReadReportExceptionsData } from '../hooks/useReportData';

const ReportExceptions = () => {
  const componentRef = useFlashOnRender();
  const exceptions = useReadReportExceptionsData();

  return (
    <div ref={componentRef} className="component">
      {!exceptions.loading && !exceptions.data?.length && 'No exceptions'}
      {!exceptions.loading && exceptions.data?.map((exception, index) => (
        <div key={index}>{exception.entryId}: {exception.text}</div>
      ))}
    </div>
  );
};

const ShowReportExceptions = () => {
  const [show, setShow] = useState(true);
  return (
    <div className="section">
      <input
        type="button"
        value={show ? 'Hide Exceptions' : 'Show Exceptions'}
        onClick={() => setShow(prev => !prev)}
      />
      {show && <ReportExceptions />}
    </div>
  );
};

export default ShowReportExceptions;
