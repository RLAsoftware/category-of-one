import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Send, Loader2, AlertTriangle, Sparkles } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import type { LocalChatMessage, UserRole } from '../../lib/types';

interface ChatInterfaceProps {
  messages: LocalChatMessage[];
  isStreaming: boolean;
  isSynthesizing: boolean;
  onSendMessage: (content: string) => void;
  onStartFromScratch?: () => void;
  onForceSynthesis?: () => void;
  error?: string | null;
  messageCount?: number;
  isNearTurnLimit?: boolean;
  isAtTurnLimit?: boolean;
  userRole?: UserRole | null;
  sessionStatus?: string;
}

export function ChatInterface({
  messages,
  isStreaming,
  isSynthesizing,
  onSendMessage,
  onStartFromScratch,
  onForceSynthesis,
  error,
  messageCount = 0,
  isNearTurnLimit = false,
  isAtTurnLimit = false,
  userRole = null,
  sessionStatus = 'chatting',
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const [showForceSynthesisConfirm, setShowForceSynthesisConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isAdmin = userRole === 'admin';
  const canForceSynthesis = isAdmin && sessionStatus === 'chatting' && messages.length >= 5;
  const hasStreamingMessage = messages.some((m) => (m as any).isStreaming);
  const isActuallyStreaming = isStreaming && hasStreamingMessage;

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a604c763-55bb-413d-8173-49062a81e738', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'debug-session',
      runId: 'pre-fix-1',
      hypothesisId: 'E',
      location: 'src/components/Interview/ChatInterface.tsx:component',
      message: 'ChatInterface render',
      data: { messagesLength: messages.length, isStreaming, isSynthesizing, sessionStatus },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion agent log

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!inputValue.trim() || isActuallyStreaming || isSynthesizing) return;
    
    onSendMessage(inputValue.trim());
    setInputValue('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Allow all system shortcuts (CMD/CTRL + any key)
    if (e.metaKey || e.ctrlKey) {
      return;
    }
    
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

        {/* Turn limit warnings */}
        {isAtTurnLimit && !isSynthesizing && (
          <div className="flex items-center justify-center py-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 shadow-sm max-w-2xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-900">Turn limit reached ({messageCount} messages)</p>
                  <p className="text-sm text-amber-700 mt-1">
                    This conversation has reached the maximum recommended length. Consider generating the profile or starting a new session.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isNearTurnLimit && !isAtTurnLimit && !isSynthesizing && (
          <div className="flex items-center justify-center py-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-6 py-4 shadow-sm max-w-2xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Approaching turn limit ({messageCount}/100 messages)</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Consider wrapping up soon to generate the profile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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
          {isActuallyStreaming && !isSynthesizing && (
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
                  <div className="flex items-end gap-3 bg-white rounded-3xl shadow-soft-input px-6 py-3">
                    <textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={handleTextareaChange}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        isSynthesizing
                          ? 'Creating your profile...'
                          : isActuallyStreaming
                          ? 'Waiting for response...'
                          : 'Type your message...'
                      }
                      disabled={isActuallyStreaming || isSynthesizing}
                      rows={1}
                      className="w-full resize-none bg-transparent border-none outline-none text-ink placeholder:text-slate/60 text-base leading-relaxed py-2 overflow-hidden"
                      style={{ minHeight: '24px', maxHeight: '200px' }}
                    />

                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!inputValue.trim() || isActuallyStreaming || isSynthesizing}
                      className="inline-flex items-center justify-center h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-tr from-sunset to-amber-400 text-white shadow-soft-input disabled:opacity-50 disabled:cursor-not-allowed transition-transform duration-150 hover:translate-y-0.5"
                    >
                      {isActuallyStreaming ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate mt-2">
                <span>Press Enter to send, Shift+Enter for new line</span>
                {canForceSynthesis && onForceSynthesis && (
                  <>
                    <span>•</span>
                    {showForceSynthesisConfirm ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onForceSynthesis();
                            setShowForceSynthesisConfirm(false);
                          }}
                          className="text-sunset hover:text-sunset-dark underline transition-colors font-medium"
                        >
                          Confirm generate profile
                        </button>
                        <button
                          onClick={() => setShowForceSynthesisConfirm(false)}
                          className="text-slate hover:text-ink underline transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowForceSynthesisConfirm(true)}
                        className="text-sunset hover:text-sunset-dark underline transition-colors inline-flex items-center gap-1"
                        title="Admin: Force generate profile now"
                      >
                        <Sparkles className="w-3 h-3" />
                        Force synthesis
                      </button>
                    )}
                  </>
                )}
                {onStartFromScratch && messages.length > 0 && (
                  <>
                    <span>•</span>
                    <button
                      onClick={onStartFromScratch}
                      className="text-sunset hover:text-sunset-dark underline transition-colors"
                    >
                      Start from scratch
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

