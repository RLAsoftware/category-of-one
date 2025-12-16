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
  const { user, loading: authLoading, signOut } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [clientLoading, setClientLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
      return;
    }

    if (user) {
      loadClient();
    }
  }, [user, authLoading, navigate]);

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
  } = useCategoryOfOneChat({ 
    clientId: client?.id || '', 
    clientName: client?.name || '' 
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

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="py-4 px-6 border-b border-ink/5 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sunset to-amber-500 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display text-lg text-ink block leading-tight">Category of One</span>
              <span className="text-xs text-slate">Discover your unique positioning</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate hidden sm:block">
              Welcome, {client.name}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto">
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
              onExport={exportProfileAsMarkdown}
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
      </main>
    </div>
  );
}
