import React, { useContext } from 'react'
import { ReportEntryQueryContext } from '../providers/ReportEntryQueryProvider';
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useEntryAmountQuery, useEntryExceptionsQuery } from '../queries/useReportEntryQuery';
import { useUpdateEntryAmountMutation } from '../queries/useUpdateEntryAmountMutation';

const Entry = () => {
  const {entryId} = useContext(ReportEntryQueryContext);
  const componentRef = useFlashOnRender();
  const amount = useEntryAmountQuery();
  const exceptions = useEntryExceptionsQuery();
  const {mutate: updateEntryAmountMutation} = useUpdateEntryAmountMutation();

  return (
    <div ref={componentRef} className="component">
      {entryId}
      &nbsp;
      {!exceptions.isLoading && exceptions.data?.length ? '🗲' : '☀'}
      {!amount.isLoading && (
        <input type="button" value={`$${amount.data}`} onClick={() => updateEntryAmountMutation({entryId})} />
      )}
    </div>
  );
};

export default Entry;
