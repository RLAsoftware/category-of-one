import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, getUserRole } from '../lib/supabase';
import { Button, Input, Card } from '../components/ui';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';

export function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(Boolean(data.session));
    });
  }, []);

  const handleSubmit = async () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Fetch role and redirect
    const role = data.user ? await getUserRole(data.user.id) : null;
    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'client') {
        navigate('/interview', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }, 1200);
  };

  if (hasSession === false) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <Card variant="elevated" className="max-w-md text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-error" />
          </div>
          <h1 className="text-2xl mb-2">Session not found</h1>
          <p className="text-slate mb-4">Open the reset link from your email again.</p>
          <Button onClick={() => navigate('/login')} variant="secondary">
            Back to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <Card variant="elevated" className="max-w-md w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-sunset/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-sunset" />
          </div>
          <div>
            <h1 className="text-xl">Set a new password</h1>
            <p className="text-sm text-slate">Enter and confirm your new password.</p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          {error && <p className="text-sm text-error text-center">{error}</p>}
          {success && (
            <p className="text-sm text-success text-center flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Password updated
            </p>
          )}

          <Button
            className="w-full"
            size="lg"
            loading={loading}
            onClick={handleSubmit}
            disabled={!password || !confirm}
          >
            Update Password
          </Button>
        </div>
      </Card>
    </div>
  );
}

