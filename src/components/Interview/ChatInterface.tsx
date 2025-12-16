import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '../ui';
import { ChatMessage } from './ChatMessage';
import type { LocalChatMessage } from '../../lib/types';

interface ChatInterfaceProps {
  messages: LocalChatMessage[];
  isStreaming: boolean;
  isSynthesizing: boolean;
  clientName: string;
  onSendMessage: (content: string) => void;
  error?: string | null;
  onSynthesize?: () => void;
  canSynthesize?: boolean;
}

export function ChatInterface({
  messages,
  isStreaming,
  isSynthesizing,
  clientName,
  onSendMessage,
  error,
  onSynthesize,
  canSynthesize,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!inputValue.trim() || isStreaming || isSynthesizing) return;
    
    onSendMessage(inputValue.trim());
    setInputValue('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Auto-resize
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[700px]">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && !isStreaming && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-sunset" />
              <p>Starting your Category of One conversation...</p>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            clientName={clientName}
          />
        ))}

        {/* Synthesizing indicator */}
        {isSynthesizing && (
          <div className="flex items-center justify-center py-8">
            <div className="bg-white border border-ink/10 rounded-2xl px-6 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-sunset" />
                <div>
                  <p className="font-medium text-ink">Creating your Category of One profile...</p>
                  <p className="text-sm text-slate">This will just take a moment</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-ink/10 bg-white px-4 py-4">
        {onSynthesize && (
          <div className="flex justify-end mb-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={!canSynthesize || isStreaming || isSynthesizing}
              onClick={onSynthesize}
            >
              Generate Category of One profile
            </Button>
          </div>
        )}
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={
                isSynthesizing 
                  ? "Creating your profile..." 
                  : isStreaming 
                    ? "Waiting for response..." 
                    : "Type your message..."
              }
              disabled={isStreaming || isSynthesizing}
              rows={1}
              className="w-full resize-none rounded-xl border border-ink/20 bg-cream/50 px-4 py-3 pr-12 
                         text-ink placeholder:text-slate/50 
                         focus:outline-none focus:ring-2 focus:ring-sunset/30 focus:border-sunset
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
              style={{ minHeight: '48px', maxHeight: '200px' }}
            />
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isStreaming || isSynthesizing}
            className="flex-shrink-0 h-12 w-12 !p-0 rounded-xl"
          >
            {isStreaming ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        
        <p className="text-xs text-slate mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

