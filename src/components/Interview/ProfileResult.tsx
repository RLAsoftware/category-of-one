import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, Button } from '../ui';
import { Copy, Check, RefreshCw, Download, Sparkles } from 'lucide-react';

interface ProfileResultProps {
  profile: string;
  onReset?: () => void;
}

export function ProfileResult({ profile, onReset }: ProfileResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(profile);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([profile], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'style-profile.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-success" />
        </div>
        <h1 className="text-3xl mb-3">Your Style Profile is Ready</h1>
        <p className="text-slate max-w-md mx-auto">
          Copy this profile and paste it into ChatGPT whenever you need content created in your unique voice.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-3 mb-6">
        <Button
          onClick={handleCopy}
          size="lg"
          className={copied ? 'bg-success hover:bg-success' : ''}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </>
          )}
        </Button>
        <Button
          variant="secondary"
          onClick={handleDownload}
          size="lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      {/* Profile Content */}
      <Card variant="bordered" className="mb-6">
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-2xl font-display mb-4 text-ink">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-display mt-8 mb-3 text-ink border-b border-ink/10 pb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-medium mt-6 mb-2 text-ink">{children}</h3>,
              p: ({ children }) => <p className="text-slate mb-4 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside space-y-1 text-slate mb-4">{children}</ul>,
              li: ({ children }) => <li className="text-slate">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
              em: ({ children }) => <em className="text-terracotta">{children}</em>,
            }}
          >
            {profile}
          </ReactMarkdown>
        </div>
      </Card>

      {/* Footer Actions */}
      {onReset && (
        <div className="text-center">
          <Button variant="ghost" onClick={onReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Start New Interview
          </Button>
        </div>
      )}
    </div>
  );
}

