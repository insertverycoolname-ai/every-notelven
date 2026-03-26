const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/chat/Sidebar';
import ChatArea from '@/components/chat/ChatArea';
import IntroAnimation from '@/components/chat/IntroAnimation';

import {
  getChats,
  createChat,
  deleteChat,
  addMessage,
  renameChat,
  getAssistantName,
  saveAssistantName,
  hasSeenIntro,
  markIntroSeen,
} from '@/lib/chatStorage';
import { initTheme } from '@/lib/theme';
import { initSavedTheme } from '@/lib/themePresets';

// Mock AI responses — replace with real API call when ready
const MOCK_RESPONSES = [
  "That's a great question! Let me think about that for a moment.\n\nHere's what I'd suggest: start by breaking down the problem into smaller, manageable pieces. This makes it easier to tackle each part methodically.\n\nWould you like me to help you with a specific aspect?",
  "I'd be happy to help with that! Here's my approach:\n\n1. **Start with clarity** — define exactly what you want to achieve\n2. **Prioritize** — focus on what matters most first\n3. **Iterate** — refine as you go\n\nShall we dive deeper into any of these steps?",
  "Interesting thought! Let me share some ideas:\n\nThe key is to balance creativity with structure. Too much freedom can lead to chaos, while too much rigidity stifles innovation.\n\nI'd recommend starting with a loose framework and filling in the details as inspiration strikes. What do you think?",
  "Here's a clean plan for you:\n\n**Week overview:**\n- Monday: Focus on high-priority tasks\n- Tuesday-Wednesday: Deep work sessions\n- Thursday: Meetings and collaboration\n- Friday: Review and plan ahead\n\nWant me to customize this further for your needs?",
  "Great idea! Here's a brand concept framework:\n\n**Core Identity:**\n- **Vision**: What future do you want to create?\n- **Voice**: How should the brand sound?\n- **Values**: What principles guide decisions?\n\n**Visual Direction:**\n- Clean, minimal aesthetics\n- Purposeful use of whitespace\n- Typography-forward design\n\nWant to explore any of these areas further?",
];

function getRandomResponse() {
  return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
}

export default function Chat() {
  const [showIntro, setShowIntro] = useState(!hasSeenIntro());
  // user is null while loading, false if not authenticated, or a user object
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assistantName, setAssistantName] = useState('Eleven');

  // userKey scopes all chat storage to the logged-in account (or 'guest')
  const userKey = user?.email || user?.id || 'guest';

  // Init theme and load user on mount
  useEffect(() => {
    initTheme();
    db.auth.me()
      .then(u => setUser(u))
      .catch(() => setUser(false));
  }, []);

  // Re-init saved preset/image theme when userKey resolves
  useEffect(() => {
    initSavedTheme(userKey);
  }, [userKey]);

  // Load assistant name whenever userKey is known
  useEffect(() => {
    setAssistantName(getAssistantName(userKey));
  }, [userKey]);

  // Load chats whenever userKey changes (login/logout/switch)
  const refreshChats = useCallback(() => {
    setChats(getChats(userKey));
  }, [userKey]);

  useEffect(() => {
    refreshChats();
    setActiveChatId(null);
  }, [userKey, refreshChats]);

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  const handleIntroComplete = () => {
    markIntroSeen();
    setShowIntro(false);
  };

  const handleNewChat = useCallback(() => {
    const chat = createChat(userKey);
    refreshChats();
    setActiveChatId(chat.id);
    setSidebarOpen(false);
  }, [userKey, refreshChats]);

  const handleSelectChat = useCallback((id) => {
    setActiveChatId(id);
    setSidebarOpen(false);
  }, []);

  const handleDeleteChat = useCallback((id) => {
    deleteChat(id, userKey);
    refreshChats();
    if (activeChatId === id) setActiveChatId(null);
  }, [activeChatId, userKey, refreshChats]);

  const handleRenameChat = useCallback((id, newTitle) => {
    renameChat(id, newTitle, userKey);
    refreshChats();
  }, [userKey, refreshChats]);

  const handleRenameAssistant = useCallback((newName) => {
    const trimmed = newName.trim().slice(0, 30);
    if (!trimmed) return;
    saveAssistantName(trimmed, userKey);
    setAssistantName(trimmed);
  }, [userKey]);

  const handleSendMessage = useCallback(async (content, attachments = []) => {
    let chatId = activeChatId;

    if (!chatId) {
      const newChat = createChat(userKey);
      chatId = newChat.id;
      setActiveChatId(chatId);
    }

    addMessage(chatId, 'user', content, userKey, attachments);
    refreshChats();
    setIsTyping(true);

    // INTEGRATION POINT: Replace setTimeout with real AI API call
    // const response = await db.integrations.Core.InvokeLLM({ prompt: content });
    // addMessage(chatId, 'assistant', response, userKey);
    setTimeout(() => {
      addMessage(chatId, 'assistant', getRandomResponse(), userKey);
      refreshChats();
      setIsTyping(false);
    }, 1200 + Math.random() * 1500);
  }, [activeChatId, userKey, refreshChats]);

  const handleSuggestionClick = useCallback((text) => {
    handleSendMessage(text);
  }, [handleSendMessage]);

  if (showIntro) {
    return <IntroAnimation onComplete={handleIntroComplete} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen w-full overflow-hidden bg-background"
    >
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user || null}
      />
      <ChatArea
        chat={activeChat}
        isTyping={isTyping}
        onSend={handleSendMessage}
        onSuggestionClick={handleSuggestionClick}
        onOpenSidebar={() => setSidebarOpen(true)}
        assistantName={assistantName}
        onRenameAssistant={handleRenameAssistant}
        userKey={userKey}
      />
    </motion.div>
  );
}