'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, User, Zap, Trophy, LogOut, LogIn } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import { getLevelTitle } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import AuthModal from '@/components/AuthModal';

export default function Navigation() {
  const { xp, level, streak } = useGameStore();
  const pathname = usePathname();

  const [authUser, setAuthUser] = useState<{ email?: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isDashboard = pathname === '/' || pathname === '/dashboard';
  const levelTitle = getLevelTitle(level);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setAuthUser(user ?? null));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setAuthUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setAuthUser(null);
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-space-900/95 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center h-16 gap-2">

            {/* ── Logo ───────────────────────────────────────────────────────── */}
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 flex-shrink-0 mr-1"
            >
              <span className="text-2xl select-none">🐍</span>
              <span className="hidden sm:block text-base font-bold bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap">
                Python Academy
              </span>
            </Link>

            {/* ── Leaderboard link (always visible) ──────────────────────────── */}
            <Link
              href="/leaderboard"
              className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border transition-all duration-200 flex-shrink-0 ${
                pathname === '/leaderboard'
                  ? 'bg-gold-500/20 border-gold-500/50 text-gold-400'
                  : 'border-white/10 text-white/50 hover:text-white hover:border-white/20 bg-space-800/60'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Leaderboard</span>
            </Link>

            {/* ── Spacer ─────────────────────────────────────────────────────── */}
            <div className="flex-1" />

            {/* ── XP ─────────────────────────────────────────────────────────── */}
            <div className="flex items-center gap-1.5 bg-space-800/80 rounded-full px-2.5 py-1.5 border border-gold-500/30 flex-shrink-0">
              <Zap className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
              <span className="text-gold-400 font-bold text-xs sm:text-sm tabular-nums">
                {xp.toLocaleString()}
                <span className="hidden sm:inline"> XP</span>
              </span>
            </div>

            {/* ── Level ──────────────────────────────────────────────────────── */}
            <div className="flex items-center gap-1.5 bg-brand-600/30 border border-brand-500/40 rounded-full px-2.5 py-1.5 flex-shrink-0">
              <span className="text-brand-400 font-bold text-xs sm:text-sm">Lv.{level}</span>
              <span className="hidden md:block text-white/60 text-sm font-medium">
                {levelTitle}
              </span>
            </div>

            {/* ── Streak ─────────────────────────────────────────────────────── */}
            <div className="flex items-center gap-1 bg-space-800/80 rounded-full px-2.5 py-1.5 border border-orange-500/30 flex-shrink-0">
              <span className="text-base animate-streak-fire inline-block">🔥</span>
              <span className="text-orange-400 font-bold text-xs sm:text-sm tabular-nums hidden sm:block">
                {streak}d
              </span>
              <span className="text-orange-400 font-bold text-xs tabular-nums sm:hidden">
                {streak}
              </span>
            </div>

            {/* ── Sign In / Logout (always visible) ──────────────────────────── */}
            {authUser ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-space-700 border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 transition-all text-white/50 hover:text-red-400 flex-shrink-0"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1.5 bg-brand-600/30 hover:bg-brand-500/40 border border-brand-500/40 text-brand-300 hover:text-brand-200 rounded-full px-2.5 py-1.5 transition-all text-xs sm:text-sm font-medium flex-shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* ── Profile ────────────────────────────────────────────────────── */}
            <Link
              href="/profile"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-space-700 border border-white/10 hover:border-brand-500/50 hover:bg-space-600 transition-all text-white/70 hover:text-white flex-shrink-0"
              aria-label="Profile"
            >
              <User className="w-3.5 h-3.5" />
            </Link>

            {/* ── Back (non-dashboard only) ───────────────────────────────────── */}
            {!isDashboard && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1 text-white/60 hover:text-white bg-space-800/60 hover:bg-space-700 border border-white/10 rounded-full px-2.5 py-1.5 transition-all text-xs sm:text-sm font-medium flex-shrink-0"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back</span>
              </Link>
            )}

          </div>
        </div>
      </nav>

      <AnimatePresence>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </AnimatePresence>
    </>
  );
}
