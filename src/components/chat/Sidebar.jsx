import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Trash2, X, Settings, Pencil, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { isToday, isYesterday } from 'date-fns';
import SettingsPanel from './SettingsPanel';

function groupChatsByDate(chats) {
  const groups = { today: [], yesterday: [], older: [] };
  chats.forEach(chat => {
    const d = new Date(chat.updatedAt);
    if (isToday(d)) groups.today.push(chat);
    else if (isYesterday(d)) groups.yesterday.push(chat);
    else groups.older.push(chat);
  });
  return groups;
}

function ChatItem({ chat, isActive, onSelectChat, onDeleteChat, onRenameChat }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  const startEditing = (e) => {
    e.stopPropagation();
    setDraft(chat.title);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commitRename = () => {
    if (draft.trim()) onRenameChat(chat.id, draft.trim());
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); commitRename(); }
    if (e.key === 'Escape') setEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="group relative"
    >
      {editing ? (
        <div className="flex items-center gap-1 px-2 py-1.5">
          <input
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commitRename}
            className="flex-1 text-sm bg-background border border-border/60 rounded-lg px-2 py-1 focus:outline-none focus:border-primary/40 text-foreground"
          />
          <button
            onMouseDown={(e) => { e.preventDefault(); commitRename(); }}
            className="p-1 rounded-md hover:bg-accent transition-colors"
          >
            <Check className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={() => onSelectChat(chat.id)}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-2.5 pr-16 ${
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-50" />
            <span className="truncate flex-1">{chat.title}</span>
          </button>
          {/* Rename & delete buttons revealed on hover */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={startEditing}
              className="p-1 rounded-md hover:bg-accent transition-colors"
            >
              <Pencil className="w-3 h-3 text-muted-foreground" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
              className="p-1 rounded-md hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}

function ChatGroup({ label, chats, activeChatId, onSelectChat, onDeleteChat, onRenameChat }) {
  if (chats.length === 0) return null;
  return (
    <div className="mb-4">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium px-3 mb-1.5">
        {label}
      </p>
      {chats.map(chat => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isActive={activeChatId === chat.id}
          onSelectChat={onSelectChat}
          onDeleteChat={onDeleteChat}
          onRenameChat={onRenameChat}
        />
      ))}
    </div>
  );
}

export default function Sidebar({ chats, activeChatId, onNewChat, onSelectChat, onDeleteChat, onRenameChat, isOpen, onClose, user }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const groups = groupChatsByDate(chats);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed md:relative z-50 md:z-auto h-full w-72 bg-card/80 backdrop-blur-xl border-r border-border/50 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium tracking-wide">everyeleven</span>
          </div>
          <button onClick={onClose} className="md:hidden p-1 rounded-md hover:bg-accent">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-3 mb-3">
          <Button
            onClick={onNewChat}
            variant="outline"
            className="w-full justify-start gap-2 rounded-xl border-border/60 bg-background/50 hover:bg-accent text-sm font-normal h-10"
          >
            <Plus className="w-4 h-4" />
            New conversation
          </Button>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1 px-1">
          <div className="px-1 py-1">
            <AnimatePresence mode="popLayout">
              <ChatGroup label="Today" chats={groups.today} activeChatId={activeChatId} onSelectChat={onSelectChat} onDeleteChat={onDeleteChat} onRenameChat={onRenameChat} />
              <ChatGroup label="Yesterday" chats={groups.yesterday} activeChatId={activeChatId} onSelectChat={onSelectChat} onDeleteChat={onDeleteChat} onRenameChat={onRenameChat} />
              <ChatGroup label="Previous" chats={groups.older} activeChatId={activeChatId} onSelectChat={onSelectChat} onDeleteChat={onDeleteChat} onRenameChat={onRenameChat} />
            </AnimatePresence>

            {chats.length === 0 && (
              <div className="text-center py-12 px-4">
                <p className="text-xs text-muted-foreground/50">No conversations yet</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="relative p-3 border-t border-border/30">
          <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} user={user} />
          <button
            onClick={() => setSettingsOpen(v => !v)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
              settingsOpen
                ? 'bg-accent text-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Settings
          </button>
        </div>
      </motion.aside>
    </>
  );
}