import { Target } from 'lucide-react';
import type { ReadinessAssessment } from '../../lib/types';
import { READINESS_STAGES } from '../../lib/types';

interface InterviewProgressProps {
  readiness: ReadinessAssessment;
  isStreaming?: boolean;
}

export function InterviewProgress({ readiness, isStreaming }: InterviewProgressProps) {
  const currentSegmentIndex = READINESS_STAGES.findIndex(
    (s, i, arr) =>
      readiness.readiness >= s.threshold &&
      (i === arr.length - 1 || readiness.readiness < arr[i + 1].threshold)
  );

  // Ensure we always have a valid index
  const safeIndex = currentSegmentIndex >= 0 ? currentSegmentIndex : 0;

  return (
    <div className="flex items-center justify-center gap-3 px-4 py-2">
      {/* Icon and Label */}
      <div className="flex items-center gap-2 text-slate">
        <Target className="w-4 h-4" />
        <span className="text-xs font-medium">Profile Readiness</span>
      </div>

      {/* Segmented Progress Bar */}
      <div className="flex gap-1 w-64">
        {READINESS_STAGES.map((segment, index) => {
          const isFilled = index <= safeIndex;
          const isActive = index === safeIndex;

          return (
            <div
              key={segment.stage}
              className={`
                h-2 flex-1 rounded-full transition-all duration-500 ease-out
                ${isFilled
                  ? isActive && isStreaming
                    ? 'bg-sunset/50 animate-pulse'
                    : 'bg-sunset'
                  : 'bg-ink/10'
                }
              `}
              title={segment.label}
            />
          );
        })}
      </div>

      {/* Current Stage Label */}
      <span className="text-xs text-slate whitespace-nowrap">
        {READINESS_STAGES[safeIndex]?.label || 'Just Starting'}
      </span>
    </div>
  );
}
