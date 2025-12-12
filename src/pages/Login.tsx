import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/Auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const navigate = useNavigate();
  const { user, role, loading, signInWithPassword, sendPasswordReset } = useAuth();

  useEffect(() => {
    // Wait for loading to complete
    if (loading) return;
    
    // Redirect if user is logged in with a role
    if (user && role) {
      console.log('Login redirect:', role);
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'client') {
        navigate('/interview', { replace: true });
      }
    }
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
            <h1 className="text-4xl mb-4">Category Of One</h1>
          </div>
          
          <LoginForm
            onPasswordLogin={signInWithPassword}
            onPasswordReset={sendPasswordReset}
          />
        </div>
      </main>

    </div>
  );
}
