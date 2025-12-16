import { User, Bot } from 'lucide-react';
import type { LocalChatMessage } from '../../lib/types';

interface ChatMessageProps {
  message: LocalChatMessage;
  clientName: string;
}

export function ChatMessage({ message, clientName }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  // Remove the [SYNTHESIS_READY] marker from displayed content
  const displayContent = message.content.replace('[SYNTHESIS_READY]', '').trim();

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div 
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-sunset/20 text-sunset' 
            : 'bg-ink/10 text-ink'
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
        className={`max-w-[75%] ${
          isUser 
            ? 'bg-sunset text-white rounded-2xl rounded-tr-sm' 
            : 'bg-white border border-ink/10 rounded-2xl rounded-tl-sm shadow-sm'
        } px-4 py-3`}
      >
        {/* Sender name */}
        <div className={`text-xs font-medium mb-1 ${
          isUser ? 'text-white/70' : 'text-slate'
        }`}>
          {isUser ? clientName : 'Category of One'}
        </div>

        {/* Message content */}
        <div className={`text-sm leading-relaxed whitespace-pre-wrap ${
          isUser ? 'text-white' : 'text-ink'
        }`}>
          {displayContent}
          {message.isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse rounded-sm" />
          )}
        </div>
      </div>
    </div>
  );
}

