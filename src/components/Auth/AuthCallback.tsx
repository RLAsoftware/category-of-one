import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, getClientByUserId, getClientInterviewState } from '../../lib/supabase';
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
          const userId = data.session.user.id;
          const userEmail = data.session.user.email;

          // Get user role to determine redirect
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .single();

          if (roleData?.role === 'admin') {
            navigate('/admin', { replace: true });
          } else if (roleData?.role === 'client') {
            // For clients, check their interview state to decide where to redirect
            const client = await getClientByUserId(userId);
            if (client) {
              const interviewState = await getClientInterviewState(client.id);
              if (interviewState === 'active') {
                // Has an active interview - resume it
                navigate('/interview', { replace: true });
              } else {
                // No interviews or only completed - go to dashboard
                navigate('/dashboard', { replace: true });
              }
            } else {
              // No client profile found
              setError('Your account is pending activation. Please contact an administrator.');
              await supabase.auth.signOut();
            }
          } else {
            // No role found - check if this user was invited as a client
            if (userEmail) {
              // Call database function to auto-activate client
              const { data: activationResult, error: activationError } = await supabase
                .rpc('auto_activate_client', {
                  p_user_id: userId,
                  p_email: userEmail
                });

              if (activationResult?.success) {
                // Client activated successfully
                const clientId = activationResult.client_id;

                // Redirect based on interview state
                const interviewState = await getClientInterviewState(clientId);
                if (interviewState === 'active') {
                  navigate('/interview', { replace: true });
                } else {
                  navigate('/dashboard', { replace: true });
                }
                return;
              } else {
                // Activation failed - show error
                console.error('Auto-activation failed:', activationResult?.error || activationError);
              }
            }

            // No matching client found - unauthorized access
            setError('Your account is pending activation. Please contact an administrator.');
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

