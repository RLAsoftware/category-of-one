import { useNavigate } from 'react-router-dom';
import { Clock, MessageSquare, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui';
import type { InterviewSession } from '../../lib/types';

interface SessionListProps {
  sessions: InterviewSession[];
  onDelete: (sessionId: string) => void;
}

export function SessionList({ sessions, onDelete }: SessionListProps) {
  const navigate = useNavigate();

  if (sessions.length === 0) {
    return null;
  }

  const handleSessionClick = (session: InterviewSession) => {
    if (session.status === 'completed') {
      // View profile
      navigate(`/interview/${session.id}`);
    } else {
      // Resume interview
      navigate(`/interview/${session.id}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <div className="space-y-3">
      {sessions.map((session) => {
        const isCompleted = session.status === 'completed';
        
        return (
          <div
            key={session.id}
            className="bg-white rounded-xl p-4 border border-ink/5 hover:border-sunset/20 transition-all hover:shadow-soft-message cursor-pointer group"
            onClick={() => handleSessionClick(session)}
          >
            <div className="flex items-start gap-4">
              {/* Status Icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isCompleted 
                  ? 'bg-green-100' 
                  : 'bg-sunset/10'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <MessageSquare className="w-5 h-5 text-sunset" />
                )}
              </div>

              {/* Session Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-medium text-ink truncate">
                    {session.title || 'Untitled Interview'}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                    isCompleted
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate/10 text-slate'
                  }`}>
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-slate">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDate(session.last_message_at || session.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4 text-slate hover:text-red-500" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

