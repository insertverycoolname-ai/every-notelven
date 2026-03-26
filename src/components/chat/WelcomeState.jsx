import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Lightbulb, FileText, FolderKanban, Mail, Pencil, ClipboardList, Rocket, LayoutList, Sparkles, BookOpen, Layers, MessageSquare, CheckSquare } from 'lucide-react';
import AssistantName from './AssistantName';

const ALL_SUGGESTIONS = [
  { icon: Calendar,      text: 'Help me organize my week' },
  { icon: Lightbulb,     text: 'Write a brand concept' },
  { icon: FileText,      text: 'Summarize this idea' },
  { icon: FolderKanban,  text: 'Plan my next project' },
  { icon: Mail,          text: 'Improve this email' },
  { icon: Lightbulb,     text: 'Brainstorm content ideas' },
  { icon: ClipboardList, text: 'Turn my notes into a clear plan' },
  { icon: Pencil,        text: 'Rewrite this more professionally' },
  { icon: Rocket,        text: 'Help me map out a launch' },
  { icon: Sparkles,      text: 'Make this prompt better' },
  { icon: BookOpen,      text: 'Create a study schedule' },
  { icon: Layers,        text: 'Organize this rough idea' },
  { icon: MessageSquare, text: 'Turn this into a polished message' },
  { icon: CheckSquare,   text: 'Help me prioritize my tasks' },
];

const CARD_COLORS = [
  'from-blue-50 to-indigo-50 border-blue-100/60 dark:from-blue-950/30 dark:to-indigo-950/30 dark:border-blue-900/30',
  'from-amber-50 to-orange-50 border-amber-100/60 dark:from-amber-950/30 dark:to-orange-950/30 dark:border-amber-900/30',
  'from-emerald-50 to-teal-50 border-emerald-100/60 dark:from-emerald-950/30 dark:to-teal-950/30 dark:border-emerald-900/30',
  'from-violet-50 to-purple-50 border-violet-100/60 dark:from-violet-950/30 dark:to-purple-950/30 dark:border-violet-900/30',
];

function pickFour(pool) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4).map((s, i) => ({ ...s, color: CARD_COLORS[i] }));
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function WelcomeState({ onSuggestionClick, assistantName = 'Eleven', onRenameAssistant }) {
  const suggestions = useMemo(() => pickFour(ALL_SUGGESTIONS), []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center h-full px-6 pb-24"
    >
      {/* Heading */}
      <motion.h1
        variants={itemVariants}
        className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-2"
      >
        Meet{' '}
        <AssistantName
          name={assistantName}
          onRename={onRenameAssistant}
          className="text-2xl md:text-3xl font-light tracking-tight text-foreground rainbow-hover"
        />
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-sm text-muted-foreground font-light mb-10"
      >
        Your personal AI assistant
      </motion.p>

      {/* Suggestion Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg"
      >
        {suggestions.map((item) => (
          <motion.button
            key={item.text}
            onClick={() => onSuggestionClick(item.text)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`group flex items-center gap-3 px-3.5 py-3 rounded-xl border bg-gradient-to-br ${item.color} text-left transition-shadow hover:shadow-md hover:shadow-primary/5`}
          >
            <item.icon className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-foreground/60 transition-colors shrink-0" />
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
              {item.text}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}