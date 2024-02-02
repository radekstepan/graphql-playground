import React from 'react'
import {useFlashOnRender} from '../hooks/useFlashOnRender';
import {useAtom} from '../hooks/useAtom';
import {loadingAtom} from '../atoms/loadingAtom';

const Loading = () => {
  const componentRef = useFlashOnRender();
  const [isLoading] = useAtom(loadingAtom);

  return (
    <div ref={componentRef} className="component">
      {isLoading ? 'Loading' : 'Idle'}
    </div>
  );
};

export default Loading;
