import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui';

interface DeleteSessionModalProps {
  isOpen: boolean;
  sessionTitle: string;
  sessionDate: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteSessionModal({
  isOpen,
  sessionTitle,
  sessionDate,
  onConfirm,
  onCancel,
}: DeleteSessionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-ink mb-1">Delete Interview Session?</h2>
            <p className="text-sm text-slate">
              This will move the session to Recently Deleted where it can be recovered for 30 days.
            </p>
          </div>
        </div>

        <div className="bg-slate/5 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-ink mb-1">{sessionTitle}</p>
          <p className="text-xs text-slate">{sessionDate}</p>
        </div>

        <div className="flex gap-3 justify-end">
          <Button onClick={onCancel} variant="ghost">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="secondary" className="bg-red-500 hover:bg-red-600 text-white">
            Delete Session
          </Button>
        </div>
      </div>
    </div>
  );
}

