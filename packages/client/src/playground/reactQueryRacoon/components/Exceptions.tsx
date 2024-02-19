import React, { useState } from 'react'
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useReadReportExceptionsData } from '../hooks/useReportData';

const Exceptions = () => {
  const componentRef = useFlashOnRender();
  const exceptions = useReadReportExceptionsData();

  // TODO read exceptions off a separate key like entries.

  return (
    <div ref={componentRef} className="component">
      {!exceptions?.length && 'No exceptions'}
      {exceptions?.map((exception, index) => (
        <div key={index}>{exception}</div>
      ))}
    </div>
  );
};

const ShowExceptions = () => {
  const [show, setShow] = useState(true);
  return (
    <div className="section">
      <input
        type="button"
        value={show ? 'Hide Exceptions' : 'Show Exceptions'}
        onClick={() => setShow(prev => !prev)}
      />
      {show && <Exceptions />}
    </div>
  );
};

export default ShowExceptions;
