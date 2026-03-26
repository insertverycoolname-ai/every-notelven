// Curated theme presets & font themes for everyeleven

export const THEME_PRESET_KEY_PREFIX = 'everyeleven_theme_preset_';
export const CUSTOM_IMAGE_KEY_PREFIX  = 'everyeleven_theme_image_';
export const FONT_THEME_KEY_PREFIX    = 'everyeleven_font_theme_';

// ── Color presets ─────────────────────────────────────────────────────────────
export const PRESETS = [
  {
    id: 'dreamy-light',
    name: 'Dreamy Light',
    description: 'Soft warm whites',
    preview: ['#faf9f7', '#e8e6f0', '#7b8ec8'],
    dark: false,
    vars: {
      '--background': '40 20% 99%',
      '--foreground': '220 15% 15%',
      '--card': '40 15% 98%',
      '--card-foreground': '220 15% 15%',
      '--primary': '220 60% 60%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '220 10% 95%',
      '--secondary-foreground': '220 15% 20%',
      '--muted': '220 10% 96%',
      '--muted-foreground': '220 10% 50%',
      '--accent': '220 30% 93%',
      '--accent-foreground': '220 15% 20%',
      '--border': '220 15% 92%',
      '--input': '220 15% 92%',
      '--ring': '220 60% 60%',
      '--sidebar-background': '40 15% 98%',
      '--sidebar-foreground': '220 10% 30%',
      '--sidebar-accent': '220 20% 95%',
      '--sidebar-border': '220 15% 92%',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep blue-black',
    preview: ['#0d0f1a', '#1a1d2e', '#6b7fff'],
    dark: true,
    vars: {
      '--background': '232 30% 7%',
      '--foreground': '220 20% 94%',
      '--card': '232 28% 10%',
      '--card-foreground': '220 20% 94%',
      '--primary': '232 80% 68%',
      '--primary-foreground': '232 30% 7%',
      '--secondary': '232 25% 14%',
      '--secondary-foreground': '220 20% 90%',
      '--muted': '232 25% 13%',
      '--muted-foreground': '220 15% 55%',
      '--accent': '232 30% 17%',
      '--accent-foreground': '220 20% 90%',
      '--border': '232 25% 16%',
      '--input': '232 25% 16%',
      '--ring': '232 80% 68%',
      '--sidebar-background': '232 30% 8%',
      '--sidebar-foreground': '220 20% 88%',
      '--sidebar-accent': '232 25% 14%',
      '--sidebar-border': '232 25% 14%',
    },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Teal & violet',
    preview: ['#0a1a1f', '#112830', '#4dd9c0'],
    dark: true,
    vars: {
      '--background': '190 40% 7%',
      '--foreground': '180 20% 93%',
      '--card': '190 38% 10%',
      '--card-foreground': '180 20% 93%',
      '--primary': '174 65% 52%',
      '--primary-foreground': '190 40% 7%',
      '--secondary': '190 35% 13%',
      '--secondary-foreground': '180 20% 90%',
      '--muted': '190 35% 12%',
      '--muted-foreground': '180 15% 55%',
      '--accent': '264 40% 20%',
      '--accent-foreground': '180 20% 90%',
      '--border': '190 30% 16%',
      '--input': '190 30% 16%',
      '--ring': '174 65% 52%',
      '--sidebar-background': '190 40% 8%',
      '--sidebar-foreground': '180 20% 88%',
      '--sidebar-accent': '190 35% 13%',
      '--sidebar-border': '190 30% 15%',
    },
  },
  {
    id: 'pearl',
    name: 'Pearl',
    description: 'Luminous cool whites',
    preview: ['#f8f9fc', '#edf0f7', '#5b6fa8'],
    dark: false,
    vars: {
      '--background': '220 30% 98%',
      '--foreground': '220 25% 12%',
      '--card': '220 25% 97%',
      '--card-foreground': '220 25% 12%',
      '--primary': '220 55% 52%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '220 20% 93%',
      '--secondary-foreground': '220 25% 15%',
      '--muted': '220 20% 94%',
      '--muted-foreground': '220 15% 48%',
      '--accent': '220 35% 90%',
      '--accent-foreground': '220 25% 15%',
      '--border': '220 20% 88%',
      '--input': '220 20% 88%',
      '--ring': '220 55% 52%',
      '--sidebar-background': '220 25% 96%',
      '--sidebar-foreground': '220 20% 28%',
      '--sidebar-accent': '220 25% 91%',
      '--sidebar-border': '220 20% 88%',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm amber & coral',
    preview: ['#1a0f0a', '#2a1510', '#e8825a'],
    dark: true,
    vars: {
      '--background': '20 35% 7%',
      '--foreground': '30 20% 93%',
      '--card': '20 33% 10%',
      '--card-foreground': '30 20% 93%',
      '--primary': '18 75% 62%',
      '--primary-foreground': '20 35% 7%',
      '--secondary': '20 30% 13%',
      '--secondary-foreground': '30 20% 90%',
      '--muted': '20 30% 12%',
      '--muted-foreground': '30 15% 55%',
      '--accent': '350 35% 20%',
      '--accent-foreground': '30 20% 90%',
      '--border': '20 28% 17%',
      '--input': '20 28% 17%',
      '--ring': '18 75% 62%',
      '--sidebar-background': '20 35% 8%',
      '--sidebar-foreground': '30 20% 88%',
      '--sidebar-accent': '20 30% 13%',
      '--sidebar-border': '20 28% 16%',
    },
  },
  {
    id: 'minimal-mono',
    name: 'Minimal Mono',
    description: 'Pure grayscale',
    preview: ['#f5f5f5', '#e8e8e8', '#404040'],
    dark: false,
    vars: {
      '--background': '0 0% 96%',
      '--foreground': '0 0% 10%',
      '--card': '0 0% 98%',
      '--card-foreground': '0 0% 10%',
      '--primary': '0 0% 20%',
      '--primary-foreground': '0 0% 98%',
      '--secondary': '0 0% 91%',
      '--secondary-foreground': '0 0% 15%',
      '--muted': '0 0% 92%',
      '--muted-foreground': '0 0% 46%',
      '--accent': '0 0% 88%',
      '--accent-foreground': '0 0% 15%',
      '--border': '0 0% 85%',
      '--input': '0 0% 85%',
      '--ring': '0 0% 20%',
      '--sidebar-background': '0 0% 94%',
      '--sidebar-foreground': '0 0% 28%',
      '--sidebar-accent': '0 0% 89%',
      '--sidebar-border': '0 0% 85%',
    },
  },
];

// ── Font presets ──────────────────────────────────────────────────────────────
export const FONT_PRESETS = [
  {
    id: 'minimal-sans',
    name: 'Minimal Sans',
    description: 'Inter — clean & neutral',
    fontFamily: "'Inter', sans-serif",
    googleFont: null, // already loaded
    sample: 'Aa',
  },
  {
    id: 'geometric-sans',
    name: 'Geometric Sans',
    description: 'DM Sans — modern geometry',
    fontFamily: "'DM Sans', sans-serif",
    googleFont: 'DM+Sans:wght@300;400;500;600',
    sample: 'Aa',
  },
  {
    id: 'editorial-serif',
    name: 'Editorial Serif',
    description: 'Playfair — literary elegance',
    fontFamily: "'Playfair Display', serif",
    googleFont: 'Playfair+Display:wght@300;400;500;600',
    sample: 'Aa',
  },
  {
    id: 'modern-mono',
    name: 'Modern Mono',
    description: 'JetBrains Mono — precise',
    fontFamily: "'JetBrains Mono', monospace",
    googleFont: 'JetBrains+Mono:wght@300;400;500',
    sample: 'Aa',
  },
  {
    id: 'soft-rounded',
    name: 'Soft Rounded',
    description: 'Nunito — friendly curves',
    fontFamily: "'Nunito', sans-serif",
    googleFont: 'Nunito:wght@300;400;500;600',
    sample: 'Aa',
  },
];

// ── Storage helpers ───────────────────────────────────────────────────────────
function presetKey(userKey)  { return `${THEME_PRESET_KEY_PREFIX}${userKey || 'guest'}`; }
function imageKey(userKey)   { return `${CUSTOM_IMAGE_KEY_PREFIX}${userKey || 'guest'}`; }
function fontKey(userKey)    { return `${FONT_THEME_KEY_PREFIX}${userKey || 'guest'}`; }

export function getSavedPreset(userKey)      { return localStorage.getItem(presetKey(userKey)) || null; }
export function savePreset(id, userKey)      { id ? localStorage.setItem(presetKey(userKey), id) : localStorage.removeItem(presetKey(userKey)); }

export function getSavedCustomImage(userKey) { return localStorage.getItem(imageKey(userKey)) || null; }
export function saveCustomImage(url, userKey){ url ? localStorage.setItem(imageKey(userKey), url) : localStorage.removeItem(imageKey(userKey)); }

export function getSavedFontTheme(userKey)   { return localStorage.getItem(fontKey(userKey)) || 'minimal-sans'; }
export function saveFontTheme(id, userKey)   { localStorage.setItem(fontKey(userKey), id); }

export function getPresetById(id)      { return PRESETS.find(p => p.id === id) || null; }
export function getFontPresetById(id)  { return FONT_PRESETS.find(f => f.id === id) || null; }

// ── CSS-var keys to reset ─────────────────────────────────────────────────────
const COLOR_VAR_KEYS = [
  '--background','--foreground','--card','--card-foreground',
  '--primary','--primary-foreground','--secondary','--secondary-foreground',
  '--muted','--muted-foreground','--accent','--accent-foreground',
  '--border','--input','--ring',
  '--sidebar-background','--sidebar-foreground','--sidebar-accent','--sidebar-border',
];

// ── Apply helpers ─────────────────────────────────────────────────────────────
export function applyPreset(preset) {
  const root = document.documentElement;
  COLOR_VAR_KEYS.forEach(k => root.style.removeProperty(k));
  Object.entries(preset.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  preset.dark ? root.classList.add('dark') : root.classList.remove('dark');
  // clear image
  root.style.removeProperty('--custom-bg-image');
  document.body.style.removeProperty('background-image');
  document.body.style.removeProperty('background-size');
  document.body.style.removeProperty('background-position');
  document.body.style.removeProperty('background-attachment');
  document.body.classList.remove('theme-custom-image');
}

export function resetPresetVars() {
  const root = document.documentElement;
  COLOR_VAR_KEYS.forEach(k => root.style.removeProperty(k));
}

export function applyCustomImageTheme(dataUrl) {
  const root = document.documentElement;
  // Apply dark base vars for readability
  const darkPreset = getPresetById('midnight');
  if (darkPreset) Object.entries(darkPreset.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  root.classList.add('dark');
  // Apply the background to the body
  document.body.style.backgroundImage = `url("${dataUrl}")`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
  document.body.style.backgroundAttachment = 'fixed';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.classList.add('theme-custom-image');
}

export function removeCustomImageTheme() {
  document.body.style.removeProperty('background-image');
  document.body.style.removeProperty('background-size');
  document.body.style.removeProperty('background-position');
  document.body.style.removeProperty('background-attachment');
  document.body.style.removeProperty('background-repeat');
  document.body.classList.remove('theme-custom-image');
}

let _loadedFonts = new Set();
export function applyFontTheme(fontPreset) {
  if (fontPreset.googleFont && !_loadedFonts.has(fontPreset.id)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontPreset.googleFont}&display=swap`;
    document.head.appendChild(link);
    _loadedFonts.add(fontPreset.id);
  }
  document.documentElement.style.setProperty('--font-inter', fontPreset.fontFamily);
  document.body.style.fontFamily = fontPreset.fontFamily;
}

// ── Init on load ──────────────────────────────────────────────────────────────
export function initSavedTheme(userKey) {
  // Font
  const savedFontId = getSavedFontTheme(userKey);
  const fontPreset = getFontPresetById(savedFontId);
  if (fontPreset) applyFontTheme(fontPreset);

  // Color / image
  const savedImage = getSavedCustomImage(userKey);
  if (savedImage) { applyCustomImageTheme(savedImage); return; }

  const savedPresetId = getSavedPreset(userKey);
  if (savedPresetId) {
    const preset = getPresetById(savedPresetId);
    if (preset) { applyPreset(preset); return; }
  }
}