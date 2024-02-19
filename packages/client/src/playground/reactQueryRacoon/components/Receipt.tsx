import React from 'react'
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useEntryData, useReadEntryReceiptData } from '../hooks/useEntryData';

const Receipt = () => {
  const componentRef = useFlashOnRender();
  const {entryId, updateEntryReceipt} = useEntryData();
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
