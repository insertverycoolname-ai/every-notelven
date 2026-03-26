import React, { useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import WelcomeState from './WelcomeState';
import InputBar from './InputBar';
import ThemePicker from './ThemePicker';

export default function ChatArea({ chat, isTyping, onSend, onSuggestionClick, onOpenSidebar, assistantName, onRenameAssistant, userKey }) {
  const scrollRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat?.messages?.length, isTyping]);

  const hasMessages = chat && chat.messages && chat.messages.length > 0;

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* Top bar — mobile menu on left, theme toggle on right (always visible) */}
      <div className="shrink-0 flex items-center justify-between px-4 h-12 border-b border-border/20">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-1.5 rounded-lg hover:bg-accent transition-colors"
        >
          <Menu className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="hidden md:block" /> {/* spacer on desktop */}
        <ThemePicker userKey={userKey} />
      </div>

      {/* Messages or Welcome */}
      <div className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          <WelcomeState onSuggestionClick={onSuggestionClick} assistantName={assistantName} onRenameAssistant={onRenameAssistant} />
        ) : (
          <div className="max-w-3xl mx-auto py-6 space-y-5">
            <AnimatePresence mode="popLayout">
              {chat.messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} assistantName={assistantName} />
              ))}
              {isTyping && <TypingIndicator key="typing" assistantName={assistantName} />}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0">
        <InputBar onSend={onSend} isLoading={isTyping} />
      </div>
    </div>
  );
}