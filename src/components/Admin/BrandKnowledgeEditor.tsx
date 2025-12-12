import { useState } from 'react';
import { Card, Button, Input, Textarea } from '../ui';
import { ArrowLeft, Save, FileText } from 'lucide-react';

interface BrandKnowledgeEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
}

export function BrandKnowledgeEditor({
  initialTitle = '',
  initialContent = '',
  onSave,
  onCancel,
}: BrandKnowledgeEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    await onSave(title, content);
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-slate hover:text-ink mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to client
      </button>

      <Card variant="elevated">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-sunset/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-sunset" />
          </div>
          <div>
            <h2 className="text-xl">
              {initialTitle ? 'Edit Brand Document' : 'Add Brand Document'}
            </h2>
            <p className="text-sm text-slate">
              Add context about the client's brand, tone, or style guidelines.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Document Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Brand Voice Guidelines, Tone Examples, Company Background"
          />

          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5">
              Content (Markdown supported)
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`# Brand Voice Guidelines

## Tone
- Professional but approachable
- Conversational without being too casual

## Key Phrases We Use
- "Let's dive in"
- "Here's the thing"

## Words to Avoid
- "Synergy"
- "Leverage"
- "Circle back"

## Writing Examples
Here's an example of our ideal LinkedIn post style:

"Stop overthinking your content strategy.

The best posts aren't perfect—they're real.

Here's what I learned after posting every day for 90 days..."
`}
              rows={20}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={saving}
              disabled={!title.trim() || !content.trim()}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Document
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

