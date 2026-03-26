import React from 'react';
import { X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function AttachmentPreview({ attachments, onRemove }) {
  if (!attachments.length) return null;

  return (
    <div className="flex flex-wrap gap-2 px-3 pt-2.5">
      <AnimatePresence>
        {attachments.map((att) => (
          <motion.div
            key={att.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="relative group"
          >
            {att.isImage ? (
              // Image thumbnail
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border/40 bg-muted">
                <img src={att.localUrl} alt={att.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => onRemove(att.id)}
                  className="absolute top-0.5 right-0.5 w-4 h-4 bg-foreground/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-2.5 h-2.5 text-background" />
                </button>
              </div>
            ) : (
              // Document card
              <div className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-xl border border-border/40 bg-muted/50 max-w-[180px]">
                <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate leading-tight">{att.name}</p>
                  <p className="text-[10px] text-muted-foreground/60">{formatBytes(att.size)}</p>
                </div>
                <button
                  onClick={() => onRemove(att.id)}
                  className="shrink-0 p-0.5 rounded-md hover:bg-accent transition-colors"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}