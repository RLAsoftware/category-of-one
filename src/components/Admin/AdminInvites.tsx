import { useState, useEffect, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, Button, Input } from '../ui';
import type { AdminInvite } from '../../lib/types';
import { UserPlus, Check, Clock, Trash2, Loader2 } from 'lucide-react';

export function AdminInvites() {
  const [invites, setInvites] = useState<AdminInvite[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

    const normalizedEmail = email.trim().toLowerCase();

    // Client-side duplicate protection: check existing invites
    const existingInvite = invites.find(
      (invite) => invite.email.toLowerCase() === normalizedEmail
    );

    if (existingInvite) {
      setError(
        existingInvite.accepted_at
          ? 'This email is already an admin.'
          : 'This email has already been invited.'
      );
      setSending(false);
      return;
    }

    try {
      // Create invite record
      const { error: createError } = await supabase
        .from('admin_invites')
        .insert({ email: normalizedEmail });

      if (createError) {
        // Handle unique constraint violation from admin_invites_email_lower_key
        const code = (createError as any).code as string | undefined;
        const message = (createError as any).message as string | undefined;

        if (
          code === '23505' ||
          (message &&
            message.toLowerCase().includes('admin_invites_email_lower_key'))
        ) {
          throw new Error('This email has already been invited or is an admin.');
        }

        throw createError;
      }

      // Send magic link
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
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

  const handleDelete = async (invite: AdminInvite) => {
    setDeletingId(invite.id);
    setError(null);

    try {
      // If the invite was accepted, we need to also remove the admin role
      if (invite.accepted_at) {
        // Call database function to remove admin role by email
        const { error: roleError } = await supabase.rpc('remove_admin_by_email', {
          admin_email: invite.email
        });

        if (roleError) {
          console.error('Error removing admin role:', roleError);
          throw new Error(`Failed to remove admin role: ${roleError.message}`);
        }
      }

      // Delete the invite record
      const { error: deleteError } = await supabase
        .from('admin_invites')
        .delete()
        .eq('id', invite.id);

      if (deleteError) {
        throw new Error(`Failed to delete invite: ${deleteError.message}`);
      }

      loadInvites();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete admin');
    } finally {
      setDeletingId(null);
    }
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
              <button
                type="button"
                disabled={deletingId === invite.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (invite.accepted_at) {
                    if (window.confirm(`Are you sure you want to remove ${invite.email} as an admin? This will revoke their admin access.`)) {
                      handleDelete(invite);
                    }
                  } else {
                    if (window.confirm(`Are you sure you want to delete the invite for ${invite.email}?`)) {
                      handleDelete(invite);
                    }
                  }
                }}
                className="inline-flex items-center justify-center p-2 text-slate hover:text-error hover:bg-error/10 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-error/20 disabled:opacity-50 disabled:cursor-not-allowed"
                title={`Delete ${invite.accepted_at ? 'admin' : 'invite'}`}
                aria-label={`Delete ${invite.email}`}
              >
                {deletingId === invite.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

