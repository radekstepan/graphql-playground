import React from 'react'
import {useUpdate, useRendersCount} from 'react-use';
import Numbers from './Numbers';
import Sum from './Sum';

function App() {
  const onUpdate = useUpdate();
  const count = useRendersCount();

  const InefficientSum = () => <Sum />;

  return (
    <>
      <code>
        sum(<Numbers onUpdate={onUpdate} />) = {<InefficientSum />}
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
