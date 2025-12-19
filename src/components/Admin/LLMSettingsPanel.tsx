import React, { useState } from 'react';
import type { UserRole } from '../../lib/types';
import { LLMConfigPanel } from './LLMConfigPanel';
import { Card } from '../ui';
import { Sparkles, FileText, Users, Target, BadgeDollarSign } from 'lucide-react';

interface LLMSettingsPanelProps {
  role: UserRole | null;
}

type InterviewKey =
  | 'category_of_one'
  | 'single_source_of_truth'
  | 'brand_voice'
  | 'ideal_customer_profile'
  | 'offer';

type InterviewTabMeta = {
  key: InterviewKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const INTERVIEW_TABS: InterviewTabMeta[] = [
  {
    key: 'category_of_one',
    label: 'Category of One',
    icon: Sparkles,
  },
  {
    key: 'single_source_of_truth',
    label: 'Single Source of Truth',
    icon: FileText,
  },
  {
    key: 'brand_voice',
    label: 'Brand Voice',
    icon: Users,
  },
  {
    key: 'ideal_customer_profile',
    label: 'Ideal Customer Profile',
    icon: Target,
  },
  {
    key: 'offer',
    label: 'Offer',
    icon: BadgeDollarSign,
  },
];

export function LLMSettingsPanel({ role }: LLMSettingsPanelProps) {
  const [activeInterview, setActiveInterview] = useState<InterviewKey>('category_of_one');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink mb-1">LLM configuration</h1>
        <p className="text-sm text-slate">
          Choose which interview you want to configure and manage the Claude model and prompts that
          power it.
        </p>
      </div>

      {/* Inner interview tabs */}
      <div className="flex flex-wrap gap-2 border-b border-ink/10 pb-2">
        {INTERVIEW_TABS.map(({ key, label, icon: Icon }) => {
          const isActive = key === activeInterview;
          const isPrimary = key === 'category_of_one';

          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveInterview(key)}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                isActive
                  ? 'bg-ink text-paper border-ink'
                  : 'bg-paper text-slate border-ink/10 hover:border-ink/30 hover:text-ink'
              } ${!isPrimary ? 'opacity-80' : ''}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
              {!isPrimary && (
                <span className="ml-1 rounded-full bg-ink/5 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate border border-ink/10">
                  Coming soon
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content per interview */}
      {activeInterview === 'category_of_one' ? (
        <LLMConfigPanel role={role} />
      ) : (
        <ComingSoonPanel interviewKey={activeInterview} />
      )}
    </div>
  );
}

interface ComingSoonPanelProps {
  interviewKey: InterviewKey;
}

function ComingSoonPanel({ interviewKey }: ComingSoonPanelProps) {
  const meta = getInterviewMeta(interviewKey);

  return (
    <Card variant="elevated" className="mt-4 opacity-90">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-ink/5 flex items-center justify-center flex-shrink-0">
          <meta.icon className="w-5 h-5 text-ink" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-ink">{meta.title}</h2>
          <p className="text-sm text-slate">{meta.description}</p>
        </div>
      </div>

      <div className="rounded-lg border border-dashed border-ink/15 bg-paper px-4 py-3 mb-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate mb-1">
          Claude configuration
        </p>
        <p className="text-sm text-slate">
          Dedicated model and prompt controls for this interview are{' '}
          <span className="font-semibold text-ink">coming soon</span>. You&apos;ll be able to fine
          tune Claude&apos;s behavior for this flow the same way you do for Category of One today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 opacity-60 pointer-events-none select-none">
        <div>
          <label className="block text-xs font-medium text-slate mb-1">Claude model</label>
          <div className="w-full rounded-md border border-ink/10 bg-slate/5 px-3 py-2 text-xs text-slate">
            claude-3.7-sonnet (example)
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate mb-1">
            Chat system prompt (interview)
          </label>
          <div className="h-24 w-full rounded-md border border-ink/10 bg-slate/5 text-[11px] text-slate px-3 py-2 font-mono">
            // Future system prompt for this interview will appear here...
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate mb-1">
            Synthesis system prompt (output generation)
          </label>
          <div className="h-24 w-full rounded-md border border-ink/10 bg-slate/5 text-[11px] text-slate px-3 py-2 font-mono">
            // Future synthesis prompt for this interview will appear here...
          </div>
        </div>
      </div>
    </Card>
  );
}

function getInterviewMeta(interviewKey: InterviewKey): {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
} {
  switch (interviewKey) {
    case 'single_source_of_truth':
      return {
        title: 'Single Source of Truth configuration',
        description:
          'Control how Claude ingests and reconciles your core brand assets into a single, trusted source of truth.',
        icon: FileText,
      };
    case 'brand_voice':
      return {
        title: 'Brand Voice configuration',
        description:
          'Define how Claude understands and expresses your brand voice across every channel and format.',
        icon: Users,
      };
    case 'ideal_customer_profile':
      return {
        title: 'Ideal Customer Profile configuration',
        description:
          'Tune how Claude identifies, segments, and reasons about your ideal customers and buying context.',
        icon: Target,
      };
    case 'offer':
      return {
        title: 'Offer configuration',
        description:
          'Shape how Claude frames, positions, and stress-tests your offers so they land with the right people.',
        icon: BadgeDollarSign,
      };
    case 'category_of_one':
    default:
      return {
        title: 'Category of One configuration',
        description:
          'View and manage the Claude model and prompts used for the Category of One positioning interview.',
        icon: Sparkles,
      };
  }
}


