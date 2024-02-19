import React from 'react'
import { useFlashOnRender } from '../hooks/useFlashOnRender';
import { useEntryData, useReadEntryAmountData } from '../hooks/useEntryData';

const Entry = () => {
  const componentRef = useFlashOnRender();
  const {entryId, updateEntryAmount} = useEntryData();
  const amount = useReadEntryAmountData();

  return (
    <div ref={componentRef} className="component">
      Entry
      {amount !== undefined && (
        <input type="button" value={`$${amount}`} onClick={() => updateEntryAmount({id: entryId})} />
      )}
    </div>
  );
};

export default Entry;
