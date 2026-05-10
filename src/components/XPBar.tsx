'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { getLevelTitle, getLevelColor, xpProgressInLevel, xpToNextLevel } from '@/lib/utils';

interface XPBarProps {
  xp: number;
  level: number;
  showDetails?: boolean;
  className?: string;
}

export default function XPBar({
  xp,
  level,
  showDetails = true,
  className = '',
}: XPBarProps) {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [hasAnimated, setHasAnimated] = useState(false);

  const progressPercent = xpProgressInLevel(xp, level); // 0–100
  const nextLevelXP = xpToNextLevel(xp, level);         // XP needed for next level
  const currentLevelXP = xp - (xpProgressInLevel(xp, level) === 0 ? 0 : Math.floor(xp - (progressPercent / 100) * nextLevelXP));
  const levelTitle = getLevelTitle(level);
  const nextLevelTitle = getLevelTitle(level + 1);
  const levelColor = getLevelColor(level);

  // XP already earned inside current level (for the "X / Y XP" display)
  // We derive the base XP of the current level from the progress data.
  // xpProgressInLevel returns a percentage 0-100, xpToNextLevel is XP remaining.
  // Total span of this level = xpInCurrentLevel + xpToNextLevel
  const xpRemainingToNext = nextLevelXP;
  const xpInCurrentLevel = Math.round((progressPercent / 100) * (xpRemainingToNext + Math.round((progressPercent / 100) * xpRemainingToNext / (1 - progressPercent / 100 || 1))));

  // Simpler: just display earned-in-level and total-span
  // earned = progressPercent * span / 100, span = xpToNextLevel / (1 - progressPercent/100)
  const safeProgress = Math.min(Math.max(progressPercent, 0), 100);
  const levelSpan = safeProgress < 100
    ? Math.round(xpRemainingToNext / ((100 - safeProgress) / 100 || 1))
    : xpRemainingToNext;
  const xpEarned = Math.round((safeProgress / 100) * levelSpan);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      controls.start({
        width: `${safeProgress}%`,
        transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
      });
    }
  }, [isInView, hasAnimated, controls, safeProgress]);

  return (
    <div ref={ref} className={`w-full ${className}`}>
      {showDetails && (
        <div className="flex items-center justify-between mb-2">
          {/* Current level info */}
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full border"
              style={{
                color: levelColor,
                borderColor: `${levelColor}40`,
                backgroundColor: `${levelColor}15`,
              }}
            >
              Lv.{level}
            </span>
            <span className="text-white/80 text-sm font-semibold">{levelTitle}</span>
          </div>

          {/* Next level info */}
          <div className="flex items-center gap-1.5 text-white/40 text-xs">
            <span>Next:</span>
            <span className="text-white/60 font-medium">{nextLevelTitle}</span>
            <span className="text-white/30">Lv.{level + 1}</span>
          </div>
        </div>
      )}

      {/* Bar track */}
      <div className="relative w-full h-4 rounded-full bg-space-700 border border-white/10 overflow-hidden">
        {/* Shimmer overlay on track */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

        {/* Animated fill */}
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 40%, #22d3ee 80%, #fbbf24 100%)',
            boxShadow: '0 0 12px 2px rgba(167,139,250,0.6), 0 0 24px 4px rgba(34,211,238,0.3)',
          }}
          initial={{ width: '0%' }}
          animate={controls}
        >
          {/* Inner highlight */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/25 to-transparent" />

          {/* Pulsing glow tip */}
          {safeProgress > 2 && (
            <motion.div
              className="absolute right-0 top-0 h-full w-3 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(34,211,238,0.4) 60%, transparent 100%)',
              }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </motion.div>
      </div>

      {/* XP numbers below */}
      {showDetails && (
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-white/40 tabular-nums">
            <span className="text-gold-400 font-semibold">{xpEarned.toLocaleString()}</span>
            {' / '}
            <span>{levelSpan.toLocaleString()} XP</span>
          </span>
          <span className="text-xs text-white/30 tabular-nums">
            {xpRemainingToNext.toLocaleString()} XP to go
          </span>
        </div>
      )}
    </div>
  );
}
