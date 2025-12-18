import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { LocalChatMessage } from '../../lib/types';

interface ChatMessageProps {
  message: LocalChatMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  // Remove the [SYNTHESIS_READY] marker from displayed content
  const displayContent = message.content.replace('[SYNTHESIS_READY]', '').trim();

  return (
    <div
      className={`flex gap-3 sm:gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end animate-message-enter`}
    >
      {/* Avatar */}
      <div 
        className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-sm ${
          isUser 
            ? 'bg-sunset/15 text-sunset' 
            : 'bg-ink/5 text-ink'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5" />
        ) : (
          <Bot className="w-5 h-5" />
        )}
      </div>

      {/* Message Bubble */}
      <div 
        className={`max-w-[78%] sm:max-w-[70%] px-4 py-3 sm:px-5 sm:py-4 shadow-soft-message ${
          isUser
            ? 'bg-sunset text-white rounded-3xl rounded-br-md'
            : 'bg-white/95 border border-[#E5E5E5] rounded-3xl rounded-bl-md'
        }`}
      >
        {/* Message content */}
        {isUser ? (
          <div
            className="text-sm leading-relaxed whitespace-pre-wrap text-white font-medium"
          >
            {displayContent}
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse rounded-sm" />
            )}
          </div>
        ) : (
          <div className="text-sm leading-relaxed text-ink markdown-body">
            <ReactMarkdown
              // Disallow raw HTML for safety; we only need markdown formatting
              skipHtml
              components={{
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0 whitespace-pre-wrap">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 space-y-1 mb-2 last:mb-0">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 space-y-1 mb-2 last:mb-0">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="whitespace-normal">{children}</li>,
                h1: ({ children }) => (
                  <h1 className="text-lg font-semibold mb-2">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-semibold mb-2 mt-2">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-semibold mb-1 mt-2">{children}</h3>
                ),
              }}
            >
              {displayContent}
            </ReactMarkdown>
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse rounded-sm" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

