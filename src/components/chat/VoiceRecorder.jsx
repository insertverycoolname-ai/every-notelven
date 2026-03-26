import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Square, X, Check } from 'lucide-react';

export default function VoiceRecorder({ isOpen, onClose, onConfirm }) {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  // Reset state each time the panel opens
  useEffect(() => {
    if (!isOpen) return;
    setTranscript('');
    setError('');
    setIsListening(false);

    // Look up SpeechRecognition freshly inside the effect to avoid stale closure issues
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return; // unsupported — UI handles this case

    let finalText = '';
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    recognitionRef.current = rec;

    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);

    rec.onerror = (e) => {
      setIsListening(false);
      if (e.error === 'not-allowed' || e.error === 'permission-denied') {
        setError('Microphone access was denied. Please allow it in your browser settings and try again.');
      } else if (e.error === 'no-speech') {
        // non-fatal — just reset silently
      } else if (e.error !== 'aborted') {
        setError(`Could not start voice input (${e.error}). Try again or use a different browser.`);
      }
    };

    rec.onresult = (e) => {
      let interim = '';
      finalText = '';
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalText += e.results[i][0].transcript + ' ';
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      setTranscript(finalText + interim);
    };

    // Wrap start() in try/catch — it throws synchronously if mic is blocked in some browsers
    try {
      rec.start();
    } catch (err) {
      setError('Could not access microphone. Please check your browser permissions.');
    }

    return () => {
      try { rec.abort(); } catch (_) {}
      recognitionRef.current = null;
    };
  }, [isOpen]);

  const handleStop = () => {
    try { recognitionRef.current?.stop(); } catch (_) {}
  };

  const handleCancel = useCallback(() => {
    try { recognitionRef.current?.abort(); } catch (_) {}
    setTranscript('');
    setError('');
    onClose();
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    try { recognitionRef.current?.abort(); } catch (_) {}
    const t = transcript.trim();
    if (t) onConfirm(t);
    setTranscript('');
    setError('');
    onClose();
  }, [transcript, onConfirm, onClose]);

  const isSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-foreground/10 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
          />
          <motion.div
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl shadow-foreground/[0.06] p-5">
              {!isSupported ? (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Voice input isn't supported in this browser. Try Chrome or Safari.
                </p>
              ) : error ? (
                <p className="text-sm text-destructive text-center py-2 leading-relaxed">{error}</p>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {isListening ? (
                      <>
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                        </span>
                        <span className="text-xs text-muted-foreground font-medium tracking-wide">Listening…</span>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground/60">Paused — press Stop or speak again</span>
                    )}
                  </div>
                  <div className="min-h-[56px] mb-4 px-1 text-sm text-foreground leading-relaxed">
                    {transcript || <span className="text-muted-foreground/40">Start speaking…</span>}
                  </div>
                </>
              )}

              <div className="flex items-center justify-between">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-accent transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
                <div className="flex items-center gap-2">
                  {isListening && (
                    <button
                      onClick={handleStop}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-accent transition-colors"
                    >
                      <Square className="w-3.5 h-3.5" />
                      Stop
                    </button>
                  )}
                  <button
                    onClick={handleConfirm}
                    disabled={!transcript.trim()}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                      transcript.trim()
                        ? 'bg-foreground text-background hover:bg-foreground/90'
                        : 'bg-muted text-muted-foreground/40 cursor-not-allowed'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    Use text
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}