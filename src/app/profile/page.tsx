'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pencil,
  Check,
  X,
  Trash2,
  AlertTriangle,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { useGameStore } from '@/lib/store';
import { ACHIEVEMENTS } from '@/data/achievements';
import { MODULES } from '@/data/modules';
import XPBar from '@/components/XPBar';
import StreakDisplay from '@/components/StreakDisplay';
import {
  getLevelTitle,
  getLevelColor,
  rarityColor,
  rarityBg,
} from '@/lib/utils';

// ─── Avatar options ───────────────────────────────────────────────────────────

const AVATARS = ['🧑‍💻', '👨‍💻', '👩‍💻', '🦸', '🦄', '🐉', '🤖', '🧙', '🦊', '🐼'];

// ─── Rarity filter tabs ───────────────────────────────────────────────────────

const RARITY_FILTERS = ['All', 'Common', 'Rare', 'Epic', 'Legendary'] as const;
type RarityFilter = typeof RARITY_FILTERS[number];

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  sub?: string;
}

function StatCard({ label, value, icon, sub }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-1.5 rounded-2xl border border-white/10 bg-space-800/60 backdrop-blur-sm px-5 py-4"
    >
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">{icon}</span>
        <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-white font-extrabold text-2xl tabular-nums leading-none">{value}</p>
      {sub && <p className="text-white/35 text-xs">{sub}</p>}
    </motion.div>
  );
}

// ─── Achievement card ─────────────────────────────────────────────────────────

interface AchievementCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: string;
  xpBonus: number;
  unlocked: boolean;
  delay?: number;
}

