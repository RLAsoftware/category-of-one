import { useState, useEffect, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, Button, Input } from '../ui';
import type { AdminInvite } from '../../lib/types';
import { UserPlus, Check, Clock, Trash2 } from 'lucide-react';

export function AdminInvites() {
  const [invites, setInvites] = useState<AdminInvite[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInvites();
  }, []);

  const loadInvites = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('admin_invites')
      .select('*')
      .order('created_at', { ascending: false });
    setInvites(data || []);
    setLoading(false);
  };

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      // Create invite record
      const { error: createError } = await supabase
        .from('admin_invites')
        .insert({ email });

      if (createError) throw createError;

      // Send magic link
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) throw authError;

      setEmail('');
      loadInvites();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invite');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('admin_invites').delete().eq('id', id);
    loadInvites();
  };

  return (
    <Card variant="bordered">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="w-5 h-5 text-sunset" />
        <h2 className="text-lg">Admin Team</h2>
      </div>

      {/* Invite Form */}
      <form onSubmit={handleInvite} className="flex gap-2 mb-6">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="colleague@example.com"
          className="flex-1"
          required
        />
        <Button type="submit" loading={sending}>
          Invite Admin
        </Button>
      </form>

      {error && (
        <p className="text-sm text-error mb-4">{error}</p>
      )}

      {/* Invites List */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-12 bg-ink/5 rounded animate-pulse" />
          ))}
        </div>
      ) : invites.length === 0 ? (
        <p className="text-slate text-center py-4">
          No admin invites yet.
        </p>
      ) : (
        <div className="space-y-2">
          {invites.map((invite) => (
            <div
              key={invite.id}
              className="flex items-center justify-between p-3 rounded-lg bg-cream"
            >
              <div className="flex items-center gap-3">
                {invite.accepted_at ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Clock className="w-4 h-4 text-terracotta" />
                )}
                <span className="text-ink">{invite.email}</span>
                {invite.accepted_at && (
                  <span className="text-xs text-success">Joined</span>
                )}
              </div>
              {!invite.accepted_at && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(invite.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

