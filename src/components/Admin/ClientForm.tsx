import { useState, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, Button, Input } from '../ui';
import { ArrowLeft, Send, UserPlus } from 'lucide-react';

interface ClientFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function ClientForm({ onBack, onSuccess }: ClientFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendInvite, setSendInvite] = useState(true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Generate invite token
      const inviteToken = crypto.randomUUID();

      // Create client record
      const { data: client, error: createError } = await supabase
        .from('clients')
        .insert({
          name,
          email,
          company: company || null,
          invite_token: inviteToken,
        })
        .select()
        .single();

      if (createError) throw createError;

      if (sendInvite) {
        // Send magic link to client's email
        const { error: inviteError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              invite_token: inviteToken,
            },
          },
        });

        if (inviteError) {
          console.warn('Failed to send invite:', inviteError);
        } else {
          // Update invite_sent_at
          await supabase
            .from('clients')
            .update({ invite_sent_at: new Date().toISOString() })
            .eq('id', client.id);
        }
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate hover:text-ink mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to clients
      </button>

      <Card variant="elevated">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-sunset/10 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-sunset" />
          </div>
          <div>
            <h2 className="text-xl">Add New Client</h2>
            <p className="text-sm text-slate">Create a client profile and optionally send an invite.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Client Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
          />

          <Input
            label="Company (optional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Inc."
          />

          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="sendInvite"
              checked={sendInvite}
              onChange={(e) => setSendInvite(e.target.checked)}
              className="w-4 h-4 rounded border-ink/20 text-sunset focus:ring-sunset"
            />
            <label htmlFor="sendInvite" className="text-sm text-slate">
              Send invite email immediately
            </label>
          </div>

          {error && (
            <p className="text-sm text-error">{error}</p>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onBack}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1"
            >
              {sendInvite ? (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Create & Invite
                </>
              ) : (
                'Create Client'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