function AchievementCard({
  title,
  description,
  icon,
  rarity,
  xpBonus,
  unlocked,
  delay = 0,
}: AchievementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className={[
        'relative flex flex-col gap-2.5 rounded-2xl border p-4 transition-all duration-200',
        unlocked
          ? `${rarityBg(rarity)} border-white/15 hover:border-white/25`
          : 'bg-space-800/40 border-white/6 opacity-60',
      ].join(' ')}
    >
      {/* Locked overlay */}
      {!unlocked && (
        <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-space-900/30 backdrop-blur-[1px] z-10" />
      )}

      {/* Icon */}
      <div
        className={[
          'w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0',
          unlocked ? 'bg-white/10' : 'bg-white/5 grayscale',
        ].join(' ')}
      >
        {unlocked ? icon : '🔒'}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className={[
            'font-bold text-sm leading-tight truncate',
            unlocked ? 'text-white' : 'text-white/30',
          ].join(' ')}
        >
          {unlocked ? title : '???'}
        </p>
        <p
          className={[
            'text-xs leading-snug mt-0.5 line-clamp-2',
            unlocked ? 'text-white/50' : 'text-white/25',
          ].join(' ')}
        >
          {unlocked ? description : 'Keep learning to unlock!'}
        </p>
      </div>

      {/* Footer: rarity + XP */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-1">
        <span
          className={[
            'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border',
            unlocked ? rarityColor(rarity) : 'text-white/20',
            unlocked
              ? rarity === 'legendary'
                ? 'border-yellow-400/30 bg-yellow-400/10'
                : rarity === 'epic'
                ? 'border-purple-400/30 bg-purple-400/10'
                : rarity === 'rare'
                ? 'border-blue-400/30 bg-blue-400/10'
                : 'border-white/15 bg-white/5'
              : 'border-white/8 bg-white/5',
          ].join(' ')}
        >
          {rarity}
        </span>
        {unlocked && (
          <span className="text-[10px] font-semibold text-gold-400 tabular-nums">
            +{xpBonus} XP
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ─── Star row ──────────────────────────────────────────────────────────────────

function StarRow({ stars }: { stars: number }) {
  return (
    <span className="text-sm tracking-wider" aria-label={`${stars} stars`}>
      {[1, 2, 3].map((n) => (
        <span key={n} className={n <= stars ? 'text-yellow-400' : 'text-white/15'}>
          ★
        </span>
      ))}
    </span>
  );
}

// ─── Reset confirmation modal ─────────────────────────────────────────────────

interface ResetModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

function ResetModal({ onConfirm, onCancel }: ResetModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-red-400/30 bg-space-800 p-6 shadow-2xl shadow-black/50"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-400/15 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base">Reset All Progress?</h2>
            <p className="text-white/40 text-xs">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-white/60 text-sm mb-6 leading-relaxed">
          This will permanently erase all your XP, levels, completed modules, achievements, and streak data. Are you absolutely sure?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 text-white font-semibold text-sm transition-colors duration-150"
          >
            <X size={15} />
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors duration-150 shadow-lg shadow-red-500/30"
          >
            <Trash2 size={15} />
            Reset Everything
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main profile page ────────────────────────────────────────────────────────

export default function ProfilePage() {
  const {
    username,
    avatar,
    xp,
    level,
    streak,
    longestStreak,
    completedModules,
    unlockedAchievements,
    perfectQuizCount,
    setUsername,
    setAvatar,
    resetProgress,
  } = useGameStore();

  // ── Local UI state ─────────────────────────────────────────────────────────

  const [editingName,     setEditingName]     = useState(false);
  const [nameInput,       setNameInput]       = useState(username);
  const [rarityFilter,    setRarityFilter]    = useState<RarityFilter>('All');
  const [showResetModal,  setShowResetModal]  = useState(false);
  const [avatarIdx,       setAvatarIdx]       = useState(AVATARS.indexOf(avatar) >= 0 ? AVATARS.indexOf(avatar) : 0);

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Sync nameInput when username changes externally
  useEffect(() => {
    if (!editingName) setNameInput(username);
  }, [username, editingName]);

  // Focus input when editing starts
  useEffect(() => {
    if (editingName) {
      nameInputRef.current?.focus();
      nameInputRef.current?.select();
    }
  }, [editingName]);

  // ── Derived values ─────────────────────────────────────────────────────────

  const completedCount    = Object.keys(completedModules).length;
  const unlockedCount     = unlockedAchievements.length;
  const levelTitle        = getLevelTitle(level);
  const levelColorGrad    = getLevelColor(level);

  // Perfect quizzes (score 100 from store's perfectQuizCount)
  const perfectQuizzes = perfectQuizCount;

  // Filtered achievements
  const filteredAchievements = ACHIEVEMENTS.filter((a) => {
    if (rarityFilter === 'All') return true;
    return a.rarity === rarityFilter.toLowerCase();
  });

  // Completed modules list for display
  const completedModulesList = MODULES.filter((m) => completedModules[m.id]).map((m) => ({
    ...m,
    progress: completedModules[m.id],
  }));

  // ── Handlers ───────────────────────────────────────────────────────────────

  function cycleAvatar() {
    const next = (avatarIdx + 1) % AVATARS.length;
    setAvatarIdx(next);
    setAvatar(AVATARS[next]);
  }

  function saveName() {
    const trimmed = nameInput.trim();
    if (trimmed) setUsername(trimmed);
    else setNameInput(username); // revert if blank
    setEditingName(false);
  }

  function handleNameKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') saveName();
    if (e.key === 'Escape') {
      setNameInput(username);
      setEditingName(false);
    }
  }

  function handleReset() {
    resetProgress();
    setShowResetModal(false);
    setNameInput('');
    setAvatarIdx(0);
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen pt-16 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10">

        {/* ── HERO SECTION ───────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-white/10 bg-space-800/60 backdrop-blur-md overflow-hidden shadow-xl shadow-black/30"
        >
          {/* Top gradient bar using level color */}
          <div className={`h-1.5 bg-gradient-to-r ${levelColorGrad}`} />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

              {/* Avatar — clickable to cycle */}
              <button
                onClick={cycleAvatar}
                title="Click to change avatar"
                className="relative group flex-shrink-0"
              >
                <div className="w-24 h-24 rounded-2xl bg-space-700 border-2 border-white/15 flex items-center justify-center text-5xl shadow-lg transition-all duration-200 group-hover:border-brand-400/50 group-hover:scale-105">
                  {AVATARS[avatarIdx]}
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-brand-500 border-2 border-space-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <span className="text-[10px] font-bold text-white">↻</span>
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/25 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  tap to change
                </span>
              </button>

              {/* Name + level + streak */}
              <div className="flex-1 min-w-0 text-center sm:text-left space-y-3">

                {/* Editable username */}
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        ref={nameInputRef}
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={handleNameKeyDown}
                        onBlur={saveName}
                        maxLength={24}
                        className="bg-space-700 border border-brand-400/40 rounded-lg px-3 py-1.5 text-white font-bold text-xl outline-none focus:border-brand-400 transition-colors duration-150 w-48"
                        placeholder="Your name"
                      />
                      <button
                        onClick={saveName}
                        className="w-7 h-7 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 flex items-center justify-center transition-colors"
                      >
                        <Check size={13} className="text-green-400" />
                      </button>
                      <button
                        onClick={() => { setNameInput(username); setEditingName(false); }}
                        className="w-7 h-7 rounded-lg bg-white/8 hover:bg-white/14 border border-white/10 flex items-center justify-center transition-colors"
                      >
                        <X size={13} className="text-white/40" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingName(true)}
                      className="group flex items-center gap-2"
                      aria-label="Edit username"
                    >
                      <span className="text-white font-extrabold text-2xl sm:text-3xl leading-none">
                        {username || 'Set your name'}
                      </span>
                      <Pencil
                        size={15}
                        className="text-white/20 group-hover:text-brand-400 transition-colors duration-150"
                      />
                    </button>
                  )}
                </div>

                {/* Level badge + title */}
                <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-extrabold bg-gradient-to-r ${levelColorGrad} text-white shadow-lg`}
                  >
                    Lv.{level}
                  </span>
                  <span className="text-white/70 font-semibold text-sm">{levelTitle}</span>
                </div>

                {/* Streak compact */}
                <div className="flex justify-center sm:justify-start">
                  <StreakDisplay streak={streak} longestStreak={longestStreak} compact />
                </div>
              </div>
            </div>

            {/* XP Bar */}
            <div className="mt-6 pt-6 border-t border-white/8">
              <XPBar xp={xp} level={level} showDetails />
            </div>
          </div>
        </motion.section>

        {/* ── STATS ROW ──────────────────────────────────────────────────── */}
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              icon="✨"
              label="Total XP"
              value={xp.toLocaleString()}
              sub="experience points"
            />
            <StatCard
              icon="📦"
              label="Modules Done"
              value={completedCount}
              sub={`out of ${MODULES.length}`}
            />
            <StatCard
              icon="🔥"
              label="Longest Streak"
              value={longestStreak}
              sub={`${longestStreak === 1 ? 'day' : 'days'} record`}
            />
            <StatCard
              icon="💯"
              label="Perfect Quizzes"
              value={perfectQuizzes}
              sub="100% scores"
            />
          </div>
        </section>

        {/* ── ACHIEVEMENTS ───────────────────────────────────────────────── */}
        <section className="space-y-5">
          {/* Section header */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <h2 className="text-white font-extrabold text-xl">Your Achievements</h2>
            </div>
            <span className="text-white/40 text-sm font-semibold tabular-nums">
              {unlockedCount} / {ACHIEVEMENTS.length}
            </span>
          </div>

          {/* Unlock progress bar */}
          <div className="w-full h-2 bg-space-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-gold-400"
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          {/* Rarity filter tabs */}
          <div className="flex flex-wrap gap-2">
            {RARITY_FILTERS.map((r) => {
              const count = r === 'All'
                ? ACHIEVEMENTS.length
                : ACHIEVEMENTS.filter((a) => a.rarity === r.toLowerCase()).length;
              const unlockedInFilter = r === 'All'
                ? unlockedCount
                : ACHIEVEMENTS.filter(
                    (a) => a.rarity === r.toLowerCase() && unlockedAchievements.includes(a.id)
                  ).length;
              const active = rarityFilter === r;

              return (
                <button
                  key={r}
                  onClick={() => setRarityFilter(r)}
                  className={[
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150',
                    active
                      ? 'bg-brand-500/20 text-brand-400 border-brand-400/40'
                      : 'bg-white/5 text-white/40 border-white/10 hover:text-white/70 hover:bg-white/8',
                  ].join(' ')}
                >
                  {r}
                  <span
                    className={[
                      'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                      active ? 'bg-brand-400/20 text-brand-300' : 'bg-white/8 text-white/30',
                    ].join(' ')}
                  >
                    {unlockedInFilter}/{count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Achievement grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={rarityFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
            >
              {filteredAchievements.map((a, idx) => (
                <AchievementCard
                  key={a.id}
                  id={a.id}
                  title={a.title}
                  description={a.description}
                  icon={a.icon}
                  rarity={a.rarity}
                  xpBonus={a.xpBonus}
                  unlocked={unlockedAchievements.includes(a.id)}
                  delay={idx * 0.03}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ── COMPLETED MODULES ───────────────────────────────────────────── */}
        {completedModulesList.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <h2 className="text-white font-extrabold text-xl">Completed Modules</h2>
              <span className="text-white/40 text-sm font-semibold">
                ({completedModulesList.length})
              </span>
            </div>

            <div className="space-y-3">
              {completedModulesList.map((m, idx) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/10 bg-space-800/50 backdrop-blur-sm hover:border-white/20 transition-all duration-200 group"
                >
                  {/* Module icon */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-gradient-to-br ${m.color} shadow-md`}
                  >
                    {m.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate">{m.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <StarRow stars={m.progress.stars} />
                      <span className="text-white/30 text-xs">{m.progress.completedAt}</span>
                    </div>
                  </div>

                  {/* Score badge */}
                  <div className="flex flex-col items-end flex-shrink-0 gap-1">
                    <span
                      className={[
                        'px-2.5 py-1 rounded-lg text-xs font-extrabold tabular-nums',
                        m.progress.quizScore === 100
                          ? 'bg-yellow-400/15 text-yellow-300 border border-yellow-400/25'
                          : m.progress.quizScore >= 80
                          ? 'bg-green-400/12 text-green-300 border border-green-400/20'
                          : m.progress.quizScore >= 60
                          ? 'bg-blue-400/12 text-blue-300 border border-blue-400/20'
                          : 'bg-white/8 text-white/50 border border-white/10',
                      ].join(' ')}
                    >
                      {m.progress.quizScore}%
                    </span>
                    <span className="text-white/25 text-[10px] tabular-nums">+{m.progress.xpEarned} XP</span>
                  </div>

                  {/* Arrow on hover */}
                  <ChevronRight
                    size={15}
                    className="text-white/10 group-hover:text-white/40 transition-colors duration-150 flex-shrink-0"
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── DANGER ZONE ─────────────────────────────────────────────────── */}
        <section className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-400/15 flex items-center justify-center flex-shrink-0">
              <Shield size={18} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base">Danger Zone</h2>
              <p className="text-white/40 text-xs">Irreversible actions — proceed with caution.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div>
              <p className="text-white/70 text-sm font-semibold">Reset All Progress</p>
              <p className="text-white/35 text-xs mt-0.5">
                Permanently deletes all XP, levels, modules, achievements, and streak data.
              </p>
            </div>
            <button
              onClick={() => setShowResetModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-400/30 text-red-400 font-semibold text-sm transition-all duration-150 flex-shrink-0"
            >
              <Trash2 size={15} />
              Reset Progress
            </button>
          </div>
        </section>

      </div>

      {/* ── RESET MODAL ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showResetModal && (
          <ResetModal
            onConfirm={handleReset}
            onCancel={() => setShowResetModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
