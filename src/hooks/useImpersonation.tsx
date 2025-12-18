import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Client } from '../lib/types';

interface ImpersonationState {
  client: Client | null;
  isImpersonating: boolean;
  startImpersonation: (client: Client) => void;
  stopImpersonation: () => void;
}

const ImpersonationContext = createContext<ImpersonationState | undefined>(undefined);

export function ImpersonationProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<Client | null>(null);

  const startImpersonation = (nextClient: Client) => {
    setClient(nextClient);
  };

  const stopImpersonation = () => {
    setClient(null);
  };

  return (
    <ImpersonationContext.Provider
      value={{
        client,
        isImpersonating: client !== null,
        startImpersonation,
        stopImpersonation,
      }}
    >
      {children}
    </ImpersonationContext.Provider>
  );
}

export function useImpersonation() {
  const ctx = useContext(ImpersonationContext);
  if (!ctx) {
    throw new Error('useImpersonation must be used within an ImpersonationProvider');
  }
  return ctx;
}


