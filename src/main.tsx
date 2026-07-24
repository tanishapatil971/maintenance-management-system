import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'antd/dist/reset.css';
import { HashRouter } from 'react-router-dom';

import App from './App.tsx';
import { seedDemoData } from './utils/demoSeed';

seedDemoData();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
