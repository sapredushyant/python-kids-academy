'use client';

import { useEffect, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MODULES, Module } from '@/data/modules';
import { useGameStore, ModuleProgress } from '@/lib/store';
import ModuleCard from '@/components/ModuleCard';
import XPBar from '@/components/XPBar';
import StreakDisplay from '@/components/StreakDisplay';
import InviteModal from '@/components/InviteModal';
import { getLevelTitle } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

// ─── Constants ────────────────────────────────────────────────────────────────

const DAILY_QUOTES = [
  "Every expert was once a beginner. Keep going! 🚀",
  "Code a little every day and watch yourself grow! 🌱",
  "Bugs are just puzzles waiting to be solved. 🧩",
  "Today's practice is tomorrow's superpower! ⚡",
  "Python is a superpower — and you're learning it! 🐍",
] as const;

// ─── Time-until-midnight helper ───────────────────────────────────────────────

function useTimeUntilMidnight() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    function calc() {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft('00:00:00');
        return;
      }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setTimeLeft(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );
    }
    calc();
    const id = setInterval(calc, 1_000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

// ─── Progress Ring (SVG) ──────────────────────────────────────────────────────

interface ProgressRingProps {
  completed: number;
  total: number;
  size?: number;
}

function ProgressRing({ completed, total, size = 80 }: ProgressRingProps) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? completed / total : 0;
  const strokeDashoffset = circumference * (1 - pct);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={7}
        />
        {/* Fill */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ring-gradient)"
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
        />
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
      {/* Centre text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-white font-extrabold text-base leading-none tabular-nums">
          {completed}
        </span>
        <span className="text-white/35 text-[10px] leading-none">/{total}</span>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={[
        'rounded-2xl border border-white/10 bg-space-800',
        'p-5 flex flex-col gap-3',
        className,
      ].join(' ')}
    >
      {children}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const timeLeft = useTimeUntilMidnight();

  const {
    username,
    xp,
    level,
    completedModules,
    startingModuleId,
    assessmentCompleted,
    assessmentScore,
    assessmentMaxScore,
    streak,
    longestStreak,
    checkAndUpdateStreak,
  } = useGameStore();

  const [showInvite,    setShowInvite]    = useState(false);
  const [userEmail,     setUserEmail]     = useState('');
  const [userId,        setUserId]        = useState('');

  const addXP = useGameStore((s) => s.addXP);

  // ── Update streak on mount ────────────────────────────────────────────────
  useEffect(() => {
    checkAndUpdateStreak();
  }, [checkAndUpdateStreak]);

  // ── Get signed-in user's email + id; redeem referral bonus if pending ─────
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      if (!user) return;
      setUserEmail(user.email ?? '');
      setUserId(user.id);

      // Redeem referral bonus if this user arrived via an invite link
      const ref = localStorage.getItem('algorift_ref');
      if (ref && ref !== user.id) {
        localStorage.removeItem('algorift_ref');
        try {
          const res = await fetch('/api/referral', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inviterUserId: ref, refereeUserId: user.id }),
          });
          const d = await res.json();
          if (d.success && d.bonus) {
            addXP(d.bonus); // award referee locally
          }
        } catch { /* non-critical */ }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Daily quote (rotate by day of week) ──────────────────────────────────
  const quoteIndex = new Date().getDay() % DAILY_QUOTES.length;
  const todayQuote = DAILY_QUOTES[quoteIndex];

  // ── Module calculations ───────────────────────────────────────────────────
  const completedCount = Object.keys(completedModules).length;

  // A module is locked if any of its prerequisites are NOT in completedModules
  function isModuleLocked(mod: Module): boolean {
    if (mod.prerequisites.length === 0) return false;
    return mod.prerequisites.some((prereqId) => !(prereqId in completedModules));
  }

  // The "current" module = first non-completed, non-locked module.
  // If no progress at all, fall back to startingModuleId.
  function getCurrentModuleId(): string {
    if (completedCount === 0) return startingModuleId;
    const next = MODULES.find(
      (m) => !(m.id in completedModules) && !isModuleLocked(m)
    );
    return next ? next.id : startingModuleId;
  }

  const currentModuleId = getCurrentModuleId();

  // ── Level title ───────────────────────────────────────────────────────────
  const levelTitle = getLevelTitle(level);

  // ── Streak message for dashboard card ─────────────────────────────────────
  function streakCardMessage(): string {
    if (streak === 0) return 'Start your streak today!';
    if (streak === 1) return 'Great start! Come back tomorrow.';
    if (streak < 5)   return `${streak} days running! Keep it up!`;
    if (streak < 10)  return `🔥 ${streak} days! You're on fire!`;
    if (streak < 20)  return `⚡ ${streak} days! Unstoppable!`;
    return `🌟 ${streak} days! Legendary!`;
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-space-900 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">

        {/* ── Greeting + quote ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-7"
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            Welcome back,{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(90deg,#a78bfa,#22d3ee)',
              }}
            >
              {username || 'Coder'}
            </span>
            ! 👋
          </h1>
          <p className="mt-2 text-white/50 text-sm sm:text-base leading-relaxed max-w-xl">
            {todayQuote}
          </p>
        </motion.div>

        {/* ── Assessment banner ─────────────────────────────────────────── */}
        {!assessmentCompleted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl border border-brand-500/40 bg-brand-600/10 overflow-hidden"
          >
            <div className="h-1 w-full bg-gradient-to-r from-brand-500 to-cyan-400" />
            <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🎯</span>
                  <h3 className="text-white font-bold text-base">Take Your Placement Quiz!</h3>
                </div>
                <p className="text-white/50 text-sm">
                  A 20-question quiz to find your perfect starting point. Takes about 5 minutes.
                </p>
              </div>
              <Link
                href="/assessment"
                className="flex-shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-white font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Start Quiz →
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl border border-white/8 bg-space-800/60 px-5 py-3 flex items-center justify-between"
          >
            <p className="text-white/40 text-sm">
              Placement score: <span className="text-white/70 font-semibold">{assessmentScore}/{assessmentMaxScore}</span>
            </p>
            <Link
              href="/assessment"
              className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
            >
              Retake Assessment →
            </Link>
          </motion.div>
        )}

        {/* ── Stats row ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

          {/* Card 1: Level + XP Bar */}
          <StatCard>
            <div className="flex items-center gap-2">
              <span className="text-2xl select-none" aria-hidden="true">🏆</span>
              <div>
                <p className="text-white/40 text-xs font-medium uppercase tracking-wider">
                  Level
                </p>
                <p className="text-white font-extrabold text-xl leading-tight">
                  {level}
                  <span className="text-white/50 font-medium text-base ml-1.5">
                    {levelTitle}
                  </span>
                </p>
              </div>
            </div>
            <XPBar xp={xp} level={level} showDetails={true} />
          </StatCard>

          {/* Card 2: Streak */}
          <StatCard>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl select-none" aria-hidden="true">🔥</span>
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider">
                Streak
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StreakDisplay
                streak={streak}
                longestStreak={longestStreak}
                compact={true}
              />
              <p className="text-white/60 text-sm leading-snug">
                {streakCardMessage()}
              </p>
            </div>
            {longestStreak > 0 && (
              <p className="text-white/30 text-xs mt-auto">
                🏅 Best: {longestStreak} day{longestStreak !== 1 ? 's' : ''}
              </p>
            )}
          </StatCard>

          {/* Card 3: Progress ring */}
          <StatCard className="items-center text-center">
            <div className="flex items-center gap-2 self-start">
              <span className="text-2xl select-none" aria-hidden="true">✅</span>
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider">
                Progress
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1 justify-center">
              <ProgressRing completed={completedCount} total={MODULES.length} size={84} />
              <p className="text-white/60 text-sm">
                <span className="text-white font-bold">{completedCount}</span>
                {' / '}
                <span>{MODULES.length}</span>
                {' '}modules
              </p>
            </div>
          </StatCard>
        </div>

        {/* ── Learning path heading ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
          className="flex items-center gap-3 mb-5"
        >
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Your Learning Path
          </h2>
          {completedCount > 0 && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                         text-xs font-semibold border"
              style={{
                background: 'rgba(139,92,246,0.12)',
                borderColor: 'rgba(139,92,246,0.30)',
                color: '#a78bfa',
              }}
            >
              🎯 {completedCount} done
            </span>
          )}
        </motion.div>

        {/* ── Module grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {MODULES.map((mod, idx) => {
            const progress: ModuleProgress | undefined = completedModules[mod.id];
            const locked = isModuleLocked(mod);
            const isCurrent = mod.id === currentModuleId && !locked;

            return (
              <ModuleCard
                key={mod.id}
                module={mod}
                progress={progress}
                isLocked={locked}
                isCurrent={isCurrent}
                index={idx}
                onClick={() => router.push(`/module/${mod.id}`)}
              />
            );
          })}
        </div>

        {/* ── Daily Challenge card ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.45 }}
          className="rounded-2xl border border-white/10 bg-space-800 overflow-hidden"
        >
          {/* Accent top */}
          <div
            className="h-1.5 w-full"
            style={{
              background:
                'linear-gradient(90deg,#f97316 0%,#fbbf24 50%,#f472b6 100%)',
            }}
          />

          <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Icon + text */}
            <div className="flex items-center gap-4 flex-1">
              <span className="text-4xl select-none" aria-hidden="true">🔥</span>
              <div>
                <h3 className="text-white font-bold text-base leading-tight mb-0.5">
                  Daily Challenge
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">
                  Come back tomorrow to keep your{' '}
                  <span
                    className="font-bold"
                    style={{
                      color: '#fbbf24',
                      textShadow: '0 0 8px rgba(251,191,36,0.5)',
                    }}
                  >
                    {streak}-day streak
                  </span>
                  ! 🔥
                </p>
              </div>
            </div>

            {/* Countdown timer */}
            <div className="flex flex-col items-center sm:items-end gap-1 flex-shrink-0">
              <p className="text-white/35 text-xs uppercase tracking-wider font-medium">
                Resets in
              </p>
              <div
                className="font-mono font-bold text-2xl tabular-nums"
                style={{
                  color: '#fbbf24',
                  textShadow: '0 0 10px rgba(251,191,36,0.45)',
                }}
                aria-label={`Time until midnight: ${timeLeft}`}
                aria-live="polite"
                aria-atomic="true"
              >
                {timeLeft || '00:00:00'}
              </div>
              <p className="text-white/25 text-[10px] uppercase tracking-wider">
                Hours : Min : Sec
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Invite a Friend card ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45 }}
          className="mt-4 rounded-2xl border border-white/10 bg-space-800 overflow-hidden"
        >
          <div
            className="h-1.5 w-full"
            style={{ background: 'linear-gradient(90deg,#6c47ff 0%,#a855f7 50%,#22d3ee 100%)' }}
          />
          <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <span className="text-4xl select-none" aria-hidden="true">🤝</span>
              <div>
                <h3 className="text-white font-bold text-base leading-tight mb-0.5">
                  Invite a Friend
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">
                  Know someone who&apos;d love Python? Send them a personal invite — and both of you earn{' '}
                  <span className="text-brand-400 font-semibold">+250 XP</span> when they sign up!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInvite(true)}
              className="flex-shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-purple-500 text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Send Invite →
            </button>
          </div>
        </motion.div>

      </div>

      {/* ── Invite modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showInvite && (
          <InviteModal
            inviterName={username}
            inviterEmail={userEmail}
            inviterUserId={userId}
            onClose={() => setShowInvite(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
