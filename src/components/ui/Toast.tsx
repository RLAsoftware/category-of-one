import { X, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

interface ToastProps {
  id: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss: (id: string) => void;
}

export function Toast({ id, message, action, onDismiss }: ToastProps) {
  return (
    <div className="bg-ink text-white rounded-xl shadow-2xl p-4 min-w-[300px] max-w-md animate-slide-in-bottom">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
        <p className="text-sm flex-1">{message}</p>
        {action && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              action.onClick();
              onDismiss(id);
            }}
            className="text-white hover:bg-white/10 flex-shrink-0"
          >
            {action.label}
          </Button>
        )}
        <button
          onClick={() => onDismiss(id)}
          className="text-white/60 hover:text-white transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  }>;
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          action={toast.action}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}

