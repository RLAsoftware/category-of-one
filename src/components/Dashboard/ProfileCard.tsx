import { useNavigate } from 'react-router-dom';
import { ArrowRight, Target } from 'lucide-react';
import { Button, Card } from '../ui';
import type { CategoryOfOneProfile } from '../../lib/types';

interface ProfileCardProps {
  profile: CategoryOfOneProfile;
  sessionId: string;
}

export function ProfileCard({ profile, sessionId }: ProfileCardProps) {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/interview/${sessionId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card variant="elevated" className="bg-gradient-to-br from-sunset/5 to-amber-50 border-sunset/20">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-sunset/20 flex items-center justify-center flex-shrink-0">
          <Target className="w-6 h-6 text-sunset" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="text-lg font-semibold text-ink mb-1">Latest Category of One Profile</h3>
              <p className="text-sm text-slate">
                Created {formatDate(profile.created_at)}
              </p>
            </div>
          </div>
          
          {profile.positioning_statement && (
            <p className="text-ink leading-relaxed mb-4 line-clamp-3">
              {typeof profile.positioning_statement === 'string' 
                ? profile.positioning_statement 
                : profile.positioning_statement.full_statement}
            </p>
          )}
          
          <Button
            onClick={handleViewProfile}
            variant="primary"
            size="sm"
            className="gap-2"
          >
            View Full Profile
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

