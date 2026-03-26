import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { FileText } from 'lucide-react';

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function MessageBubble({ message, assistantName = 'Eleven' }) {
  const isUser = message.role === 'user';
  const time = format(new Date(message.timestamp), 'h:mm a');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-start gap-3 px-4 md:px-0 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-[10px] font-semibold text-primary">{assistantName.charAt(0).toUpperCase()}</span>
        </div>
      )}

      {/* Message */}
      <div className={`max-w-[80%] md:max-w-[70%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
        {/* Attachments */}
        {message.attachments?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.attachments.map((att, i) =>
              att.isImage ? (
                <a key={i} href={att.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={att.url}
                    alt={att.name}
                    className="w-40 h-28 object-cover rounded-xl border border-border/30"
                  />
                </a>
              ) : (
                <a
                  key={i}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 pl-2.5 pr-3 py-2 rounded-xl border border-border/40 bg-card hover:bg-accent transition-colors max-w-[200px]"
                >
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{att.name}</p>
                    <p className="text-[10px] text-muted-foreground/60">{formatBytes(att.size)}</p>
                  </div>
                </a>
              )
            )}
          </div>
        )}

        {/* Text bubble */}
        {message.content && (
          <div
            className={`px-4 py-3 text-sm leading-relaxed ${
              isUser
                ? 'bg-foreground text-background rounded-2xl rounded-tr-md'
                : 'bg-card border border-border/40 text-foreground rounded-2xl rounded-tl-md'
            }`}
          >
            <div className="prose prose-sm max-w-none prose-p:m-0 prose-p:leading-relaxed">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
        )}
        <span className="text-[10px] text-muted-foreground/40 px-1">{time}</span>
      </div>
    </motion.div>
  );
}