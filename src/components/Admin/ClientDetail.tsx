import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, Button } from '../ui';
import { BrandKnowledgeEditor } from './BrandKnowledgeEditor';
import type { Client, BrandKnowledge, StyleProfile, CategoryOfOneProfile } from '../../lib/types';
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
  Plus
} from 'lucide-react';

interface ClientDetailProps {
  client: Client;
  onBack: () => void;
}

export function ClientDetail({ client, onBack }: ClientDetailProps) {
  const [brandKnowledge, setBrandKnowledge] = useState<BrandKnowledge[]>([]);
  const [profiles, setProfiles] = useState<StyleProfile[]>([]);
  const [categoryProfiles, setCategoryProfiles] = useState<CategoryOfOneProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingKnowledge, setEditingKnowledge] = useState<BrandKnowledge | null>(null);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadClientData();
  }, [client.id]);

  const loadClientData = async () => {
    setLoading(true);
    
    const [knowledgeRes, profilesRes, categoryProfilesRes] = await Promise.all([
      supabase.from('brand_knowledge').select('*').eq('client_id', client.id).order('created_at'),
      supabase.from('style_profiles').select('*').eq('client_id', client.id).order('created_at', { ascending: false }),
      supabase.from('category_of_one_profiles').select('*').eq('client_id', client.id).order('created_at', { ascending: false }),
    ]);

    setBrandKnowledge(knowledgeRes.data || []);
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

  const handleSaveKnowledge = async (title: string, content: string) => {
    if (editingKnowledge) {
      await supabase
        .from('brand_knowledge')
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq('id', editingKnowledge.id);
    } else {
      await supabase
        .from('brand_knowledge')
        .insert({ client_id: client.id, title, content });
    }
    setShowEditor(false);
    setEditingKnowledge(null);
    loadClientData();
  };

  const handleDeleteKnowledge = async (id: string) => {
    await supabase.from('brand_knowledge').delete().eq('id', id);
    loadClientData();
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

  if (showEditor) {
    return (
      <BrandKnowledgeEditor
        initialTitle={editingKnowledge?.title}
        initialContent={editingKnowledge?.content}
        onSave={handleSaveKnowledge}
        onCancel={() => {
          setShowEditor(false);
          setEditingKnowledge(null);
        }}
      />
    );
  }

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
      <Card variant="elevated" className="mb-6">
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
          
          {!client.user_id && (
            <Button
              onClick={handleSendInvite}
              loading={sendingInvite}
              variant="secondary"
            >
              <Send className="w-4 h-4 mr-2" />
              {client.invite_sent_at ? 'Resend Invite' : 'Send Invite'}
            </Button>
          )}
        </div>

        {/* Status */}
        <div className="mt-4 pt-4 border-t border-ink/10">
          <div className="flex items-center gap-2">
            {client.user_id ? (
              <>
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-success">Account Active</span>
              </>
            ) : client.invite_sent_at ? (
              <>
                <Clock className="w-5 h-5 text-terracotta" />
                <span className="text-terracotta">
                  Invite sent {new Date(client.invite_sent_at).toLocaleDateString()}
                </span>
              </>
            ) : (
              <>
                <Clock className="w-5 h-5 text-slate" />
                <span className="text-slate">Pending invite</span>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Category of One Outputs & Brand Knowledge */}
      <Card variant="bordered" className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-sunset" />
            <h2 className="text-lg">Brand Knowledge & Outputs</h2>
          </div>
          <Button
            size="sm"
            onClick={() => setShowEditor(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Document
          </Button>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-ink/5 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Category of One outputs */}
            {latestCategoryProfile ? (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-ink mb-2">
                  Category of One Outputs
                </h3>
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
              <p className="text-xs text-slate mb-6">
                No Category of One outputs yet. Once the client completes their interview, the
                generated markdown files will appear here.
              </p>
            )}

            <div className="border-t border-ink/10 pt-4">
              <h3 className="text-sm font-semibold text-ink mb-2">Brand Knowledge Documents</h3>

              {brandKnowledge.length === 0 ? (
                <p className="text-slate text-center py-4 text-sm">
                  No brand knowledge added yet. Add documents to provide context for the AI
                  interview.
                </p>
              ) : (
                <div className="space-y-2">
                  {brandKnowledge.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-cream hover:bg-cream/70 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-ink">{doc.title}</h3>
                        <p className="text-sm text-slate">
                          {doc.content.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingKnowledge(doc);
                            setShowEditor(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-error hover:text-error"
                          onClick={() => handleDeleteKnowledge(doc.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </Card>

      {/* Style Profiles */}
      <Card variant="bordered">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-success" />
          <h2 className="text-lg">Style Profiles</h2>
        </div>

        {loading ? (
          <div className="h-24 bg-ink/5 rounded-lg animate-pulse" />
        ) : profiles.length === 0 ? (
          <p className="text-slate text-center py-8">
            No style profiles yet. The client needs to complete an interview first.
          </p>
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
  );
}

