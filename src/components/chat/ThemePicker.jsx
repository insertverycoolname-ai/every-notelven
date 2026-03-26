import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Upload, Trash2, Check } from 'lucide-react';
import {
  PRESETS, FONT_PRESETS,
  getSavedPreset, getSavedCustomImage, getSavedFontTheme,
  savePreset, saveCustomImage, saveFontTheme,
  applyPreset, applyCustomImageTheme, applyFontTheme,
  removeCustomImageTheme, getPresetById,
} from '@/lib/themePresets';

// ── Color preset swatch ───────────────────────────────────────────────────────
function PresetSwatch({ preset, isActive, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      title={preset.name}
      className={`relative flex flex-col gap-1.5 p-2.5 rounded-xl border transition-all duration-200 text-left
        ${isActive ? 'border-primary/60 shadow-md shadow-primary/10' : 'border-border/40 hover:border-border/70'}`}
      style={{ background: `hsl(${preset.vars['--background']})` }}
    >
      <div className="flex gap-1">
        {preset.preview.map((c, i) => (
          <span key={i} className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ background: c }} />
        ))}
      </div>
      <span className="text-[10px] font-medium leading-tight truncate" style={{ color: `hsl(${preset.vars['--foreground']})` }}>
        {preset.name}
      </span>
      {isActive && (
        <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-2 h-2 text-primary-foreground" />
        </span>
      )}
    </motion.button>
  );
}

// ── Font option row ───────────────────────────────────────────────────────────
function FontOption({ font, isActive, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border transition-all duration-200 text-left
        ${isActive ? 'border-primary/50 bg-primary/5' : 'border-border/30 hover:border-border/60 hover:bg-accent/40'}`}
    >
      <div>
        <p className="text-[11px] font-medium text-foreground">{font.name}</p>
        <p className="text-[10px] text-muted-foreground/60">{font.description}</p>
      </div>
      <span
        className="text-base text-muted-foreground/70 shrink-0 ml-2"
        style={{ fontFamily: font.fontFamily }}
      >
        {font.sample}
      </span>
      {isActive && <Check className="w-3 h-3 text-primary ml-1.5 shrink-0" />}
    </motion.button>
  );
}

// ── Main ThemePicker ──────────────────────────────────────────────────────────
export default function ThemePicker({ userKey }) {
  const [open, setOpen] = useState(false);
  const [activePreset, setActivePreset] = useState(() => getSavedPreset(userKey));
  const [customImage, setCustomImage]   = useState(() => getSavedCustomImage(userKey));
  const [activeFont, setActiveFont]     = useState(() => getSavedFontTheme(userKey));
  const [uploading, setUploading]       = useState(false);
  const panelRef   = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelectPreset = (preset) => {
    applyPreset(preset);
    savePreset(preset.id, userKey);
    saveCustomImage(null, userKey);
    removeCustomImageTheme();
    setCustomImage(null);
    setActivePreset(preset.id);
  };

  const handleSelectFont = (font) => {
    applyFontTheme(font);
    saveFontTheme(font.id, userKey);
    setActiveFont(font.id);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      applyCustomImageTheme(dataUrl);
      saveCustomImage(dataUrl, userKey);
      savePreset(null, userKey);
      setCustomImage(dataUrl);
      setActivePreset(null);
      setUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    saveCustomImage(null, userKey);
    removeCustomImageTheme();
    setCustomImage(null);
    const def = getPresetById('dreamy-light');
    if (def) { applyPreset(def); savePreset(def.id, userKey); setActivePreset(def.id); }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Trigger */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(v => !v)}
        className={`p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground/60 hover:text-foreground ${open ? 'bg-accent text-foreground' : ''}`}
        title="Themes"
      >
        <Palette className="w-4 h-4" />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-9 z-50 w-80 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <span className="text-xs font-semibold text-foreground tracking-wide">Appearance</span>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-accent transition-colors">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>

            <div className="px-4 pb-4 space-y-5 max-h-[80vh] overflow-y-auto">

              {/* ── Section A: Color Theme ── */}
              <div>
                <p className="text-[10px] text-muted-foreground/50 font-medium uppercase tracking-widest mb-2.5">Color Theme</p>
                <div className="grid grid-cols-3 gap-2">
                  {PRESETS.map(preset => (
                    <PresetSwatch
                      key={preset.id}
                      preset={preset}
                      isActive={activePreset === preset.id && !customImage}
                      onClick={() => handleSelectPreset(preset)}
                    />
                  ))}
                </div>

                {/* Custom image sub-section */}
                <div className="mt-3">
                  <p className="text-[10px] text-muted-foreground/40 font-medium uppercase tracking-widest mb-2">Custom Image</p>
                  {customImage ? (
                    <div className="relative rounded-xl overflow-hidden border border-border/40 h-20">
                      <img src={customImage} alt="Custom theme" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                        <span className="text-[10px] text-white/80 font-medium">Active</span>
                        <button
                          onClick={handleRemoveImage}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] transition-colors"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-border/50 hover:border-primary/40 hover:bg-accent/40 transition-all text-xs text-muted-foreground/50 hover:text-foreground"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {uploading ? 'Applying…' : 'Upload background image'}
                    </motion.button>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border/30" />

              {/* ── Section B: Font Theme ── */}
              <div>
                <p className="text-[10px] text-muted-foreground/50 font-medium uppercase tracking-widest mb-2.5">Font Theme</p>
                <div className="space-y-1.5">
                  {FONT_PRESETS.map(font => (
                    <FontOption
                      key={font.id}
                      font={font}
                      isActive={activeFont === font.id}
                      onClick={() => handleSelectFont(font)}
                    />
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}