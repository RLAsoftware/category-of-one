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
            // For clients, check if they have history to decide where to redirect
            const client = await getClientByUserId(userId);
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
            // No role found - check if this user was invited as a client
            if (userEmail) {
              const { data: clientData } = await supabase
                .from('clients')
                .select('*')
                .ilike('email', userEmail)
                .maybeSingle();

              if (clientData) {
                // This is a valid client who was invited by an admin
                // Auto-activate them by:
                // 1. Linking auth user to client record
                await supabase
                  .from('clients')
                  .update({ user_id: userId })
                  .eq('id', clientData.id);

                // 2. Creating user_roles entry
                await supabase
                  .from('user_roles')
                  .insert({
                    user_id: userId,
                    role: 'client'
                  });

                // 3. Redirect based on their history
                const hasHistory = await hasClientHistory(clientData.id);
                if (hasHistory) {
                  navigate('/dashboard', { replace: true });
                } else {
                  navigate('/interview', { replace: true });
                }
                return;
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

