import { Sparkles, Clock, Target, TrendingUp } from 'lucide-react';
import { Button } from '../ui';

interface EmptyStateProps {
  onStartInterview: () => void;
}

export function EmptyState({ onStartInterview }: EmptyStateProps) {
  return (
    <div className="max-w-3xl mx-auto text-center py-12">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-sunset to-amber-500 mb-6 shadow-lg">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-display mb-4">
          Discover Your Category of One
        </h1>
        <p className="text-xl text-slate max-w-2xl mx-auto leading-relaxed">
          Have a conversation with our AI strategist to uncover what makes you uniquely valuable in your market.
        </p>
      </div>

      {/* What to Expect */}
      <div className="bg-white rounded-2xl p-8 mb-8 text-left">
        <h2 className="text-2xl font-semibold text-ink mb-6 text-center">What to Expect</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-ink mb-2">15-20 Minutes</h3>
            <p className="text-sm text-slate">
              A thoughtful conversation at your own pace
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-ink mb-2">Deep Discovery</h3>
            <p className="text-sm text-slate">
              We'll explore your unique positioning and value
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-ink mb-2">Clear Profile</h3>
            <p className="text-sm text-slate">
              Get a comprehensive Category of One profile
            </p>
          </div>
        </div>
      </div>

      {/* Sample Preview */}
      <div className="bg-gradient-to-br from-sunset/5 to-amber-50 rounded-2xl p-6 mb-8 text-left border border-sunset/20">
        <p className="text-xs uppercase tracking-wide text-sunset font-medium mb-2">
          Example Positioning Statement
        </p>
        <p className="text-ink italic leading-relaxed">
          "Unlike traditional consultants who provide generic frameworks, we help tech founders discover and articulate their unique market position through AI-powered strategic conversations."
        </p>
      </div>

      {/* CTA */}
      <Button
        onClick={onStartInterview}
        variant="primary"
        className="text-lg px-8 py-6 h-auto gap-3 shadow-lg hover:shadow-xl transition-shadow"
      >
        <Sparkles className="w-5 h-5" />
        Start Your First Interview
      </Button>
      
      <p className="text-sm text-slate mt-4">
        Your progress is automatically saved as you go
      </p>
    </div>
  );
}

