// Chat storage — scoped per user account.
// When a real backend is added, replace these functions with API calls.
// The userKey parameter namespaces storage so each account has separate history.

const INTRO_KEY = 'everyeleven_intro_seen';

function storageKey(userKey) {
  // userKey is the user's email or id. Falls back to 'guest' if not provided.
  return `everyeleven_chats_${userKey || 'guest'}`;
}

export function getChats(userKey) {
  const raw = localStorage.getItem(storageKey(userKey));
  if (!raw) return [];
  return JSON.parse(raw);
}

export function saveChats(chats, userKey) {
  localStorage.setItem(storageKey(userKey), JSON.stringify(chats));
}

export function createChat(userKey, title = 'New conversation') {
  const chats = getChats(userKey);
  const newChat = {
    id: Date.now().toString(),
    title,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  chats.unshift(newChat);
  saveChats(chats, userKey);
  return newChat;
}

export function updateChat(chatId, updates, userKey) {
  const chats = getChats(userKey);
  const index = chats.findIndex(c => c.id === chatId);
  if (index !== -1) {
    chats[index] = { ...chats[index], ...updates, updatedAt: new Date().toISOString() };
    saveChats(chats, userKey);
    return chats[index];
  }
  return null;
}

export function deleteChat(chatId, userKey) {
  const chats = getChats(userKey).filter(c => c.id !== chatId);
  saveChats(chats, userKey);
  return chats;
}

export function addMessage(chatId, role, content, userKey, attachments = []) {
  const chats = getChats(userKey);
  const chat = chats.find(c => c.id === chatId);
  if (!chat) return null;

  const message = {
    id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
    role,
    content,
    attachments,
    timestamp: new Date().toISOString(),
  };

  chat.messages.push(message);

  // Auto-title from first user message
  if (role === 'user' && chat.messages.filter(m => m.role === 'user').length === 1) {
    chat.title = content.slice(0, 40) + (content.length > 40 ? '...' : '');
  }

  chat.updatedAt = new Date().toISOString();
  saveChats(chats, userKey);
  return message;
}

export function renameChat(chatId, newTitle, userKey) {
  const chats = getChats(userKey);
  const chat = chats.find(c => c.id === chatId);
  if (!chat) return;
  chat.title = newTitle.trim() || 'Untitled';
  saveChats(chats, userKey);
}

// Assistant name — persisted per user account
const ASSISTANT_NAME_KEY_PREFIX = 'everyeleven_assistant_name_';

function assistantNameKey(userKey) {
  return `${ASSISTANT_NAME_KEY_PREFIX}${userKey || 'guest'}`;
}

export function getAssistantName(userKey) {
  return localStorage.getItem(assistantNameKey(userKey)) || 'Eleven';
}

export function saveAssistantName(name, userKey) {
  const trimmed = name.trim().slice(0, 30);
  if (!trimmed) return;
  localStorage.setItem(assistantNameKey(userKey), trimmed);
}

export function hasSeenIntro() {
  return localStorage.getItem(INTRO_KEY) === 'true';
}

export function markIntroSeen() {
  localStorage.setItem(INTRO_KEY, 'true');
}