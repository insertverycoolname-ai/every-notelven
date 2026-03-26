import React from 'react';
import { motion } from 'framer-motion';

export default function TypingIndicator({ assistantName = 'Eleven' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-start gap-3 px-4 md:px-0"
    >
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[10px] font-semibold text-primary">{assistantName.charAt(0).toUpperCase()}</span>
      </div>
      <div className="bg-card border border-border/40 rounded-2xl rounded-tl-md px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}