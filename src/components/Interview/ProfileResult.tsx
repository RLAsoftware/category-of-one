import { Download, RefreshCw, Target, Sparkles, Zap, Users, Lightbulb, TrendingUp, Trophy } from 'lucide-react';
import { Button, Card } from '../ui';
import type { CategoryOfOneProfile } from '../../lib/types';

interface ProfileResultProps {
  profile: CategoryOfOneProfile;
  clientName: string;
  onReset: () => void;
  onExportFull: () => void;
  onExportBusiness: () => void;
  onExportCategory: () => void;
}

export function ProfileResult({
  profile,
  clientName,
  onReset,
  onExportFull,
  onExportBusiness,
  onExportCategory,
}: ProfileResultProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sunset to-amber-500 mb-6">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-display mb-4">Your Category of One</h1>
        <p className="text-lg text-slate max-w-xl mx-auto">
          Here's your unique positioning profile based on our conversation, {clientName}.
        </p>
      </div>

      {/* Profile Cards */}
      <div className="space-y-6">
        {/* Positioning Statement - Featured */}
        <Card variant="elevated" className="bg-gradient-to-br from-sunset/5 to-amber-50 border-sunset/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-sunset/20 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-sunset" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-ink mb-2">Positioning Statement</h2>
              <p className="text-xl text-ink leading-relaxed">
                {profile.positioning_statement || 'Not discussed'}
              </p>
            </div>
          </div>
        </Card>

        {/* Two Column Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Unique Differentiation */}
          <Card variant="elevated">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-ink pt-1.5">Unique Differentiation</h2>
            </div>
            <p className="text-slate leading-relaxed">
              {profile.unique_differentiation || 'Not discussed'}
            </p>
          </Card>

          {/* Competitive Landscape */}
          <Card variant="elevated">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-ink pt-1.5">Why Choose You</h2>
            </div>
            <p className="text-slate leading-relaxed">
              {profile.competitive_landscape || 'Not discussed'}
            </p>
          </Card>
        </div>

        {/* Contrarian Position */}
        {profile.contrarian_position && (
          <Card variant="elevated">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-ink pt-1.5">Contrarian Position</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm font-medium text-green-700 mb-2">What you believe:</p>
                <p className="text-green-900">
                  {profile.contrarian_position.their_belief || 'Not discussed'}
                </p>
              </div>
              <div className="bg-slate/5 rounded-xl p-4">
                <p className="text-sm font-medium text-slate mb-2">What most believe:</p>
                <p className="text-ink/70">
                  {profile.contrarian_position.mainstream_belief || 'Not discussed'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* The Gap They Fill */}
        {profile.gap_they_fill && (
          <Card variant="elevated">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-ink pt-1.5">The Gap You Fill</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate mb-1">Clients come to you frustrated with:</p>
                <p className="text-ink">
                  {profile.gap_they_fill.frustration || 'Not discussed'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate mb-1">They want:</p>
                <p className="text-ink">
                  {profile.gap_they_fill.desired_outcome || 'Not discussed'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Unique Methodology */}
        {profile.unique_methodology && (
          <Card variant="elevated">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-ink">
                  {profile.unique_methodology.name || 'Your Methodology'}
                </h2>
                <p className="text-sm text-slate">Your unique framework</p>
              </div>
            </div>
            <p className="text-slate mb-4">
              {profile.unique_methodology.description || 'Not discussed'}
            </p>
            {profile.unique_methodology.components && profile.unique_methodology.components.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate">Key Components:</p>
                <ul className="space-y-2">
                  {profile.unique_methodology.components.map((component, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-ink pt-0.5">{component}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}

        {/* Transformation */}
        {profile.transformation && (
          <Card variant="elevated">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold text-ink pt-1.5">Transformation Delivered</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-slate/5 rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-slate mb-2">Before</p>
                <p className="text-ink">
                  {profile.transformation.before || 'Not discussed'}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1 bg-emerald-50 rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-emerald-700 mb-2">After</p>
                <p className="text-emerald-900">
                  {profile.transformation.after || 'Not discussed'}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center mt-12">
        <Button onClick={onExportFull} variant="primary" className="gap-2">
          <Download className="w-4 h-4" />
          Export full profile
        </Button>
        <Button onClick={onExportBusiness} variant="secondary" className="gap-2">
          <Download className="w-4 h-4" />
          Export business-profile.md
        </Button>
        <Button onClick={onExportCategory} variant="secondary" className="gap-2">
          <Download className="w-4 h-4" />
          Export category-of-one.md
        </Button>
        <Button onClick={onReset} variant="ghost" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Start Over
        </Button>
      </div>
    </div>
  );
}
