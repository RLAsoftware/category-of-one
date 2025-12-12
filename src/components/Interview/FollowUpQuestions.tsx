import { useState } from 'react';
import { Button, Textarea, Card } from '../ui';
import { MessageSquare, ChevronRight, Check } from 'lucide-react';

interface FollowUpQuestionsProps {
  questions: string[];
  onSubmit: (answers: Record<string, string>) => void;
  loading?: boolean;
}

export function FollowUpQuestions({ questions, onSubmit, loading }: FollowUpQuestionsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;
  const progress = ((currentStep + 1) / questions.length) * 100;

  const validateCurrentAnswer = () => {
    const value = answers[`q${currentStep}`];
    if (!value || value.trim() === '') {
      setErrors({ ...errors, [`q${currentStep}`]: 'Please provide an answer' });
      return false;
    }
    setErrors({ ...errors, [`q${currentStep}`]: '' });
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentAnswer()) return;

    if (isLastQuestion) {
      onSubmit(answers);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-sm mb-4">
          <MessageSquare className="w-4 h-4" />
          AI-Generated Questions
        </div>
        <h1 className="text-3xl mb-2">Let's dig deeper</h1>
        <p className="text-slate">
          Based on your responses, we have a few follow-up questions to better understand your voice.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate mb-2">
          <span>Follow-up {currentStep + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1.5 bg-ink/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-terracotta transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card variant="elevated" className="mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center flex-shrink-0">
            <span className="text-terracotta font-medium">{currentStep + 1}</span>
          </div>
          <h2 className="question-heading text-xl leading-relaxed pt-1.5">
            {currentQuestion}
          </h2>
        </div>

        <Textarea
          value={answers[`q${currentStep}`] || ''}
          onChange={(e) => setAnswers({ ...answers, [`q${currentStep}`]: e.target.value })}
          placeholder="Share your thoughts..."
          error={errors[`q${currentStep}`]}
          rows={5}
          autoFocus
        />
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        
        <Button
          onClick={handleNext}
          loading={loading}
          disabled={loading}
          className={isLastQuestion ? 'bg-terracotta hover:bg-terracotta-dark' : ''}
        >
          {isLastQuestion ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Generate My Profile
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>

      {/* Question indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (index < currentStep || answers[`q${index}`]) {
                setCurrentStep(index);
              }
            }}
            disabled={index > currentStep && !answers[`q${index}`]}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentStep
                ? 'bg-terracotta w-6'
                : index < currentStep || answers[`q${index}`]
                ? 'bg-terracotta/50 hover:bg-terracotta/70'
                : 'bg-ink/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

