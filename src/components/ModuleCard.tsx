'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Clock, Zap, Star, CheckCircle2, ChevronRight } from 'lucide-react';
import { Module } from '@/data/modules';
import { ModuleProgress } from '@/lib/store';

interface ModuleCardProps {
  module: Module;
  progress?: ModuleProgress;   // undefined = not started or locked
  isLocked: boolean;
  isCurrent: boolean;          // glowing highlight for recommended next
  index: number;               // for staggered animation delay
  onClick: () => void;
}

// ─── Difficulty badge config ────────────────────────────────────────────────

const DIFFICULTY_CONFIG: Record<
  Module['difficulty'],
  { label: string; classes: string }
> = {
  beginner:     { label: 'Beginner',     classes: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  intermediate: { label: 'Intermediate', classes: 'bg-blue-500/20   text-blue-400   border-blue-500/30'     },
  advanced:     { label: 'Advanced',     classes: 'bg-brand-500/20  text-brand-400  border-brand-500/30'    },
  expert:       { label: 'Expert',       classes: 'bg-gold-500/20   text-gold-400   border-gold-500/30'     },
};

// ─── Star display ────────────────────────────────────────────────────────────

function StarDisplay({ stars }: { stars: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${stars} out of 3 stars`}>
      {[1, 2, 3].map((n) => (
        <Star
          key={n}
          size={14}
          className={
            n <= stars
              ? 'fill-gold-400 text-gold-400'
              : 'fill-transparent text-white/20'
          }
          strokeWidth={n <= stars ? 0 : 1.5}
        />
      ))}
    </div>
  );
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function LockedTooltip({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="locked-tooltip"
          initial={{ opacity: 0, y: 6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.95 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="absolute -top-11 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap
                     rounded-lg bg-space-700 border border-white/10 px-3 py-1.5
                     text-xs text-white/80 shadow-xl pointer-events-none"
          role="tooltip"
        >
          Complete previous modules first!
          {/* Arrow */}
          <span
            className="absolute left-1/2 -translate-x-1/2 -bottom-[5px]
                       border-4 border-transparent border-t-space-700"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function ModuleCard({
  module,
  progress,
  isLocked,
  isCurrent,
  index,
  onClick,
}: ModuleCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isCompleted = Boolean(progress);
  const diffCfg = DIFFICULTY_CONFIG[module.difficulty];

  // Parse the Tailwind gradient string (e.g. "from-yellow-500 to-orange-500")
  // We use it to build an inline gradient for the accent border.
  // Because arbitrary gradient colors can't be known at compile-time, we use
  // a small lookup derived from Tailwind's default palette.
  const GRADIENT_MAP: Record<string, string> = {
    'from-yellow-500 to-orange-500':  'linear-gradient(135deg,#eab308,#f97316)',
    'from-blue-500 to-cyan-500':      'linear-gradient(135deg,#3b82f6,#06b6d4)',
    'from-purple-500 to-pink-500':    'linear-gradient(135deg,#a855f7,#ec4899)',
    'from-green-500 to-emerald-500':  'linear-gradient(135deg,#22c55e,#10b981)',
    'from-red-500 to-rose-500':       'linear-gradient(135deg,#ef4444,#f43f5e)',
    'from-indigo-500 to-purple-500':  'linear-gradient(135deg,#6366f1,#a855f7)',
    'from-teal-500 to-cyan-500':      'linear-gradient(135deg,#14b8a6,#06b6d4)',
    'from-orange-500 to-red-500':     'linear-gradient(135deg,#f97316,#ef4444)',
    'from-pink-500 to-rose-500':      'linear-gradient(135deg,#ec4899,#f43f5e)',
    'from-cyan-500 to-blue-500':      'linear-gradient(135deg,#06b6d4,#3b82f6)',
    'from-amber-500 to-yellow-500':   'linear-gradient(135deg,#f59e0b,#eab308)',
    'from-violet-500 to-purple-500':  'linear-gradient(135deg,#8b5cf6,#a855f7)',
    'from-lime-500 to-green-500':     'linear-gradient(135deg,#84cc16,#22c55e)',
    'from-fuchsia-500 to-pink-500':   'linear-gradient(135deg,#d946ef,#ec4899)',
    'from-sky-500 to-indigo-500':     'linear-gradient(135deg,#0ea5e9,#6366f1)',
  };
  const accentGradient =
    GRADIENT_MAP[module.color] ?? 'linear-gradient(135deg,#8b5cf6,#06b6d4)';

  // ── Event handlers ──────────────────────────────────────────────────────────

  const handleClick = () => {
    if (isLocked) {
      setShowTooltip(true);
      if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
      tooltipTimer.current = setTimeout(() => setShowTooltip(false), 2400);
    } else {
      onClick();
    }
  };

  const handleMouseLeave = () => {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    setShowTooltip(false);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={isLocked ? {} : { scale: 1.02 }}
      className="relative"
    >
      {/* Current / "Next Up" pulsing glow ring */}
      {isCurrent && !isLocked && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none z-0"
          style={{
            boxShadow: '0 0 0 2px #8b5cf6, 0 0 24px 4px rgba(139,92,246,0.35)',
          }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Card body */}
      <div
        onClick={handleClick}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
        aria-label={`Module: ${module.title}${isLocked ? ' (locked)' : ''}`}
        aria-disabled={isLocked}
        className={[
          'relative z-10 rounded-2xl overflow-hidden',
          'bg-space-800 border transition-all duration-200',
          'outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
          isLocked
            ? 'border-white/5 grayscale opacity-60 cursor-not-allowed select-none'
            : isCurrent
            ? 'border-brand-500/50 cursor-pointer'
            : isCompleted
            ? 'border-white/10 cursor-pointer hover:border-white/20'
            : 'border-white/8 cursor-pointer hover:border-white/15',
        ].join(' ')}
      >
        {/* Colour accent bar — left side on desktop, top on mobile */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
          style={{ background: accentGradient }}
          aria-hidden="true"
        />

        {/* Subtle card-glow inner overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background:
              'linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(6,182,212,0.03) 100%)',
          }}
          aria-hidden="true"
        />

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <div className="relative pl-5 pr-4 pt-4 pb-4">
          {/* Top row: icon + title block + badges */}
          <div className="flex items-start gap-3">
            {/* Large emoji icon */}
            <div
              className={[
                'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
                'bg-white/5 border border-white/10 text-2xl leading-none',
                'select-none',
              ].join(' ')}
              aria-hidden="true"
            >
              {module.icon}
            </div>

            {/* Title + subtitle + badges row */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                {/* Title */}
                <h3
                  className={[
                    'text-base font-semibold leading-tight',
                    isLocked ? 'text-white/50' : 'text-white',
                  ].join(' ')}
                >
                  {module.title}
                </h3>

                {/* Right-side badges */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* NEXT UP badge */}
                  {isCurrent && !isLocked && (
                    <span
                      className="inline-flex items-center gap-1 rounded-full
                                 bg-brand-500 px-2 py-0.5 text-[10px] font-bold
                                 text-white uppercase tracking-wider shadow-lg
                                 shadow-brand-500/40"
                    >
                      <ChevronRight size={10} strokeWidth={3} />
                      Next Up
                    </span>
                  )}

                  {/* Completed badge */}
                  {isCompleted && (
                    <span
                      className="inline-flex items-center gap-1 rounded-full
                                 bg-emerald-500/20 border border-emerald-500/30
                                 px-2 py-0.5 text-[10px] font-semibold text-emerald-400"
                    >
                      <CheckCircle2 size={10} strokeWidth={2.5} />
                      Completed
                    </span>
                  )}
                </div>
              </div>

              {/* Subtitle */}
              <p
                className={[
                  'mt-0.5 text-xs leading-snug truncate',
                  isLocked ? 'text-white/30' : 'text-white/55',
                ].join(' ')}
              >
                {module.subtitle}
              </p>
            </div>
          </div>

          {/* ── Stats row ─────────────────────────────────────────────────── */}
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            {/* Difficulty badge */}
            <span
              className={[
                'inline-block rounded-full border px-2 py-0.5',
                'text-[10px] font-semibold uppercase tracking-wide',
                diffCfg.classes,
              ].join(' ')}
            >
              {diffCfg.label}
            </span>

            {/* XP reward */}
            <span
              className={[
                'inline-flex items-center gap-1 text-xs font-medium',
                isLocked ? 'text-white/25' : 'text-gold-400',
              ].join(' ')}
            >
              <Zap size={11} strokeWidth={2.5} aria-hidden="true" />
              {module.xpReward} XP
            </span>

            {/* Estimated time */}
            <span
              className={[
                'inline-flex items-center gap-1 text-xs',
                isLocked ? 'text-white/25' : 'text-white/45',
              ].join(' ')}
            >
              <Clock size={11} strokeWidth={2} aria-hidden="true" />
              {module.estimatedMinutes} min
            </span>
          </div>

          {/* ── Progress row (completed state) ───────────────────────────── */}
          {isCompleted && progress && (
            <div className="mt-3 flex items-center justify-between pt-3 border-t border-white/8">
              <StarDisplay stars={progress.stars} />
              <span className="text-xs text-white/45">
                Quiz:{' '}
                <span
                  className={
                    progress.quizScore === 100
                      ? 'text-gold-400 font-semibold'
                      : progress.quizScore >= 70
                      ? 'text-emerald-400 font-medium'
                      : 'text-white/60'
                  }
                >
                  {progress.quizScore}%
                </span>
              </span>
              <span className="text-xs text-white/35">
                +{progress.xpEarned} XP earned
              </span>
            </div>
          )}
        </div>

        {/* ── Lock overlay ─────────────────────────────────────────────────── */}
        {isLocked && (
          <div
            className="absolute inset-0 flex items-center justify-end
                       pr-4 pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10
                         flex items-center justify-center"
            >
              <Lock size={16} className="text-white/30" strokeWidth={2} />
            </div>
          </div>
        )}
      </div>

      {/* ── Tooltip (outside card so it layers above everything) ──────────── */}
      <div className="absolute -top-1 left-0 right-0 flex justify-center pointer-events-none z-50">
        <LockedTooltip visible={showTooltip} />
      </div>
    </motion.div>
  );
}
