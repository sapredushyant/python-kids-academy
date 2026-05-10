'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Send, CheckCircle2, Loader2 } from 'lucide-react';

interface InviteModalProps {
  inviterName: string;
  inviterEmail: string;
  inviterUserId?: string;
  onClose: () => void;
}

export default function InviteModal({ inviterName, inviterEmail, inviterUserId, onClose }: InviteModalProps) {
  const [email,   setEmail]   = useState('');
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [errMsg,  setErrMsg]  = useState('');

  async function handleSend() {
    if (!email.trim()) return;
    setStatus('loading');
    setErrMsg('');

    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendEmail: email.trim(), inviterName, inviterEmail, inviterUserId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrMsg(data.error || 'Something went wrong.');
        setStatus('error');
      } else {
        setStatus('sent');
      }
    } catch {
      setErrMsg('Network error. Please try again.');
      setStatus('error');
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && status === 'idle') handleSend();
  }

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="invite-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        key="invite-modal"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
      >
        <div className="bg-space-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto p-7 relative">

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"
          >
            <X size={20} />
          </button>

          {status !== 'sent' ? (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
                  <Mail size={20} className="text-brand-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg leading-tight">Invite a Friend</h2>
                  <p className="text-white/40 text-sm">They&apos;ll get a personal invite from you</p>
                </div>
              </div>

              <p className="text-white/60 text-sm mb-5 leading-relaxed">
                Enter your friend&apos;s email and we&apos;ll send them an invite with your name on it.
                It&apos;s free to join!
              </p>

              <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wide">
                Friend&apos;s email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
                onKeyDown={handleKeyDown}
                placeholder="friend@example.com"
                className="w-full bg-space-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-brand-400/50 focus:ring-1 focus:ring-brand-400/30 transition-all mb-3"
                autoFocus
              />

              {status === 'error' && (
                <p className="text-red-400 text-xs mb-3">{errMsg}</p>
              )}

              <button
                onClick={handleSend}
                disabled={status === 'loading' || !email.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
              >
                {status === 'loading' ? (
                  <><Loader2 size={16} className="animate-spin" /> Sending…</>
                ) : (
                  <><Send size={15} /> Send Invite</>
                )}
              </button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-400/15 flex items-center justify-center">
                  <CheckCircle2 size={36} className="text-green-400" />
                </div>
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Invite sent! 🎉</h3>
              <p className="text-white/50 text-sm mb-6 leading-relaxed">
                We&apos;ve sent an invite to <span className="text-white/80 font-medium">{email}</span> with your name on it.
              </p>
              <button
                onClick={() => { setEmail(''); setStatus('idle'); }}
                className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors mr-4"
              >
                Invite another
              </button>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white/70 text-sm transition-colors"
              >
                Close
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
