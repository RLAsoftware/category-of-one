import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ImpersonationProvider } from './hooks/useImpersonation';
import { AuthProvider } from './hooks/useAuth';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ImpersonationProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ImpersonationProvider>
  </StrictMode>,
);
