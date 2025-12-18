import { Download, RefreshCw, Target, Sparkles, Users, Lightbulb, TrendingUp, Trophy, ArrowLeft, Compass, Briefcase, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../ui';
import type { CategoryOfOneProfile } from '../../lib/types';

interface ProfileResultProps {
  profile: CategoryOfOneProfile;
  clientName: string;
  onReset: () => void;
  onExportFull: () => void;
}

export function ProfileResult({
  profile,
  clientName,
  onReset,
  onExportFull,
}: ProfileResultProps) {
  const navigate = useNavigate();

  // Handle both old and new schema
  const positioningText = typeof profile.positioning_statement === 'string' 
    ? profile.positioning_statement 
    : profile.positioning_statement?.full_statement || 'Not discussed';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-sunset to-amber-500 mb-6 shadow-lg animate-bounce-in">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-display mb-4">Your Category of One</h1>
        <p className="text-lg text-slate max-w-xl mx-auto">
          Here's your unique positioning profile based on our conversation, {clientName}.
        </p>
        {profile.needs_review && (
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm">
            ⚠️ This profile may need admin review
          </div>
        )}
      </div>

      {/* Profile Cards */}
      <div className="space-y-6 animate-stagger-in">
        {/* Positioning Statement - Featured */}
        <Card variant="elevated" className="bg-gradient-to-br from-sunset/5 to-amber-50 border-sunset/20 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-sunset/20 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-sunset" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-ink mb-2">Positioning Statement</h2>
              <p className="text-xl text-ink leading-relaxed">
                {positioningText}
              </p>
            </div>
          </div>
        </Card>

        {/* Confluence - Why Now */}
        {profile.confluence && (
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Compass className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-ink pt-1.5">The Confluence — Why Now</h2>
            </div>
            <p className="text-slate leading-relaxed mb-4">
              {profile.confluence.why_now_summary}
            </p>
            {profile.confluence.megatrends && profile.confluence.megatrends.length > 0 && (
              <div className="space-y-3">
                {profile.confluence.megatrends.map((trend, index) => (
                  <div key={index} className="bg-blue-50 rounded-lg p-3">
                    <p className="font-medium text-blue-900 mb-1">{trend.name}</p>
                    <p className="text-sm text-blue-700">{trend.description}</p>
                  </div>
                ))}
              </div>
            )}
            {profile.confluence.named_phenomenon && (
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Named Phenomenon: <span className="font-bold">{profile.confluence.named_phenomenon}</span></p>
              </div>
            )}
          </Card>
        )}

        {/* Contrarian Approach - Why This */}
        {profile.contrarian_approach && (
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-ink pt-1.5">The Contrarian Approach — Why This</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate mb-2">Conventional frustration:</p>
                <p className="text-ink">{profile.contrarian_approach.conventional_frustration}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate mb-2">Where they break convention:</p>
                <p className="text-ink">{profile.contrarian_approach.where_they_break_convention}</p>
              </div>
              {profile.contrarian_approach.contrarian_beliefs && profile.contrarian_approach.contrarian_beliefs.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate mb-2">Contrarian beliefs:</p>
                  <ul className="space-y-2">
                    {profile.contrarian_approach.contrarian_beliefs.map((belief, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-600 font-bold flex-shrink-0">•</span>
                        <span className="text-ink">{belief}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {profile.contrarian_approach.mind_share_word && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-red-900">Mind share word: <span className="font-bold">{profile.contrarian_approach.mind_share_word}</span></p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* All Roads Story - Why You */}
        {profile.all_roads_story && (
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-ink pt-1.5">The All Roads Story — Why You</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-purple-900 mb-2">Mercenary Story</p>
                <p className="text-purple-800">{profile.all_roads_story.mercenary_story}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-purple-900 mb-2">Missionary Story</p>
                <p className="text-purple-800">{profile.all_roads_story.missionary_story}</p>
              </div>
              {profile.all_roads_story.critical_combo && profile.all_roads_story.critical_combo.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-purple-900 mb-2">Critical Combo</p>
                  <ul className="space-y-2">
                    {profile.all_roads_story.critical_combo.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-purple-600 font-bold flex-shrink-0">•</span>
                        <span className="text-purple-800">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Two Column Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Unique Differentiation */}
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-pink-600" />
              </div>
              <h2 className="text-lg font-semibold text-ink pt-1.5">Unique Differentiation</h2>
            </div>
            <p className="text-slate leading-relaxed">
              {profile.unique_differentiation || 'Not discussed'}
            </p>
          </Card>

          {/* Competitive Landscape */}
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-semibold text-ink pt-1.5">Why Choose You</h2>
            </div>
            <p className="text-slate leading-relaxed">
              {profile.competitive_landscape || 'Not discussed'}
            </p>
          </Card>
        </div>

        {/* Transformation */}
        {profile.transformation && (
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold text-ink pt-1.5">Transformation Delivered</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-slate/5 rounded-xl p-4">
                <p className="text-sm font-semibold text-slate mb-2">Before</p>
                {profile.transformation.before?.frustrations && profile.transformation.before.frustrations.length > 0 ? (
                  <ul className="space-y-1 text-sm">
                    {profile.transformation.before.frustrations.map((f, i) => (
                      <li key={i} className="text-ink/70">• {f}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-ink/70">{typeof profile.transformation.before === 'string' ? profile.transformation.before : 'Not discussed'}</p>
                )}
              </div>
              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-emerald-700 mb-2">After</p>
                {profile.transformation.after?.outcomes && profile.transformation.after.outcomes.length > 0 ? (
                  <ul className="space-y-1 text-sm">
                    {profile.transformation.after.outcomes.map((o, i) => (
                      <li key={i} className="text-emerald-900">• {o}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-emerald-900">{typeof profile.transformation.after === 'string' ? profile.transformation.after : 'Not discussed'}</p>
                )}
              </div>
            </div>
            {profile.transformation.after?.what_becomes_possible && (
              <div className="bg-emerald-100 rounded-lg p-3">
                <p className="text-sm font-medium text-emerald-900 mb-1">What becomes possible:</p>
                <p className="text-emerald-800">{profile.transformation.after.what_becomes_possible}</p>
              </div>
            )}
            {profile.transformation.client_example && (
              <div className="mt-4 bg-amber-50 rounded-lg p-3">
                <p className="text-sm font-medium text-amber-900 mb-1">Client Example:</p>
                <p className="text-amber-800">{profile.transformation.client_example}</p>
              </div>
            )}
          </Card>
        )}

        {/* Proof Points */}
        {profile.proof_points && (
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-ink pt-1.5">Proof Points</h2>
            </div>
            <div className="space-y-4">
              {profile.proof_points.client_results && profile.proof_points.client_results.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate mb-2">Client Results:</p>
                  <ul className="space-y-1">
                    {profile.proof_points.client_results.map((r, i) => (
                      <li key={i} className="text-ink text-sm">• {r}</li>
                    ))}
                  </ul>
                </div>
              )}
              {profile.proof_points.testimonials && profile.proof_points.testimonials.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate mb-2">Testimonials:</p>
                  <div className="space-y-2">
                    {profile.proof_points.testimonials.map((t, i) => (
                      <div key={i} className="bg-amber-50 rounded-lg p-3 italic text-amber-900 text-sm">
                        "{t}"
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {profile.proof_points.credentials && profile.proof_points.credentials.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate mb-2">Credentials:</p>
                  <ul className="space-y-1">
                    {profile.proof_points.credentials.map((c, i) => (
                      <li key={i} className="text-ink text-sm">• {c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Unique Methodology */}
        {profile.unique_methodology && (
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '0.9s' }}>
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
            {profile.unique_methodology.steps_or_components && profile.unique_methodology.steps_or_components.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate">Key Steps:</p>
                <ul className="space-y-2">
                  {profile.unique_methodology.steps_or_components.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-ink pt-0.5">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-slate">No named methodology was discussed.</p>
            )}
            {profile.unique_methodology.what_makes_it_distinctive && (
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm font-medium text-indigo-900 mb-1">What makes it distinctive:</p>
                <p className="text-indigo-800">{profile.unique_methodology.what_makes_it_distinctive}</p>
              </div>
            )}
          </Card>
        )}

        {/* Voice and Language */}
        {profile.voice_and_language && (
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '1.0s' }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-lg font-semibold text-ink pt-1.5">Voice and Language Notes</h2>
            </div>
            {profile.voice_and_language.distinctive_phrases && profile.voice_and_language.distinctive_phrases.length > 0 ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate mb-2">Distinctive phrases:</p>
                  <div className="space-y-1">
                    {profile.voice_and_language.distinctive_phrases.map((phrase, i) => (
                      <div key={i} className="bg-teal-50 rounded-lg p-2 text-teal-900 text-sm italic">
                        "{phrase}"
                      </div>
                    ))}
                  </div>
                </div>
                {profile.voice_and_language.tone_notes && (
                  <div>
                    <p className="text-sm font-medium text-slate mb-2">Tone:</p>
                    <p className="text-ink">{profile.voice_and_language.tone_notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate">No distinctive phrases captured.</p>
            )}
          </Card>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center mt-12 animate-fade-in" style={{ animationDelay: '1.1s' }}>
        <Button onClick={() => navigate('/dashboard')} variant="ghost" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <Button onClick={onExportFull} variant="primary" className="gap-2">
          <Download className="w-4 h-4" />
          Export full profile
        </Button>
      </div>
    </div>
  );
}
