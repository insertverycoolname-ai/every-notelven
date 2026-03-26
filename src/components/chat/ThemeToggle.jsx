import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { toggleTheme, getTheme } from '@/lib/theme';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getTheme);

  const handleToggle = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  return (
    <motion.button
      onClick={handleToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground/60 hover:text-foreground"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </motion.button>
  );
}