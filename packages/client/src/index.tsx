import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './playground/App';
import './styles.less'

const root = createRoot(document.getElementById('root'));

root.render(<App />);
