import { useEffect, useState } from 'react';
import { supabase, getLLMConfig, updateLLMConfig } from '../../lib/supabase';
import type { LLMConfig, UserRole } from '../../lib/types';
import { Button, Card, Textarea, Input } from '../ui';
import { Loader2, Settings2 } from 'lucide-react';

interface LLMConfigPanelProps {
  role: UserRole | null;
}

export function LLMConfigPanel({ role }: LLMConfigPanelProps) {
  const [config, setConfig] = useState<LLMConfig | null>(null);
  const [model, setModel] = useState('');
  const [availableModels, setAvailableModels] = useState<{ id: string; label: string }[]>([]);
  const [chatPrompt, setChatPrompt] = useState('');
  const [synthesisPrompt, setSynthesisPrompt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const isAdmin = role === 'admin';
  const isDirty =
    !!config &&
    (model !== config.model ||
      chatPrompt !== config.chat_system_prompt ||
      synthesisPrompt !== config.synthesis_system_prompt);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      setSaved(false);
      try {
        // Load current config
        const cfg = await getLLMConfig('category_of_one');
        if (cfg) {
          setConfig(cfg);
          setModel(cfg.model);
          setChatPrompt(cfg.chat_system_prompt);
          setSynthesisPrompt(cfg.synthesis_system_prompt);
        } else {
          setError('No LLM configuration found. Please contact support.');
        }

        // Load available Claude models from edge function
        const { data, error } = await supabase.functions.invoke<{
          models: { id: string; label: string }[];
        }>('list-claude-models');

        if (error) {
          console.error('list-claude-models error:', error);
        } else if (data?.models?.length) {
          setAvailableModels(data.models);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load LLM configuration');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSave = async () => {
    if (!config || !isAdmin) return;
    if (!model.trim()) {
      setError('Model name is required.');
      return;
    }
    if (!chatPrompt.trim() || !synthesisPrompt.trim()) {
      setError('Both prompts are required.');
      return;
    }

    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const updated = await updateLLMConfig('category_of_one', {
        model: model.trim(),
        chat_system_prompt: chatPrompt,
        synthesis_system_prompt: synthesisPrompt,
      });
      if (updated) {
        setConfig(updated);
        setSaved(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card variant="elevated" className="mt-8">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-sunset/10 flex items-center justify-center flex-shrink-0">
          <Settings2 className="w-5 h-5 text-sunset" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-ink">Category of One configuration</h2>
          <p className="text-sm text-slate">
            View and manage the Claude model and prompts used for the Category of One interview.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-sunset animate-spin" />
        </div>
      ) : !config ? null : (
        <>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate mb-1">
                Claude model
              </label>
              {availableModels.length > 0 ? (
                <select
                  value={model}
                  onChange={(e) => {
                    setModel(e.target.value);
                    setSaved(false);
                  }}
                  disabled={!isAdmin}
                  className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-sunset/30 focus:border-sunset disabled:opacity-50"
                >
                  {availableModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                  {!availableModels.find((m) => m.id === model) && model && (
                    <option value={model}>{model} (current)</option>
                  )}
                </select>
              ) : (
                <Input
                  value={model}
                  onChange={(e) => {
                    setModel(e.target.value);
                    setSaved(false);
                  }}
                  placeholder="claude-sonnet-4-20250514"
                  disabled={!isAdmin}
                />
              )}
              <p className="text-xs text-slate mt-1">
                Models are loaded live from Claude. Changes take effect on the next conversation.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-1">
                Chat system prompt (interview)
              </label>
              <Textarea
                value={chatPrompt}
                onChange={(e) => {
                  setChatPrompt(e.target.value);
                  setSaved(false);
                }}
                rows={8}
                className="font-mono text-xs bg-white"
                disabled={!isAdmin}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-1">
                Synthesis system prompt (profile generation)
              </label>
              <Textarea
                value={synthesisPrompt}
                onChange={(e) => {
                  setSynthesisPrompt(e.target.value);
                  setSaved(false);
                }}
                rows={8}
                className="font-mono text-xs bg-white"
                disabled={!isAdmin}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate mb-2">
            <div>
              <span className="font-medium">Last updated:</span>{' '}
              {new Date(config.updated_at).toLocaleString()}
            </div>
            {!isAdmin && (
              <div className="italic">
                You have read-only access. Contact an admin to change model or prompts.
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSave}
                disabled={saving || !isDirty}
                loading={saving}
              >
                Save Changes
              </Button>
              {saved && !error && (
                <span className="text-xs text-success">Saved. New chats will use this config.</span>
              )}
              {!isDirty && !saved && (
                <span className="text-xs text-slate">
                  No changes. Edit the fields above to enable saving.
                </span>
              )}
            </div>
          )}
        </>
      )}
    </Card>
  );
}


