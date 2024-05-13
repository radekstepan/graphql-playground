import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './playground/App';
import './styles.less'

async function enableMocking() {
  const { worker } = await import('../mocks/browser'!);
  return worker.start();
}

enableMocking().then(() => {
  const root = createRoot(document.getElementById('root')!);
  root.render(<App />);  
});
