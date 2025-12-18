import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useImpersonation } from '../hooks/useImpersonation';
import { useDashboard } from '../hooks/useDashboard';
import { useToast } from '../hooks/useToast';
import { getClientByUserId, restoreSession } from '../lib/supabase';
import { Button } from '../components/ui';
import { SessionList } from '../components/Dashboard/SessionList';
import { ProfileCard } from '../components/Dashboard/ProfileCard';
import { DeleteSessionModal } from '../components/Dashboard/DeleteSessionModal';
import { EmptyState } from '../components/Dashboard/EmptyState';
import { ToastContainer } from '../components/ui/Toast';
import { LogOut, Loader2, MessageSquare, Plus } from 'lucide-react';
import type { Client } from '../lib/types';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut, sessionTimedOut, sessionExpired, isAdmin } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [clientLoading, setClientLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<{ id: string; title: string; date: string } | null>(null);
  const { client: impersonatedClient, isImpersonating, stopImpersonation } = useImpersonation();
  
  const {
    sessions,
    latestProfile,
    loading: dashboardLoading,
    deleteSession,
    refreshSessions,
  } = useDashboard({
    clientId: client?.id || '',
  });

  const { toasts, showToast, dismissToast } = useToast();

  useEffect(() => {
    // If session timed out, redirect to login
    if (sessionTimedOut || sessionExpired) {
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
  }, [user, authLoading, sessionTimedOut, sessionExpired, navigate, isAdmin, isImpersonating, impersonatedClient]);

  const loadClient = async () => {
    if (!user) return;
    setClientLoading(true);

    // If an admin has chosen to impersonate a client, use that client directly
    if (isAdmin && isImpersonating && impersonatedClient) {
      setClient(impersonatedClient);
      setClientLoading(false);
      return;
    }

    const clientData = await getClientByUserId(user.id);
    setClient(clientData);
    setClientLoading(false);
  };

  const handleSignOut = async () => {
    // Clear any impersonation state when signing out
    if (isImpersonating) {
      stopImpersonation();
    }
    await signOut();
    navigate('/login', { replace: true });
  };

  const handleStartNewInterview = () => {
    navigate('/interview');
  };

  const handleDeleteClick = (sessionId: string, title: string, date: string) => {
    setSessionToDelete({ id: sessionId, title, date });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (sessionToDelete) {
      const sessionId = sessionToDelete.id;
      const sessionTitle = sessionToDelete.title;
      
      await deleteSession(sessionId);
      setDeleteModalOpen(false);
      setSessionToDelete(null);
      
      // Show undo toast
      showToast({
        message: `"${sessionTitle}" moved to Recently Deleted`,
        action: {
          label: 'Undo',
          onClick: async () => {
            await restoreSession(sessionId);
            await refreshSessions();
          },
        },
        duration: 10000, // 10 seconds
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setSessionToDelete(null);
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

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 border-b border-ink/5 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
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
      <main className="flex-1 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {dashboardLoading && sessions.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-sunset animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            // Empty State for first-time users
            <EmptyState onStartInterview={handleStartNewInterview} />
          ) : (
            <>
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-display mb-2">Your Dashboard</h1>
                <p className="text-slate">Manage your Category of One interviews and profiles</p>
              </div>

              {/* Latest Profile Card */}
              {latestProfile && (
                <div className="mb-8">
                  <ProfileCard
                    profile={latestProfile}
                    sessionId={latestProfile.session_id}
                  />
                </div>
              )}

              {/* Start New Interview Button */}
              <div className="mb-6">
                <Button onClick={handleStartNewInterview} variant="primary" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Start New Interview
                </Button>
              </div>

              {/* Session List */}
              <div>
                <h2 className="text-xl font-semibold text-ink mb-4">
                  Your Interviews
                  <span className="text-sm text-slate font-normal ml-2">
                    ({sessions.length} {sessions.length === 1 ? 'session' : 'sessions'})
                  </span>
                </h2>
                {sessions.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center text-slate">
                    <p>No interviews found matching your search.</p>
                  </div>
                ) : (
                  <SessionList
                    sessions={sessions}
                    onDelete={(sessionId) => {
                      const session = sessions.find(s => s.id === sessionId);
                      if (session) {
                        const title =
                          session.title && session.title.trim()
                            ? session.title
                            : new Date(session.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              });
                        handleDeleteClick(
                          sessionId,
                          title,
                          new Date(session.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })
                        );
                      }
                    }}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteSessionModal
        isOpen={deleteModalOpen}
        sessionTitle={sessionToDelete?.title || ''}
        sessionDate={sessionToDelete?.date || ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

