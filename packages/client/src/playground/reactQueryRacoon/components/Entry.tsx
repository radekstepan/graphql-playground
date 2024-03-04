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
      {!exceptions.loading && exceptions.data?.length ? '🗲' : '☀'}
      {!amount.loading && (
        <input type="button" value={`$${amount.data}`} onClick={() => updateEntryAmount({id: entryId})} />
      )}
    </div>
  );
};

export default Entry;
