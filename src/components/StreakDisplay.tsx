'use client';

import { motion } from 'framer-motion';
import { getStreakMessage } from '@/lib/utils';

interface StreakDisplayProps {
  streak: number;
  longestStreak: number;
  compact?: boolean;
  className?: string;
}

export default function StreakDisplay({
  streak,
  longestStreak,
  compact = false,
  className = '',
}: StreakDisplayProps) {
  const isHot = streak >= 7;
  const streakMessage = getStreakMessage(streak);

  /* ── Compact mode: just flame + number ── */
  if (compact) {
    return (
      <motion.div
        className={`flex items-center gap-1.5 ${className}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <span
          className="text-xl animate-streak-fire inline-block select-none"
          aria-label="Streak fire"
        >
          🔥
        </span>
        <span
          className={`font-extrabold text-lg tabular-nums leading-none ${
            isHot ? 'text-gold-400' : 'text-orange-400'
          }`}
          style={
            isHot
              ? {
                  textShadow:
                    '0 0 8px rgba(251,191,36,0.7), 0 0 16px rgba(251,191,36,0.4)',
                }
              : undefined
          }
        >
          {streak}
        </span>
      </motion.div>
    );
  }

  /* ── Full mode ── */
  return (
    <motion.div
      className={`flex flex-col items-center gap-2 ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.05 }}
    >
      {/* Fire + number row */}
      <div className="flex items-center gap-3">
        {/* Flame */}
        <div className="relative flex items-center justify-center">
          {/* Golden glow ring — only when hot */}
          {isHot && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(251,191,36,0.35) 0%, transparent 70%)',
                width: '120%',
                height: '120%',
                top: '-10%',
                left: '-10%',
              }}
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <span
            className="text-5xl animate-streak-fire inline-block select-none relative z-10"
            aria-label="Streak fire"
          >
            🔥
          </span>
        </div>

        {/* Count */}
        <div className="flex flex-col">
          <motion.span
            key={streak}
            className={`font-extrabold leading-none tabular-nums ${
              isHot ? 'text-gold-400 text-6xl' : 'text-orange-400 text-5xl'
            }`}
            style={
              isHot
                ? {
                    textShadow:
                      '0 0 12px rgba(251,191,36,0.8), 0 0 28px rgba(251,191,36,0.4), 0 0 48px rgba(251,191,36,0.2)',
                  }
                : {
                    textShadow: '0 0 8px rgba(251,146,60,0.5)',
                  }
            }
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            {streak}
          </motion.span>
          <span className="text-white/50 text-sm font-medium leading-tight">
            day{streak !== 1 ? 's' : ''} in a row
          </span>
        </div>
      </div>

      {/* Streak message */}
      <motion.p
        className={`text-center font-semibold text-base px-4 py-1 rounded-full ${
          isHot
            ? 'text-gold-400 bg-gold-400/10 border border-gold-400/30'
            : 'text-orange-300 bg-orange-400/10 border border-orange-400/20'
        }`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={
          isHot
            ? { textShadow: '0 0 10px rgba(251,191,36,0.5)' }
            : undefined
        }
      >
        {streakMessage}
      </motion.p>

      {/* Longest streak */}
      {longestStreak > 0 && (
        <motion.div
          className="flex items-center gap-1.5 text-white/40 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <span className="text-sm">🏅</span>
          <span>
            Best streak:{' '}
            <span className="text-white/60 font-semibold tabular-nums">
              {longestStreak} day{longestStreak !== 1 ? 's' : ''}
            </span>
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
