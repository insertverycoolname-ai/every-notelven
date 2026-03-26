const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Paperclip, Mic, Sparkles } from 'lucide-react';

import AttachmentPreview from './AttachmentPreview';
import VoiceRecorder from './VoiceRecorder';

const ACCEPTED = 'image/png,image/jpg,image/jpeg,image/webp,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export default function InputBar({ onSend, isLoading }) {
  const [value, setValue] = useState('');
  const [attachments, setAttachments] = useState([]); // { id, file, localUrl, name, type, size, isImage }
  const [isUploading, setIsUploading] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [value]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newAtts = files.map(file => ({
      id: Math.random().toString(36).slice(2),
      file,
      localUrl: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      size: file.size,
      isImage: file.type.startsWith('image/'),
    }));
    setAttachments(prev => [...prev, ...newAtts]);
    e.target.value = '';
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if ((!trimmed && !attachments.length) || isLoading || isUploading) return;

    let uploadedAttachments = [];
    if (attachments.length) {
      setIsUploading(true);
      uploadedAttachments = await Promise.all(
        attachments.map(async (att) => {
          const { file_url } = await db.integrations.Core.UploadFile({ file: att.file });
          return { url: file_url, name: att.name, type: att.type, size: att.size, isImage: att.isImage };
        })
      );
      setIsUploading(false);
    }

    onSend(trimmed, uploadedAttachments);
    setValue('');
    setAttachments([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleEnhance = async () => {
    const trimmed = value.trim();
    if (!trimmed || isEnhancing) return;
    setIsEnhancing(true);
    const result = await db.integrations.Core.InvokeLLM({
      prompt: `You are a prompt enhancement assistant. Take the following user prompt and rewrite it to be clearer, more structured, and more effective for getting a great AI response. Preserve the original meaning and intent exactly. Return only the enhanced prompt text with no explanation, no quotes, no preamble.\n\nOriginal prompt: ${trimmed}`,
    });
    setValue(typeof result === 'string' ? result : trimmed);
    setIsEnhancing(false);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  // Voice: place transcript into input field
  const handleVoiceConfirm = (transcript) => {
    setValue(prev => (prev ? prev + ' ' + transcript : transcript));
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const canSend = (value.trim().length > 0 || attachments.length > 0) && !isLoading && !isUploading;

  return (
    <>
      <VoiceRecorder isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} onConfirm={handleVoiceConfirm} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl mx-auto px-4 pb-4 md:pb-6"
      >
        <div className="relative bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg shadow-foreground/[0.03] transition-shadow focus-within:shadow-xl focus-within:shadow-primary/[0.06] focus-within:border-primary/20">
          {/* Attachment previews */}
          <AttachmentPreview attachments={attachments} onRemove={removeAttachment} />

          {/* Toolbar */}
          <div className="flex items-center gap-1 px-3 pt-2.5 pb-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground/40 hover:text-muted-foreground"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              onClick={() => setVoiceOpen(true)}
              className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground/40 hover:text-muted-foreground"
            >
              <Mic className="w-4 h-4" />
            </button>
            <motion.button
              onClick={handleEnhance}
              disabled={!value.trim() || isEnhancing}
              whileHover={value.trim() && !isEnhancing ? { scale: 1.08 } : {}}
              whileTap={value.trim() && !isEnhancing ? { scale: 0.94 } : {}}
              title="Enhance prompt"
              className={`p-1.5 rounded-lg transition-colors ${
                value.trim() && !isEnhancing
                  ? 'text-primary/70 hover:text-primary hover:bg-primary/8'
                  : 'text-muted-foreground/20 cursor-not-allowed'
              }`}
            >
              {isEnhancing
                ? <span className="w-4 h-4 flex items-center justify-center"><span className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></span>
                : <Sparkles className="w-4 h-4" />
              }
            </motion.button>
          </div>

          <div className="flex items-end gap-2 px-3 pb-2.5">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Eleven..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm leading-relaxed py-2 px-1 placeholder:text-muted-foreground/40 focus:outline-none"
            />
            <motion.button
              onClick={handleSubmit}
              disabled={!canSend}
              whileHover={canSend ? { scale: 1.05 } : {}}
              whileTap={canSend ? { scale: 0.95 } : {}}
              className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                canSend
                  ? 'bg-foreground text-background shadow-sm'
                  : 'bg-muted text-muted-foreground/30 cursor-not-allowed'
              }`}
            >
              {isUploading ? (
                <span className="w-3 h-3 border-2 border-background/40 border-t-background rounded-full animate-spin" />
              ) : (
                <ArrowUp className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/30 mt-2.5 font-light">
          Eleven may produce inaccurate information. Verify important details.
        </p>

        {/* Hidden file input */}
        <input ref={fileInputRef} type="file" accept={ACCEPTED} multiple className="hidden" onChange={handleFileChange} />
      </motion.div>
    </>
  );
}