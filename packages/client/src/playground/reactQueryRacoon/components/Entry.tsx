import React from 'react'
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useReportEntryData, useReadEntryAmountData, useReadEntryExceptionsData } from '../hooks/useReportEntryData';

const Entry = () => {
  const componentRef = useFlashOnRender();
  const {entryId, updateEntryAmount} = useReportEntryData();
  const amount = useReadEntryAmountData();
  const exceptions = useReadEntryExceptionsData();

  return (
    <div ref={componentRef} className="component">
      {entryId}
      &nbsp;
      {exceptions?.length ? '🗲' : '☀'}
      {amount !== undefined && (
        <input type="button" value={`$${amount}`} onClick={() => updateEntryAmount({id: entryId})} />
      )}
    </div>
  );
};

export default Entry;
