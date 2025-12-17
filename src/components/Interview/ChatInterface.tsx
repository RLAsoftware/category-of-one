import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import type { LocalChatMessage } from '../../lib/types';

interface ChatInterfaceProps {
  messages: LocalChatMessage[];
  isStreaming: boolean;
  isSynthesizing: boolean;
  onSendMessage: (content: string) => void;
  error?: string | null;
}

export function ChatInterface({
  messages,
  isStreaming,
  isSynthesizing,
  onSendMessage,
  error,
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
    
    // Auto-resize - grow naturally up to max height
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-180px)] pb-32">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
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

          {/* Typing indicator spacer */}
          {isStreaming && !isSynthesizing && (
            <div className="flex items-center gap-2 text-slate text-xs">
              <div className="flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 shadow-soft-message border border-white/60">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Flush with bottom */}
      <div className="fixed bottom-0 left-0 right-0 px-4 z-10">
        <div className="max-w-3xl mx-auto">
          {/* Soft background backdrop */}
          <div className="bg-cream/80 backdrop-blur-sm rounded-2xl px-4 py-3 -mx-4">
            <div className="relative">
              <div className="flex items-end">
                <div className="flex-1">
                  <div className="flex items-center gap-3 bg-white rounded-full shadow-soft-input px-6 py-3">
                    <textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={handleTextareaChange}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        isSynthesizing
                          ? 'Creating your profile...'
                          : isStreaming
                          ? 'Waiting for response...'
                          : 'Type your message...'
                      }
                      disabled={isStreaming || isSynthesizing}
                      rows={1}
                      className="w-full resize-none bg-transparent border-none outline-none text-ink placeholder:text-slate/60 text-sm leading-relaxed py-1 overflow-hidden"
                      style={{ minHeight: '40px', maxHeight: '200px' }}
                    />

                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!inputValue.trim() || isStreaming || isSynthesizing}
                      className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-tr from-sunset to-amber-400 text-white shadow-soft-input disabled:opacity-50 disabled:cursor-not-allowed transition-transform duration-150 hover:translate-y-0.5"
                    >
                      {isStreaming ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate mt-2 text-center">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

