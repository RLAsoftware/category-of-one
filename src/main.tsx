import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ImpersonationProvider } from './hooks/useImpersonation';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ImpersonationProvider>
      <App />
    </ImpersonationProvider>
  </StrictMode>,
);
