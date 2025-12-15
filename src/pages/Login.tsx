import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/Auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const navigate = useNavigate();
  const { user, role, loading, signInWithMagicLink, signInWithPassword, sendPasswordReset } = useAuth();

  useEffect(() => {
    // Wait for loading to complete
    if (loading) return;
    
    // Only redirect if user is logged in with a role
    // Don't redirect if user is null (signing out)
    if (user && role) {
      console.log('Login redirect:', role);
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'client') {
        navigate('/interview', { replace: true });
      }
    }
    // If user is explicitly null (not just loading), stay on login page
  }, [user, role, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-pulse text-slate">Loading...</div>
      </div>
    );
  }

  // If user is logged in, show loading while redirect happens
  if (user && role) {
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
