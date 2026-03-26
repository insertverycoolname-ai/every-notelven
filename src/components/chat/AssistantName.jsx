import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

/**
 * Displays the assistant name. Double-click to rename inline.
 * Props:
 *   name        — current assistant name string
 *   onRename    — callback(newName: string) called on confirmed save
 *   className   — optional extra classes for the displayed name span
 */
export default function AssistantName({ name, onRename, className = '' }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  const startEdit = () => {
    setDraft(name);
    setEditing(true);
  };

  useEffect(() => {
    if (editing) {
      // small timeout so the element is mounted before focusing
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 30);
    }
  }, [editing]);

  const commit = () => {
    const trimmed = draft.trim().slice(0, 30);
    if (trimmed) onRename(trimmed);
    setEditing(false);
  };

  const cancel = () => setEditing(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); commit(); }
    if (e.key === 'Escape') cancel();
  };

  return (
    <AnimatePresence mode="wait">
      {editing ? (
        <motion.span
          key="editing"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="inline-flex items-center gap-1.5"
          onClick={e => e.stopPropagation()}
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commit}
            maxLength={30}
            className="bg-transparent border-b border-primary/40 focus:border-primary outline-none text-foreground font-light tracking-tight w-32 pb-0.5"
            style={{ fontSize: 'inherit', lineHeight: 'inherit', letterSpacing: 'inherit' }}
          />
          <button
            onMouseDown={e => { e.preventDefault(); commit(); }}
            className="text-muted-foreground/60 hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            onMouseDown={e => { e.preventDefault(); cancel(); }}
            className="text-muted-foreground/40 hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.span>
      ) : (
        <motion.span
          key="display"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onDoubleClick={startEdit}
          title="Double-click to rename"
          className={`cursor-default select-none ${className}`}
        >
          {name}
        </motion.span>
      )}
    </AnimatePresence>
  );
}