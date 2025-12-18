import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCategoryOfOneChat } from '../hooks/useCategoryOfOneChat';
import { getClientByUserId } from '../lib/supabase';
import { ChatInterface } from '../components/Interview/ChatInterface';
import { ProfileResult } from '../components/Interview/ProfileResult';
import { Button } from '../components/ui';
import { LogOut, Loader2, MessageSquare, ArrowLeft, RefreshCw } from 'lucide-react';
import type { Client } from '../lib/types';

export function Interview() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId?: string }>();
  const { user, loading: authLoading, signOut, sessionTimedOut, role } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [clientLoading, setClientLoading] = useState(true);
  const [showStartFromScratchModal, setShowStartFromScratchModal] = useState(false);

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a604c763-55bb-413d-8173-49062a81e738', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'debug-session',
      runId: 'pre-fix-1',
      hypothesisId: 'A',
      location: 'src/pages/Interview.tsx:component',
      message: 'Interview render start',
      data: { hasUser: !!user, sessionIdFromRoute: sessionId },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion agent log

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
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a604c763-55bb-413d-8173-49062a81e738', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'debug-session',
          runId: 'pre-fix-1',
          hypothesisId: 'A',
          location: 'src/pages/Interview.tsx:useEffect-auth',
          message: 'Calling loadClient after auth check',
          data: { userId: user.id },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion agent log
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
    messageCount,
    isNearTurnLimit,
    isAtTurnLimit,
    initializeChat,
    loadSession,
    sendMessage,
    synthesizeProfile,
    resetChat,
    exportProfileAsMarkdown,
  } = useCategoryOfOneChat({
    clientId: client?.id || '',
    clientName: client?.name || '',
    sessionId: sessionId,
  });

  // Initialize or load chat when client is loaded
  useEffect(() => {
    if (client && !session) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a604c763-55bb-413d-8173-49062a81e738', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'debug-session',
          runId: 'pre-fix-1',
          hypothesisId: 'B',
          location: 'src/pages/Interview.tsx:useEffect-init',
          message: 'Choosing chat initialization path',
          data: { hasClient: !!client, hasSession: !!session, hasSessionIdParam: !!sessionId },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion agent log

      if (sessionId) {
        // Load existing session
        loadSession(sessionId);
      } else {
        // Create new session
        initializeChat();
      }
    }
  }, [client, session, sessionId, initializeChat, loadSession]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleStartFromScratch = () => {
    setShowStartFromScratchModal(true);
  };

  const handleConfirmStartFromScratch = async () => {
    await resetChat();
    setShowStartFromScratchModal(false);
    // Stay on the same page - the conversation has been wiped clean
  };

  const handleCancelStartFromScratch = () => {
    setShowStartFromScratchModal(false);
  };

  const isCompleted = session?.status === 'completed' && profile;

  // Ensure we start at the top when the completed profile view becomes active
  useEffect(() => {
    if (isCompleted) {
      // Use a small timeout so this runs after layout/animations
      const id = window.setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }, 0);
      return () => window.clearTimeout(id);
    }
  }, [isCompleted]);

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

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 border-b border-ink/5 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sunset to-amber-500 flex items-center justify-center shadow-md">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display text-lg text-ink block leading-tight">
                Category of One
              </span>
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
              onSendMessage={sendMessage}
              onStartFromScratch={!isCompleted ? handleStartFromScratch : undefined}
              onForceSynthesis={synthesizeProfile}
              error={error}
              messageCount={messageCount}
              isNearTurnLimit={isNearTurnLimit}
              isAtTurnLimit={isAtTurnLimit}
              userRole={role}
              sessionStatus={session?.status}
            />
          </>
        )}
        </div>
      </main>

      {/* Start from Scratch Confirmation Modal */}
      {showStartFromScratchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={handleCancelStartFromScratch}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-ink mb-1">Start from Scratch?</h2>
                <p className="text-sm text-slate">
                  This will delete all messages in this conversation and restart fresh. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button onClick={handleCancelStartFromScratch} variant="ghost">
                Cancel
              </Button>
              <Button onClick={handleConfirmStartFromScratch} variant="primary">
                Clear & Restart
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}