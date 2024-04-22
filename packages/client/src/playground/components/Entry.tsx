import React, { useContext } from 'react'
import { ReportEntryQueryContext } from '../providers/ReportEntryQueryProvider';
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useAtom } from '../hooks/useAtom';
import { pageAtom } from '../atoms/pageAtom';
import { useEntryAmountQuery, useEntryExceptionsQuery } from '../queries/useReportEntryQuery';
import { useUpdateEntryAmountMutation } from '../queries/useUpdateEntryAmountMutation';

const Entry = () => {
  const {entryId} = useContext(ReportEntryQueryContext);
  const componentRef = useFlashOnRender();
  const amount = useEntryAmountQuery();
  const exceptions = useEntryExceptionsQuery();
  const {mutate: updateEntryAmountMutation} = useUpdateEntryAmountMutation();

  const [page, setPage] = useAtom(pageAtom);

  return (
    <div ref={componentRef} className="component">
      {!page.entryId ? (
        <a onClick={() => setPage(prev => ({...prev, entryId}))}>{entryId}</a>
      ) : entryId}
      &nbsp;
      {!exceptions.isLoading && exceptions.data?.length ? '🗲' : '☀'}
      {!amount.isLoading && (
        <input type="button" value={`$${amount.data}`} onClick={() => updateEntryAmountMutation({entryId})} />
      )}
    </div>
  );
};

export default Entry;
