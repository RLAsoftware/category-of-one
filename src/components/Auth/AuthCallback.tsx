import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, getClientByUserId, hasClientHistory } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

export function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error.message);
          return;
        }

        if (data.session) {
          // Get user role to determine redirect
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.session.user.id)
            .single();

          if (roleData?.role === 'admin') {
            navigate('/admin', { replace: true });
          } else if (roleData?.role === 'client') {
            // For clients, check if they have history to decide where to redirect
            const client = await getClientByUserId(data.session.user.id);
            if (client) {
              const hasHistory = await hasClientHistory(client.id);
              if (hasHistory) {
                navigate('/dashboard', { replace: true });
              } else {
                navigate('/interview', { replace: true });
              }
            } else {
              // No client profile found
              setError('Your account is pending activation. Please contact an administrator.');
              await supabase.auth.signOut();
            }
          } else {
            // No role found - unauthorized access
            setError('Your account is pending activation. Please contact an administrator.');
            // Sign them out to prevent confusion
            await supabase.auth.signOut();
          }
        } else {
          navigate('/login', { replace: true });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <h2 className="text-xl text-error mb-2">Authentication Error</h2>
          <p className="text-slate mb-4">{error}</p>
          <a href="/login" className="text-sunset hover:text-sunset-dark underline">
            Try again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-sunset animate-spin mx-auto mb-4" />
        <p className="text-slate">Signing you in...</p>
      </div>
    </div>
  );
}

