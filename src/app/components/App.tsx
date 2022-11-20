import React, {useState} from 'react'
import {useUpdate, useRendersCount} from 'react-use';
import Numbers from './Numbers';
import Sum from './Sum';

function App() {
  const [showSum, setShowSum] = useState(false);
  const onUpdate = useUpdate();
  const count = useRendersCount();

  return (
    <>
      <code>
        sum(<Numbers
          onFocus={() => setShowSum(false)}
          onUpdate={() => setShowSum(true)}
        />)
        {showSum && ' = '}
        {showSum && <Sum />}
      </code>
      <input
        className="render"
        type="button"
        value={`Render ${count}`}
        onClick={onUpdate}
      />
    </>
  );
};

export default App;
