import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/Auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { getClientByUserId, hasClientHistory } from '../lib/supabase';

export function Login() {
  const navigate = useNavigate();
  const [hasShownLoading, setHasShownLoading] = useState(false);
  const {
    user,
    role,
    loading,
    error,
    signInWithMagicLink,
    signInWithPassword,
    sendPasswordReset,
  } = useAuth();

  // Track when loading has been shown for at least a brief moment
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setHasShownLoading(true), 300);
      return () => clearTimeout(timer);
    } else {
      setHasShownLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    // Wait for loading to complete before deciding redirects
    if (loading) return;

    // Redirect any authenticated user
    if (user) {
      console.log('Login redirect:', role);
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        // For clients, check if they have history to decide where to redirect
        (async () => {
          const client = await getClientByUserId(user.id);
          if (client) {
            const hasHistory = await hasClientHistory(client.id);
            if (hasHistory) {
              navigate('/dashboard', { replace: true });
            } else {
              navigate('/interview', { replace: true });
            }
          } else {
            // No client profile, shouldn't happen but redirect to interview as fallback
            navigate('/interview', { replace: true });
          }
        })();
      }
    }
    // If user is explicitly null (not just loading), stay on login page
  }, [user, role, loading, navigate]);

  // If user is logged in, show loading while redirect happens
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-pulse text-slate">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <img 
              src="https://ryanlevesque.net/wp-content/uploads/2024/12/rl-25-full-logo.png" 
              alt="Category Of One Logo" 
              className="mx-auto mb-4 max-w-[180px] h-auto"
            />
            <h1 className="font-primary text-4xl mb-4">Category Of One</h1>
          </div>

          {loading && hasShownLoading && !error && (
            <div className="bg-slate/10 border border-slate/20 rounded-lg px-4 py-3 mb-4">
              <p className="text-center text-sm text-slate">
                Checking your session…
              </p>
            </div>
          )}
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg px-4 py-3 mb-4">
              <p className="text-center text-sm text-error">
                {error}
              </p>
            </div>
          )}
          
          <LoginForm
            onMagicLink={signInWithMagicLink}
            onPasswordLogin={signInWithPassword}
            onPasswordReset={sendPasswordReset}
          />
        </div>
      </main>

    </div>
  );
}
