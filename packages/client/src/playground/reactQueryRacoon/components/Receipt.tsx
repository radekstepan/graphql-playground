import React from 'react'
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useReportEntryData, useReadEntryReceiptData } from '../hooks/useReportEntryData';

const Receipt = () => {
  const componentRef = useFlashOnRender();
  const {entryId, updateEntryReceipt} = useReportEntryData();
  const receipt = useReadEntryReceiptData();

  return (
    <div ref={componentRef} className="component">
      <input
        type="button"
        value={receipt ? 'Detach Receipt' : 'Attach Receipt'}
        onClick={() => updateEntryReceipt({id: entryId})}
      />
    </div>
  );
};

export default Receipt;
