import { useState } from 'react';
import { Button, Input, Textarea, Card } from '../ui';
import { BASE_QUESTIONS, type BaseAnswers } from '../../lib/types';
import { ChevronRight, PenLine } from 'lucide-react';

interface BaseQuestionsProps {
  onSubmit: (answers: BaseAnswers) => void;
  loading?: boolean;
  initialAnswers?: Partial<BaseAnswers>;
}

export function BaseQuestions({ onSubmit, loading, initialAnswers }: BaseQuestionsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<BaseAnswers>>(initialAnswers || {});
  const [errors, setErrors] = useState<Partial<Record<keyof BaseAnswers, string>>>({});

  const currentQuestion = BASE_QUESTIONS[currentStep];
  const isLastQuestion = currentStep === BASE_QUESTIONS.length - 1;
  const progress = ((currentStep + 1) / BASE_QUESTIONS.length) * 100;

  const validateCurrentAnswer = () => {
    const value = answers[currentQuestion.id];
    if (!value || value.trim() === '') {
      setErrors({ ...errors, [currentQuestion.id]: 'This field is required' });
      return false;
    }
    setErrors({ ...errors, [currentQuestion.id]: undefined });
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentAnswer()) return;

    if (isLastQuestion) {
      onSubmit(answers as BaseAnswers);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !currentQuestion.multiline) {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate mb-2">
          <span>Question {currentStep + 1} of {BASE_QUESTIONS.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1.5 bg-ink/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-sunset transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card variant="elevated" className="mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-sunset/10 flex items-center justify-center flex-shrink-0">
            <PenLine className="w-5 h-5 text-sunset" />
          </div>
          <h2 className="text-xl leading-relaxed pt-1.5">
            {currentQuestion.question}
          </h2>
        </div>

        {currentQuestion.multiline ? (
          <Textarea
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
            placeholder={currentQuestion.placeholder}
            error={errors[currentQuestion.id]}
            rows={6}
            autoFocus
          />
        ) : (
          <Input
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
            placeholder={currentQuestion.placeholder}
            error={errors[currentQuestion.id]}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        )}
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
        >
          {isLastQuestion ? 'Analyze My Style' : 'Continue'}
          {!isLastQuestion && <ChevronRight className="w-4 h-4 ml-1" />}
        </Button>
      </div>

      {/* Question indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {BASE_QUESTIONS.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (index < currentStep || answers[BASE_QUESTIONS[index].id]) {
                setCurrentStep(index);
              }
            }}
            disabled={index > currentStep && !answers[BASE_QUESTIONS[index].id]}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentStep
                ? 'bg-sunset w-6'
                : index < currentStep || answers[BASE_QUESTIONS[index].id]
                ? 'bg-sunset/50 hover:bg-sunset/70'
                : 'bg-ink/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

