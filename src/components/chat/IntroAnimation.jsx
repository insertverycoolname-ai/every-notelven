import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroAnimation({ onComplete }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Two-line wordmark */}
          <div className="flex flex-col items-center leading-none select-none">
            <motion.span
              className="text-6xl md:text-8xl font-extralight tracking-[0.12em] text-foreground"
              style={{
                textShadow: '0 4px 32px rgba(100,110,140,0.10), 0 1px 8px rgba(100,110,140,0.07)',
              }}
              initial={{ opacity: 0, filter: 'blur(10px)', letterSpacing: '0.35em' }}
              animate={{ opacity: 1, filter: 'blur(0px)', letterSpacing: '0.12em' }}
              transition={{ duration: 1.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              every
            </motion.span>
            <motion.span
              className="text-6xl md:text-8xl font-extralight tracking-[0.12em] text-foreground"
              style={{
                textShadow: '0 4px 32px rgba(100,110,140,0.10), 0 1px 8px rgba(100,110,140,0.07)',
              }}
              initial={{ opacity: 0, filter: 'blur(10px)', letterSpacing: '0.35em' }}
              animate={{ opacity: 1, filter: 'blur(0px)', letterSpacing: '0.12em' }}
              transition={{ duration: 1.3, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              eleven
            </motion.span>
          </div>

          {/* Tagline */}
          <motion.p
            className="text-xs text-muted-foreground/50 font-light tracking-[0.2em] mt-5 uppercase"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
          >
            intelligence, simplified
          </motion.p>
        </motion.div>

        {/* Overlay fade-out — triggers onComplete when done */}
        <motion.div
          className="absolute inset-0 bg-background pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.55, ease: 'easeInOut' }}
          onAnimationComplete={onComplete}
        />
      </motion.div>
    </AnimatePresence>
  );
}