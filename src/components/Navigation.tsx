'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, User, Zap } from 'lucide-react';
import { useGameStore } from '@/lib/store';
import { getLevelTitle } from '@/lib/utils';

export default function Navigation() {
  const { xp, level, streak } = useGameStore();
  const pathname = usePathname();

  const isDashboard = pathname === '/' || pathname === '/dashboard';
  const levelTitle = getLevelTitle(level);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-space-900/95 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left: Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl select-none" aria-label="Snake logo">🐍</span>
            <Link
              href="/dashboard"
              className="text-lg font-bold bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity whitespace-nowrap"
            >
              Python Academy
            </Link>
          </div>

          {/* Center: XP, Level, Title */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* XP Display */}
            <div className="flex items-center gap-1.5 bg-space-800/80 rounded-full px-3 py-1.5 border border-gold-500/30">
              <Zap className="w-4 h-4 text-gold-400 fill-gold-400" aria-hidden="true" />
              <span className="text-gold-400 font-bold text-sm tabular-nums">
                {xp.toLocaleString()} XP
              </span>
            </div>

            {/* Level Badge */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-brand-600/30 border border-brand-500/40 rounded-full px-3 py-1.5">
                <span className="text-brand-400 font-bold text-sm">Lv.{level}</span>
              </div>
              <span className="hidden md:block text-white/60 text-sm font-medium">
                {levelTitle}
              </span>
            </div>
          </div>

          {/* Right: Streak, Profile, Back */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Streak */}
            <div className="flex items-center gap-1.5 bg-space-800/80 rounded-full px-3 py-1.5 border border-orange-500/30">
              <span
                className="text-base animate-streak-fire inline-block"
                aria-label="Streak fire"
              >
                🔥
              </span>
              <span className="text-orange-400 font-bold text-sm tabular-nums hidden sm:block">
                {streak} day{streak !== 1 ? 's' : ''} streak
              </span>
              <span className="text-orange-400 font-bold text-sm tabular-nums sm:hidden">
                {streak}
              </span>
            </div>

            {/* Profile Link */}
            <Link
              href="/profile"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-space-700 border border-white/10 hover:border-brand-500/50 hover:bg-space-600 transition-all duration-200 text-white/70 hover:text-white"
              aria-label="Go to profile"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Back Button — only on non-dashboard pages */}
            {!isDashboard && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-white/60 hover:text-white bg-space-800/60 hover:bg-space-700 border border-white/10 hover:border-white/20 rounded-full px-3 py-1.5 transition-all duration-200 text-sm font-medium"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:block">Back</span>
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
