'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useGameStore } from '@/lib/store';
import { ACHIEVEMENTS, Achievement } from '@/data/achievements';
import { rarityColor, rarityBg } from '@/lib/utils';

/* ── Confetti star particle config ── */
interface StarParticle {
  id: number;
  emoji: string;
  angle: number;   // degrees
  distance: number; // px
  duration: number; // seconds
  delay: number;
}

const STAR_EMOJIS = ['⭐', '✨', '💫', '🌟', '⚡', '🎉'];

function generateParticles(count: number): StarParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: STAR_EMOJIS[i % STAR_EMOJIS.length],
    angle: (360 / count) * i + Math.random() * 30 - 15,
    distance: 60 + Math.random() * 50,
    duration: 0.7 + Math.random() * 0.4,
    delay: Math.random() * 0.15,
  }));
}

const PARTICLES = generateParticles(6);

/* ── Rarity label ── */
const RARITY_LABELS: Record<Achievement['rarity'], string> = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
};

/* ── Border color per rarity ── */
function rarityBorderColor(rarity: Achievement['rarity']): string {
  switch (rarity) {
    case 'common':    return 'rgba(148,163,184,0.5)';   // slate
    case 'rare':      return 'rgba(96,165,250,0.6)';    // blue
    case 'epic':      return 'rgba(167,139,250,0.7)';   // purple
    case 'legendary': return 'rgba(251,191,36,0.8)';    // gold
  }
}

function rarityGlow(rarity: Achievement['rarity']): string {
  switch (rarity) {
    case 'common':    return 'none';
    case 'rare':      return '0 0 20px rgba(96,165,250,0.25)';
    case 'epic':      return '0 0 24px rgba(167,139,250,0.3)';
    case 'legendary': return '0 0 30px rgba(251,191,36,0.35), 0 0 60px rgba(251,191,36,0.15)';
  }
}

/* ══════════════════════════════════════════════════════════════
   Main component
══════════════════════════════════════════════════════════════ */
export default function AchievementToast() {
  const { pendingAchievements, dismissAchievement } = useGameStore();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentId = pendingAchievements[0] ?? null;
  const achievement = currentId
    ? ACHIEVEMENTS.find((a) => a.id === currentId) ?? null
    : null;

  /* Show toast whenever a new pending achievement arrives */
  useEffect(() => {
    if (currentId) {
      setVisible(true);

      // Auto-dismiss after 4 seconds
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        handleDismiss();
      }, 4000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  function handleDismiss() {
    setVisible(false);
    // Small delay so exit animation plays before removing from store
    setTimeout(() => {
      if (currentId) dismissAchievement(currentId);
    }, 350);
  }

  if (!achievement) return null;

  const borderColor = rarityBorderColor(achievement.rarity);
  const glowStyle = rarityGlow(achievement.rarity);
  const color = rarityColor(achievement.rarity);
  const bg = rarityBg(achievement.rarity);

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={currentId}
            className="relative pointer-events-auto"
            initial={{ x: 120, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 120, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          >
            {/* ── Confetti star particles ── */}
            <div className="absolute inset-0 pointer-events-none overflow-visible">
              {PARTICLES.map((p) => {
                const rad = (p.angle * Math.PI) / 180;
                const tx = Math.cos(rad) * p.distance;
                const ty = Math.sin(rad) * p.distance;

                return (
                  <motion.span
                    key={p.id}
                    className="absolute text-lg select-none"
                    style={{
                      left: '50%',
                      top: '50%',
                      translateX: '-50%',
                      translateY: '-50%',
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                    animate={{
                      x: tx,
                      y: ty,
                      opacity: [1, 1, 0],
                      scale: [0.5, 1.2, 0.6],
                    }}
                    transition={{
                      duration: p.duration,
                      delay: p.delay,
                      ease: 'easeOut',
                    }}
                  >
                    {p.emoji}
                  </motion.span>
                );
              })}
            </div>

            {/* ── Toast card ── */}
            <div
              className="relative w-80 rounded-2xl p-4 border"
              style={{
                background: 'linear-gradient(135deg, #0f0f1a 0%, #161628 100%)',
                borderColor,
                boxShadow: glowStyle !== 'none'
                  ? `${glowStyle}, 0 8px 32px rgba(0,0,0,0.6)`
                  : '0 8px 32px rgba(0,0,0,0.6)',
              }}
            >
              {/* Dismiss button */}
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all duration-150"
                aria-label="Dismiss achievement"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Header: "Achievement Unlocked" */}
              <div className="flex items-center gap-1.5 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span className="text-gold-400 text-xs font-bold uppercase tracking-widest">
                  Achievement Unlocked
                </span>
              </div>

              {/* Body row: icon + info */}
              <div className="flex items-start gap-3">
                {/* Large emoji icon */}
                <motion.div
                  className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center border text-3xl"
                  style={{
                    background: bg,
                    borderColor,
                  }}
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.1 }}
                >
                  {achievement.icon}
                </motion.div>

                {/* Title, description, rarity */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-base leading-tight truncate">
                    {achievement.title}
                  </h3>
                  <p className="text-white/55 text-xs mt-0.5 leading-snug line-clamp-2">
                    {achievement.description}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    {/* Rarity badge */}
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide"
                      style={{
                        color,
                        borderColor: `${borderColor}`,
                        background: bg,
                      }}
                    >
                      {RARITY_LABELS[achievement.rarity]}
                    </span>

                    {/* XP bonus */}
                    <motion.span
                      className="flex items-center gap-1 text-gold-400 font-extrabold text-sm"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 0.25 }}
                      style={{ textShadow: '0 0 8px rgba(251,191,36,0.7)' }}
                    >
                      +{achievement.xpBonus} XP
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* Progress bar — depletes over 4 seconds */}
              <div className="mt-3 h-0.5 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${color}, rgba(251,191,36,0.8))`,
                  }}
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 4, ease: 'linear' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
