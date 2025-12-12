import { useEffect, useState } from 'react';
import { Card } from '../ui';
import { Brain, Sparkles, Search, Lightbulb } from 'lucide-react';

const LOADING_STEPS = [
  { icon: Search, text: 'Reading your writing sample...' },
  { icon: Brain, text: 'Analyzing linguistic patterns...' },
  { icon: Sparkles, text: 'Identifying unique style markers...' },
  { icon: Lightbulb, text: 'Crafting personalized questions...' },
];

interface LoadingAnalysisProps {
  title?: string;
  subtitle?: string;
}

export function LoadingAnalysis({ 
  title = 'Analyzing your writing style',
  subtitle = 'Our AI editor is reviewing your responses to ask the right follow-up questions.'
}: LoadingAnalysisProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-lg mx-auto text-center">
      <Card variant="elevated" className="py-12">
        {/* Animated Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-sunset/20 animate-ping" />
          <div className="relative w-full h-full rounded-full bg-sunset/10 flex items-center justify-center">
            {LOADING_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <Icon
                  key={index}
                  className={`w-10 h-10 text-sunset absolute transition-all duration-500 ${
                    index === currentStep
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-75'
                  }`}
                />
              );
            })}
          </div>
        </div>

        <h2 className="text-2xl mb-3">{title}</h2>
        <p className="text-slate mb-8 max-w-sm mx-auto">{subtitle}</p>

        {/* Progress Steps */}
        <div className="space-y-3">
          {LOADING_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;

            return (
              <div
                key={index}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive ? 'bg-sunset/10' : ''
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  isComplete ? 'bg-sunset' : isActive ? 'bg-sunset/30' : 'bg-ink/10'
                }`}>
                  <Icon className={`w-3 h-3 ${
                    isComplete ? 'text-paper' : isActive ? 'text-sunset' : 'text-ink/30'
                  }`} />
                </div>
                <span className={`text-sm transition-colors ${
                  isActive ? 'text-ink' : isComplete ? 'text-sunset' : 'text-ink/40'
                }`}>
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

