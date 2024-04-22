import React, { useContext } from 'react'
import { ReportEntryQueryContext } from '../providers/ReportEntryQueryProvider';
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useEntryReceiptQuery } from '../queries/useReportEntryQuery';
import { useUpdateEntryReceiptMutation } from '../queries/useUpdateEntryReceiptMutation';

const Receipt = () => {
  const {entryId} = useContext(ReportEntryQueryContext);
  const componentRef = useFlashOnRender();
  const receipt = useEntryReceiptQuery();
  const {mutate: updateEntryReceipt } = useUpdateEntryReceiptMutation();

  return (
    <div ref={componentRef} className="component">
      {!receipt.isLoading && (
        <input
          type="button"
          value={receipt.data ? 'Detach Receipt' : 'Attach Receipt'}
          onClick={() => updateEntryReceipt({entryId})}
        />
      )}
    </div>
  );
};

export default Receipt;
