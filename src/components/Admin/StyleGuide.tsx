import { useState } from 'react';
import { Card, Button, Input, Textarea } from '../ui';
import { Toast, ToastContainer } from '../ui/Toast';

const STYLE_GUIDE_VERSION = '1.0.0';
const LAST_UPDATED = '2024-12-18';

export function StyleGuide() {
  const [toastId, setToastId] = useState(0);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string }>>([]);

  const showToast = () => {
    const id = `toast-${toastId}`;
    setToasts([...toasts, { id, message: 'This is a toast notification example' }]);
    setToastId(toastId + 1);
  };

  const dismissToast = (id: string) => {
    setToasts(toasts.filter(t => t.id !== id));
  };

  const colors = [
    { name: 'Ink', value: '#1a1a1a', class: 'bg-ink', description: 'Primary text color' },
    { name: 'Paper', value: '#faf9f7', class: 'bg-paper', description: 'Background color' },
    { name: 'Cream', value: '#f5f3ef', class: 'bg-cream', description: 'Secondary background' },
    { name: 'Sunset', value: '#e57048', class: 'bg-sunset', description: 'Primary accent' },
    { name: 'Sunset Dark', value: '#c85b32', class: 'bg-sunset-dark', description: 'Sunset hover state' },
    { name: 'Terracotta', value: '#c67b5c', class: 'bg-terracotta', description: 'Secondary accent' },
    { name: 'Terracotta Dark', value: '#a85f42', class: 'bg-terracotta-dark', description: 'Terracotta hover state' },
    { name: 'Slate', value: '#5a6169', class: 'bg-slate', description: 'Secondary text' },
    { name: 'Slate Light', value: '#8a9199', class: 'bg-slate-light', description: 'Placeholder text' },
    { name: 'Error', value: '#c65c5c', class: 'bg-error', description: 'Error states' },
    { name: 'Success', value: '#5c9c6b', class: 'bg-success', description: 'Success states' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-display mb-2">Style Guide</h1>
          <p className="text-slate">Single source of truth for styling across the application</p>
        </div>
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-slate">Version:</span>
            <span className="ml-2 font-medium text-ink">{STYLE_GUIDE_VERSION}</span>
          </div>
          <div>
            <span className="text-slate">Last Updated:</span>
            <span className="ml-2 font-medium text-ink">{LAST_UPDATED}</span>
          </div>
        </div>
      </div>

      {/* Colors */}
      <Card variant="bordered">
        <h2 className="text-2xl font-display mb-6">Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colors.map((color) => (
            <div key={color.name} className="space-y-2">
              <div className={`${color.class} h-20 rounded-lg border border-ink/10`} />
              <div>
                <div className="font-medium text-ink">{color.name}</div>
                <div className="text-sm text-slate">{color.value}</div>
                <div className="text-xs text-slate-light mt-1">{color.description}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Typography */}
      <Card variant="bordered">
        <h2 className="text-2xl font-display mb-6">Typography</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-slate mb-3">Headings</h3>
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-display">Heading 1</h1>
                <p className="text-xs text-slate-light mt-1">text-4xl, font-display</p>
              </div>
              <div>
                <h2 className="text-3xl font-display">Heading 2</h2>
                <p className="text-xs text-slate-light mt-1">text-3xl, font-display</p>
              </div>
              <div>
                <h3 className="text-2xl font-display">Heading 3</h3>
                <p className="text-xs text-slate-light mt-1">text-2xl, font-display</p>
              </div>
              <div>
                <h4 className="text-xl font-display">Heading 4</h4>
                <p className="text-xs text-slate-light mt-1">text-xl, font-display</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate mb-3">Body Text</h3>
            <div className="space-y-4">
              <div>
                <p className="text-lg">Large body text - Lorem ipsum dolor sit amet</p>
                <p className="text-xs text-slate-light mt-1">text-lg</p>
              </div>
              <div>
                <p className="text-base">Base body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                <p className="text-xs text-slate-light mt-1">text-base</p>
              </div>
              <div>
                <p className="text-sm">Small body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                <p className="text-xs text-slate-light mt-1">text-sm</p>
              </div>
              <div>
                <p className="text-xs">Extra small text - Lorem ipsum dolor sit amet</p>
                <p className="text-xs text-slate-light mt-1">text-xs</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate mb-3">Text Colors</h3>
            <div className="space-y-2">
              <p className="text-ink">Ink - Primary text color</p>
              <p className="text-slate">Slate - Secondary text color</p>
              <p className="text-slate-light">Slate Light - Placeholder text</p>
              <p className="text-error">Error - Error text color</p>
              <p className="text-success">Success - Success text color</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Buttons */}
      <Card variant="bordered">
        <h2 className="text-2xl font-display mb-6">Buttons</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-medium text-slate mb-4">Variants</h3>
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <Button variant="primary">Primary</Button>
                <p className="text-xs text-slate-light">variant="primary"</p>
              </div>
              <div className="space-y-2">
                <Button variant="secondary">Secondary</Button>
                <p className="text-xs text-slate-light">variant="secondary"</p>
              </div>
              <div className="space-y-2">
                <Button variant="ghost">Ghost</Button>
                <p className="text-xs text-slate-light">variant="ghost"</p>
              </div>
              <div className="space-y-2">
                <Button variant="danger">Danger</Button>
                <p className="text-xs text-slate-light">variant="danger"</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate mb-4">Sizes</h3>
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <Button size="sm">Small</Button>
                <p className="text-xs text-slate-light">size="sm"</p>
              </div>
              <div className="space-y-2">
                <Button size="md">Medium</Button>
                <p className="text-xs text-slate-light">size="md"</p>
              </div>
              <div className="space-y-2">
                <Button size="lg">Large</Button>
                <p className="text-xs text-slate-light">size="lg"</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate mb-4">States</h3>
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <Button>Default</Button>
                <p className="text-xs text-slate-light">Default state</p>
              </div>
              <div className="space-y-2">
                <Button disabled>Disabled</Button>
                <p className="text-xs text-slate-light">disabled</p>
              </div>
              <div className="space-y-2">
                <Button loading>Loading</Button>
                <p className="text-xs text-slate-light">loading</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Cards */}
      <Card variant="bordered">
        <h2 className="text-2xl font-display mb-6">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Card variant="default">
              <h4 className="font-medium mb-2">Default Card</h4>
              <p className="text-sm text-slate">This is a default card variant with no border or shadow.</p>
            </Card>
            <p className="text-xs text-slate-light">variant="default"</p>
          </div>
          <div className="space-y-2">
            <Card variant="elevated">
              <h4 className="font-medium mb-2">Elevated Card</h4>
              <p className="text-sm text-slate">This card has a shadow for elevation.</p>
            </Card>
            <p className="text-xs text-slate-light">variant="elevated"</p>
          </div>
          <div className="space-y-2">
            <Card variant="bordered">
              <h4 className="font-medium mb-2">Bordered Card</h4>
              <p className="text-sm text-slate">This card has a border for definition.</p>
            </Card>
            <p className="text-xs text-slate-light">variant="bordered"</p>
          </div>
        </div>
      </Card>

      {/* Form Inputs */}
      <Card variant="bordered">
        <h2 className="text-2xl font-display mb-6">Form Inputs</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-medium text-slate mb-4">Input</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Input label="Label" placeholder="Placeholder text" />
                <p className="text-xs text-slate-light">With label and placeholder</p>
              </div>
              <div className="space-y-2">
                <Input placeholder="Placeholder only" />
                <p className="text-xs text-slate-light">Placeholder only</p>
              </div>
              <div className="space-y-2">
                <Input label="Error State" error="This field is required" defaultValue="Invalid input" />
                <p className="text-xs text-slate-light">With error message</p>
              </div>
              <div className="space-y-2">
                <Input label="Disabled" disabled defaultValue="Disabled input" />
                <p className="text-xs text-slate-light">Disabled state</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate mb-4">Textarea</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Textarea label="Label" placeholder="Enter your message..." />
                <p className="text-xs text-slate-light">With label and placeholder</p>
              </div>
              <div className="space-y-2">
                <Textarea placeholder="Placeholder only" />
                <p className="text-xs text-slate-light">Placeholder only</p>
              </div>
              <div className="space-y-2">
                <Textarea label="Error State" error="This field is required" defaultValue="Invalid input" />
                <p className="text-xs text-slate-light">With error message</p>
              </div>
              <div className="space-y-2">
                <Textarea label="Disabled" disabled defaultValue="Disabled textarea" />
                <p className="text-xs text-slate-light">Disabled state</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Toast */}
      <Card variant="bordered">
        <h2 className="text-2xl font-display mb-6">Toast Notifications</h2>
        <div className="space-y-4">
          <div>
            <Button onClick={showToast}>Show Toast Example</Button>
            <p className="text-xs text-slate-light mt-2">Click to display a toast notification</p>
          </div>
          <div className="p-4 bg-cream rounded-lg border border-ink/10">
            <p className="text-sm text-slate mb-2">Toast notifications appear in the bottom-right corner of the screen.</p>
            <p className="text-xs text-slate-light">They include a success icon, message, optional action button, and dismiss button.</p>
          </div>
        </div>
      </Card>

      {/* Toast Container */}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
      />
    </div>
  );
}

