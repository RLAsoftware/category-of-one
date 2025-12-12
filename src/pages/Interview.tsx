import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useInterview } from '../hooks/useInterview';
import { getClientByUserId } from '../lib/supabase';
import { BaseQuestions } from '../components/Interview/BaseQuestions';
import { LoadingAnalysis } from '../components/Interview/LoadingAnalysis';
import { FollowUpQuestions } from '../components/Interview/FollowUpQuestions';
import { ProfileResult } from '../components/Interview/ProfileResult';
import { Button } from '../components/ui';
import { LogOut, Loader2 } from 'lucide-react';
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
    session,
    loading: sessionLoading,
    generating,
    error,
    loadSession,
    submitBaseAnswers,
    submitFollowUpAnswers,
    resetSession,
  } = useInterview({ clientId: client?.id || '' });

  useEffect(() => {
    if (client) {
      loadSession();
    }
  }, [client, loadSession]);

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

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="py-6 px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl text-ink">Category of One</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate">
            Welcome, {client.name}
          </span>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {sessionLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-sunset animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-error mb-4">{error}</p>
            <Button onClick={loadSession}>Try Again</Button>
          </div>
        ) : session?.status === 'base_questions' ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl mb-4">Let's capture your voice</h1>
              <p className="text-lg text-slate max-w-xl mx-auto">
                Answer these questions to help us understand your unique writing style and brand personality.
              </p>
            </div>
            <BaseQuestions
              onSubmit={submitBaseAnswers}
              loading={generating}
              initialAnswers={session.base_answers || undefined}
            />
          </>
        ) : session?.status === 'analyzing' ? (
          <LoadingAnalysis />
        ) : session?.status === 'follow_up' && session.follow_up_questions ? (
          <FollowUpQuestions
            questions={session.follow_up_questions}
            onSubmit={submitFollowUpAnswers}
            loading={generating}
          />
        ) : session?.status === 'synthesizing' ? (
          <LoadingAnalysis
            title="Creating your style profile"
            subtitle="Our AI is synthesizing your responses into a comprehensive voice guide."
          />
        ) : session?.status === 'completed' && session.style_profile ? (
          <ProfileResult
            profile={session.style_profile}
            onReset={resetSession}
          />
        ) : null}
      </main>
    </div>
  );
}

