import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ClientList } from '../components/Admin/ClientList';
import { ClientForm } from '../components/Admin/ClientForm';
import { ClientDetail } from '../components/Admin/ClientDetail';
import { AdminInvites } from '../components/Admin/AdminInvites';
import { LLMConfigPanel } from '../components/Admin/LLMConfigPanel';
import { Button } from '../components/ui';
import type { Client } from '../lib/types';
import { LogOut, Users, Settings, Loader2 } from 'lucide-react';

type View = 'list' | 'create' | 'detail';
type Tab = 'clients' | 'settings';
type SettingsTab = 'team' | 'llm';

export function Admin() {
  const navigate = useNavigate();
  const { user, loading, signOut, role, sessionTimedOut } = useAuth();
  const [view, setView] = useState<View>('list');
  const [tab, setTab] = useState<Tab>('clients');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('team');

  useEffect(() => {
    // If session timed out, redirect to login
    if (sessionTimedOut) {
      console.log('Admin: Session timed out, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }

    // Wait for loading to complete before making redirect decisions
    if (loading) return;
    
    // If no user after loading, redirect to login
    if (!user) {
      console.log('Admin: No user, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }
    
    // If role is explicitly client or missing, keep them out of admin
    if (role !== 'admin') {
      console.log('Admin: Non-admin role, redirecting to interview');
      navigate('/interview', { replace: true });
      return;
    }
  }, [user, loading, role, sessionTimedOut, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setView('detail');
  };

  const handleBackToList = () => {
    setSelectedClient(null);
    setView('list');
  };

  // Show loading while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 text-sunset animate-spin" />
      </div>
    );
  }

  // If no user or not an admin, show nothing (redirect will happen)
  if (!user || role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-paper border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl text-ink" style={{ letterSpacing: '-0.05em', textAlign: 'right' }}>Category of One Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-paper border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-6">
            <button
              onClick={() => { setTab('clients'); setView('list'); }}
              className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                tab === 'clients'
                  ? 'border-sunset text-ink'
                  : 'border-transparent text-slate hover:text-ink'
              }`}
            >
              <Users className="w-4 h-4" />
              Clients
            </button>
            <button
              onClick={() => setTab('settings')}
              className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                tab === 'settings'
                  ? 'border-sunset text-ink'
                  : 'border-transparent text-slate hover:text-ink'
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {tab === 'clients' ? (
          view === 'list' ? (
            <ClientList
              onCreateClient={() => setView('create')}
              onSelectClient={handleSelectClient}
            />
          ) : view === 'create' ? (
            <ClientForm
              onBack={handleBackToList}
              onSuccess={handleBackToList}
            />
          ) : view === 'detail' && selectedClient ? (
            <ClientDetail
              client={selectedClient}
              onBack={handleBackToList}
            />
          ) : null
        ) : (
          <div className="max-w-3xl">
            <h1 className="text-2xl mb-4">Settings</h1>

            {/* Settings-level tabs */}
            <div className="flex gap-4 border-b border-ink/10 mb-6">
              <button
                onClick={() => setSettingsTab('team')}
                className={`py-2 px-1 border-b-2 text-sm transition-colors ${
                  settingsTab === 'team'
                    ? 'border-sunset text-ink'
                    : 'border-transparent text-slate hover:text-ink'
                }`}
              >
                Team
              </button>
              <button
                onClick={() => setSettingsTab('llm')}
                className={`py-2 px-1 border-b-2 text-sm transition-colors ${
                  settingsTab === 'llm'
                    ? 'border-sunset text-ink'
                    : 'border-transparent text-slate hover:text-ink'
                }`}
              >
                LLM
              </button>
            </div>

            {settingsTab === 'team' ? (
              <div className="space-y-6">
                <AdminInvites />
              </div>
            ) : (
              <LLMConfigPanel role={role} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
