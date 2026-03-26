const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, LogIn, RefreshCcw, Zap, Check, X } from 'lucide-react';

function UpgradeCard() {
  const [upgraded, setUpgraded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpgrade = () => {
    setLoading(true);
    // Placeholder for future billing integration
    setTimeout(() => {
      setLoading(false);
      setUpgraded(true);
    }, 1200);
  };

  if (upgraded) {
    return (
      <div className="mx-1.5 mb-1.5 px-3.5 py-3 rounded-xl bg-primary/8 border border-primary/20 flex items-center gap-2.5">
        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
        <p className="text-xs text-primary font-medium">Advanced plan activated</p>
      </div>
    );
  }

  return (
    <div className="mx-1.5 mb-1.5 px-3.5 py-3.5 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/15">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">Advanced</span>
        </div>
        <span className="text-xs font-semibold text-foreground">$30<span className="text-[10px] text-muted-foreground font-normal">/mo</span></span>
      </div>

      <ul className="space-y-1 mb-3">
        <li className="flex items-center gap-1.5">
          <Check className="w-2.5 h-2.5 text-primary/70 shrink-0" />
          <span className="text-[10px] text-muted-foreground">Unlimited image creations</span>
        </li>
        <li className="flex items-center gap-1.5">
          <Check className="w-2.5 h-2.5 text-primary/70 shrink-0" />
          <span className="text-[10px] text-muted-foreground">Up to 10 videos per day</span>
        </li>
      </ul>

      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="w-full py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? 'Upgrading…' : 'Upgrade to Advanced'}
      </button>
    </div>
  );
}

export default function SettingsPanel({ isOpen, onClose, user }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handle = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [isOpen, onClose]);

  const handleLogout = () => db.auth.logout();
  const handleLogin = () => db.auth.redirectToLogin(window.location.href);
  const handleSwitchAccount = () => db.auth.logout(window.location.href + '?switch=true');

  const initials = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-16 left-3 right-3 z-50 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl shadow-foreground/[0.06] overflow-hidden"
        >
          {/* User info */}
          {user ? (
            <div className="px-4 py-3.5 border-b border-border/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-primary">{initials}</span>
              </div>
              <div className="min-w-0">
                {user.full_name && (
                  <p className="text-sm font-medium text-foreground truncate">{user.full_name}</p>
                )}
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="px-4 py-3.5 border-b border-border/30">
              <p className="text-xs text-muted-foreground">Not signed in</p>
            </div>
          )}

          {/* Upgrade Plan */}
          <div className="pt-2">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-medium px-4 mb-2">Plan</p>
            <UpgradeCard />
          </div>

          {/* Divider */}
          <div className="border-t border-border/30 mx-3 mb-1" />

          {/* Actions */}
          <div className="p-1.5">
            {user ? (
              <>
                <button
                  onClick={handleSwitchAccount}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-accent/70 hover:text-foreground transition-colors text-left"
                >
                  <RefreshCcw className="w-3.5 h-3.5 shrink-0" />
                  Switch account
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  Log out
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-accent/70 hover:text-foreground transition-colors text-left"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                Log in
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}