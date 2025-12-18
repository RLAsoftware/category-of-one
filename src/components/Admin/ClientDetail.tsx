import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, Button, Input } from '../ui';
import type { Client, StyleProfile, CategoryOfOneProfile } from '../../lib/types';
import {
  ArrowLeft,
  Send,
  FileText,
  CheckCircle,
  Clock,
  Mail,
  User,
  Building,
  Calendar,
  Copy,
  Check,
  Trash2,
  Users,
  Settings,
  Key,
  X,
} from 'lucide-react';

interface ClientDetailProps {
  client: Client;
  onBack: () => void;
  onDelete?: () => void;
}

export function ClientDetail({ client, onBack, onDelete }: ClientDetailProps) {
  const [profiles, setProfiles] = useState<StyleProfile[]>([]);
  const [categoryProfiles, setCategoryProfiles] = useState<CategoryOfOneProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingPassword, setSettingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    loadClientData();
  }, [client.id]);

  const loadClientData = async () => {
    setLoading(true);
    
    const [profilesRes, categoryProfilesRes] = await Promise.all([
      supabase.from('style_profiles').select('*').eq('client_id', client.id).order('created_at', { ascending: false }),
      supabase.from('category_of_one_profiles').select('*').eq('client_id', client.id).order('created_at', { ascending: false }),
    ]);

    setProfiles(profilesRes.data || []);
    setCategoryProfiles(categoryProfilesRes.data || []);
    setLoading(false);
  };

  const handleSendInvite = async () => {
    setSendingInvite(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: client.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (!error) {
        await supabase
          .from('clients')
          .update({ invite_sent_at: new Date().toISOString() })
          .eq('id', client.id);
      }
    } finally {
      setSendingInvite(false);
    }
  };

  const handleCopyProfile = async (profile: string) => {
    await navigator.clipboard.writeText(profile);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSetPassword = async () => {
    if (!client.user_id) {
      setPasswordError('Client must have an account to set a password');
      return;
    }

    if (!password || !confirmPassword) {
      setPasswordError('Please enter both password fields');
      return;
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordError(null);
    setSettingPassword(true);

    try {
      const { data, error } = await supabase.functions.invoke('set-client-password', {
        body: {
          userId: client.user_id,
          password: password,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setPasswordSuccess(true);
      setPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
        setPasswordError(null);
      }, 2000);
    } catch (err) {
      console.error('Error setting password:', err);
      setPasswordError(err instanceof Error ? err.message : 'Failed to set password. Please try again.');
    } finally {
      setSettingPassword(false);
    }
  };

  const handleDeleteClient = async () => {
    const confirmMessage = client.user_id
      ? `Are you sure you want to delete ${client.name}? This will permanently delete their account, all profiles, and interview data. This action cannot be undone.`
      : `Are you sure you want to delete ${client.name}? This will permanently delete all their data. This action cannot be undone.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setDeleting(true);
    try {
      const { error } = await supabase.rpc('delete_client_and_user', {
        client_id_param: client.id,
      });

      if (error) {
        console.error('Error deleting client:', error);
        alert('Failed to delete client. Please try again.');
        setDeleting(false);
        return;
      }

      // Call the onDelete callback if provided, otherwise just go back
      if (onDelete) {
        onDelete();
      } else {
        onBack();
      }
    } catch (err) {
      console.error('Error deleting client:', err);
      alert('Failed to delete client. Please try again.');
      setDeleting(false);
    }
  };

  const latestCategoryProfile = categoryProfiles[0] || null;

  const downloadMarkdown = (filename: string, content?: string | null) => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate hover:text-ink mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to clients
      </button>

      {/* Client Header */}
      <Card variant="elevated" className="mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-sunset/10 flex items-center justify-center">
              <User className="w-7 h-7 text-sunset" />
            </div>
            <div>
              <h1 className="text-2xl mb-1">{client.name}</h1>
              <div className="flex items-center gap-4 text-sm text-slate">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {client.email}
                </span>
                {client.company && (
                  <span className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {client.company}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(client.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {client.user_id && (
              <Button
                onClick={() => {
                  setShowPasswordModal(true);
                  setPasswordError(null);
                  setPasswordSuccess(false);
                }}
                variant="secondary"
              >
                <Key className="w-4 h-4 mr-2" />
                Set Password
              </Button>
            )}
            <Button
              onClick={handleSendInvite}
              loading={sendingInvite}
              disabled={client.user_id !== null}
            >
              <Send className="w-4 h-4 mr-2" />
              Resend Invite
            </Button>
            <Button
              onClick={handleDeleteClient}
              loading={deleting}
              variant="secondary"
              className="border-2 border-error !text-error hover:!bg-error/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Client
            </Button>
          </div>
        </div>
      </Card>

      {/* Status Badge */}
      <div className="mb-6">
        {client.user_id ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="text-success font-medium">Account Active</span>
          </div>
        ) : client.invite_sent_at ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-terracotta/10">
            <Clock className="w-5 h-5 text-terracotta" />
            <span className="text-terracotta font-medium">
              Invite sent {new Date(client.invite_sent_at).toLocaleDateString()}
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate/10">
            <Clock className="w-5 h-5 text-slate" />
            <span className="text-slate font-medium">Pending invite</span>
          </div>
        )}
      </div>

      {/* Two-Column Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category of One Outputs */}
        <Card variant="bordered" className="h-full">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-sunset" />
            <h2 className="text-lg">Category of One Outputs</h2>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 bg-ink/5 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {latestCategoryProfile ? (
                <div>
                  <p className="text-xs text-slate mb-3">
                    These markdown files were generated from the latest completed interview.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        downloadMarkdown(
                          `category-of-one-full-${client.name.toLowerCase().replace(/\s+/g, '-')}.md`,
                          latestCategoryProfile.raw_profile
                        )
                      }
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Full profile
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        downloadMarkdown(
                          `business-profile-${client.name.toLowerCase().replace(/\s+/g, '-')}.md`,
                          latestCategoryProfile.business_profile_md
                        )
                      }
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      business-profile.md
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        downloadMarkdown(
                          `category-of-one-${client.name.toLowerCase().replace(/\s+/g, '-')}.md`,
                          latestCategoryProfile.category_of_one_md || latestCategoryProfile.raw_profile
                        )
                      }
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      category-of-one.md
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-sunset/10 flex items-center justify-center mb-4">
                    <FileText className="w-10 h-10 text-sunset" />
                  </div>
                  <p className="text-sm text-slate max-w-xs">
                    No outputs yet. Once the client completes their interview, the generated markdown files will appear here.
                  </p>
                </div>
              )}
            </>
          )}
        </Card>

        {/* Style Profiles */}
        <Card variant="bordered" className="h-full">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-sunset" />
            <h2 className="text-lg">Style Profiles</h2>
          </div>

          {loading ? (
            <div className="h-24 bg-ink/5 rounded-lg animate-pulse" />
          ) : profiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-sunset/10 flex items-center justify-center mb-4">
                <Settings className="w-10 h-10 text-sunset" />
              </div>
              <p className="text-sm text-slate max-w-xs">
                No style profiles yet. The client needs to complete an interview first.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="p-4 rounded-lg bg-cream"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-slate">
                      Created {new Date(profile.created_at).toLocaleDateString()}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleCopyProfile(profile.raw_profile)}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="text-sm text-ink/80 whitespace-pre-wrap line-clamp-4">
                    {profile.raw_profile}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Set Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card variant="elevated" className="w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Set Password for {client.name}</h2>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                  setConfirmPassword('');
                  setPasswordError(null);
                  setPasswordSuccess(false);
                }}
                className="text-slate hover:text-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordSuccess ? (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-2" />
                <p className="text-success font-medium">Password updated successfully!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate mb-1">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password (min 8 characters)"
                    disabled={settingPassword}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate mb-1">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    disabled={settingPassword}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !settingPassword) {
                        handleSetPassword();
                      }
                    }}
                  />
                </div>
                {passwordError && (
                  <div className="bg-error/10 border border-error/20 text-error rounded-lg px-4 py-3 text-sm">
                    {passwordError}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleSetPassword}
                    loading={settingPassword}
                    disabled={!password || !confirmPassword}
                    className="flex-1"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Set Password
                  </Button>
                  <Button
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPassword('');
                      setConfirmPassword('');
                      setPasswordError(null);
                    }}
                    variant="secondary"
                    disabled={settingPassword}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

