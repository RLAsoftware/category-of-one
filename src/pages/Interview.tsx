import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCategoryOfOneChat } from '../hooks/useCategoryOfOneChat';
import { getClientByUserId } from '../lib/supabase';
import { ChatInterface } from '../components/Interview/ChatInterface';
import { ProfileResult } from '../components/Interview/ProfileResult';
import { Button } from '../components/ui';
import { LogOut, Loader2, MessageSquare } from 'lucide-react';
import type { Client } from '../lib/types';

export function Interview() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut, sessionTimedOut } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [clientLoading, setClientLoading] = useState(true);

  useEffect(() => {
    // If session timed out, redirect to login
    if (sessionTimedOut) {
      navigate('/login', { replace: true });
      return;
    }

    if (!authLoading && !user) {
      navigate('/login', { replace: true });
      return;
    }

    if (user) {
      loadClient();
    }
  }, [user, authLoading, sessionTimedOut, navigate]);

  const loadClient = async () => {
    if (!user) return;
    setClientLoading(true);
    const clientData = await getClientByUserId(user.id);
    setClient(clientData);
    setClientLoading(false);
  };

  const {
    messages,
    isLoading,
    isStreaming,
    isSynthesizing,
    error,
    session,
    profile,
    initializeChat,
    sendMessage,
    resetChat,
    exportProfileAsMarkdown,
    exportBusinessProfile,
    exportCategoryOfOneDoc,
  } = useCategoryOfOneChat({
    clientId: client?.id || '',
    clientName: client?.name || '',
  });

  // Initialize chat when client is loaded
  useEffect(() => {
    if (client && !session) {
      initializeChat();
    }
  }, [client, session, initializeChat]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  if (authLoading || clientLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 text-sunset animate-spin" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl mb-4">No client profile found</h1>
        <p className="text-slate mb-6">
          Your account hasn't been linked to a client profile yet.
        </p>
        <Button onClick={handleSignOut} variant="secondary">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    );
  }

  const isCompleted = session?.status === 'completed' && profile;

  const getProgressPercentage = () => {
    if (!session) return 0;
    if (session.status === 'completed') return 100;
    if (session.status === 'generating_profile') return 80;
    const chatDepth = Math.min(messages.length, 18);
    return Math.round((chatDepth / 18) * 70);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 border-b border-ink/5 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sunset to-amber-500 flex items-center justify-center shadow-md">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display text-lg text-ink block leading-tight">
                Category of One
              </span>
            </div>
          </div>

          {/* Context pill / progress */}
          <div className="hidden sm:flex flex-1 items-center justify-center">
            <div className="px-4 py-1.5 rounded-full bg-white/70 border border-white/60 shadow-sm flex items-center gap-3">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate">
                Refining Your Story
              </span>
              <div className="h-1 w-24 rounded-full bg-cream overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sunset to-amber-400 transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-slate/70">Welcome back</span>
              <span className="text-sm font-medium text-ink">{client.name}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-sunset/15 text-sunset flex items-center justify-center text-xs font-medium">
              {client.name.charAt(0).toUpperCase()}
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-5xl mx-auto flex flex-col h-full">
          {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-sunset animate-spin mx-auto mb-4" />
              <p className="text-slate">Loading your conversation...</p>
            </div>
          </div>
        ) : isCompleted ? (
          <div className="px-4 py-12">
            <ProfileResult
              profile={profile}
              clientName={client.name}
              onReset={resetChat}
              onExportFull={exportProfileAsMarkdown}
              onExportBusiness={exportBusinessProfile}
              onExportCategory={exportCategoryOfOneDoc}
            />
          </div>
        ) : (
          <>
            {/* Chat Header */}
            {messages.length === 0 && !isStreaming && (
              <div className="text-center pt-12 pb-6 px-4">
                <h1 className="text-3xl font-display mb-3">Let's discover your Category of One</h1>
                <p className="text-slate max-w-lg mx-auto">
                  Have a conversation with our AI strategist to uncover what makes you uniquely valuable in your market.
                </p>
              </div>
            )}
            
            {/* Chat Interface */}
            <ChatInterface
              messages={messages}
              isStreaming={isStreaming}
              isSynthesizing={isSynthesizing}
              clientName={client.name}
              onSendMessage={sendMessage}
              error={error}
            />
          </>
        )}
        </div>
      </main>
    </div>
  );
}
