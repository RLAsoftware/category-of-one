import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Client } from '../lib/types';

const STORAGE_KEY = 'impersonation_client';

interface ImpersonationState {
  client: Client | null;
  isImpersonating: boolean;
  startImpersonation: (client: Client) => void;
  stopImpersonation: () => void;
}

const ImpersonationContext = createContext<ImpersonationState | undefined>(undefined);

function getStoredClient(): Client | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function ImpersonationProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<Client | null>(() => getStoredClient());

  useEffect(() => {
    if (client) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(client));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [client]);

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


