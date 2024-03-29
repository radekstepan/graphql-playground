import React, { useState } from 'react'
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useReportExceptionsQuery } from '../queries/useReportQuery';

const ReportExceptions = () => {
  const componentRef = useFlashOnRender();
  const exceptions = useReportExceptionsQuery();

  return (
    <div ref={componentRef} className="component">
      {!exceptions.isFetching && !exceptions.data?.length && 'No exceptions'}
      {!exceptions.isFetching && exceptions.data?.map((exception, index) => (
        <div key={index}>{exception.entryId}: {exception.text}</div>
      ))}
      {exceptions.isFetching && '...'}
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
