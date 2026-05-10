import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Returns the total XP required to reach the given level.
 * level 1 → 0, level 2 → 100, level 3 → 400, level 4 → 900
 * Formula: (level - 1)^2 * 100
 */
export function xpForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}

/**
 * Returns a value from 0.0 to 1.0 representing how far through
 * the current level the player is.
 */
export function xpProgressInLevel(xp: number, level: number): number {
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForLevel(level + 1);
  if (nextLevelXP === currentLevelXP) return 1;
  const progress = (xp - currentLevelXP) / (nextLevelXP - currentLevelXP);
  return Math.min(Math.max(progress, 0), 1);
}

/**
 * Returns the XP remaining to reach the next level.
 */
export function xpToNextLevel(xp: number, level: number): number {
  const nextLevelXP = xpForLevel(level + 1);
  return Math.max(nextLevelXP - xp, 0);
}

/**
 * Returns a title string based on the player's level.
 */
export function getLevelTitle(level: number): string {
  if (level <= 3) return 'Python Seedling';
  if (level <= 6) return 'Code Sprout';
  if (level <= 9) return 'Script Kid';
  if (level <= 12) return 'Function Fighter';
  if (level <= 15) return 'OOP Oracle';
  if (level <= 18) return 'Algorithm Ace';
  if (level <= 21) return 'Data Wizard';
  if (level <= 24) return 'Logic Legend';
  if (level <= 27) return 'Code Architect';
  return 'Python Master';
}

/**
 * Returns a Tailwind gradient class string based on the player's level.
 * Low levels → green, mid levels → blue/purple, high levels → gold/orange.
 */
export function getLevelColor(level: number): string {
  if (level <= 3) return 'from-green-400 to-emerald-500';
  if (level <= 6) return 'from-teal-400 to-cyan-500';
  if (level <= 9) return 'from-blue-400 to-indigo-500';
  if (level <= 12) return 'from-indigo-400 to-violet-500';
  if (level <= 15) return 'from-violet-400 to-purple-500';
  if (level <= 18) return 'from-purple-400 to-pink-500';
  if (level <= 21) return 'from-pink-400 to-rose-500';
  if (level <= 24) return 'from-orange-400 to-amber-500';
  if (level <= 27) return 'from-amber-400 to-yellow-500';
  return 'from-yellow-400 to-orange-500';
}

/**
 * Returns an encouraging message based on the current streak.
 */
export function getStreakMessage(streak: number): string {
  if (streak === 0) return 'Start your streak today!';
  if (streak === 1) return 'Day 1 — Let\'s go!';
  if (streak === 2) return '2 days in a row!';
  if (streak === 3) return '3 days! Getting warmed up 🔥';
  if (streak === 5) return '5 days! You\'re on fire! 🔥🔥';
  if (streak === 7) return 'ONE WEEK! Legendary streak! ⚡';
  if (streak === 14) return 'TWO WEEKS! Unstoppable! 💫';
  if (streak === 21) return 'THREE WEEKS! You\'re a machine! 🤖';
  if (streak === 30) return 'A WHOLE MONTH! 👑 Python MASTER!';
  if (streak > 30) return `${streak} days! Beyond legendary! 🌟`;
  return `${streak} days in a row! Keep it up!`;
}

/**
 * Returns today's date as a YYYY-MM-DD string.
 */
export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Returns a star rating (0–3) based on a quiz score percentage.
 */
export function starsFromScore(score: number): number {
  if (score >= 90) return 3;
  if (score >= 70) return 2;
  if (score >= 50) return 1;
  return 0;
}

/**
 * Returns the XP earned from a quiz based on the base XP and score percentage.
 * 100%       → base * 1.5
 * 80–99%     → base * 1.2
 * 60–79%     → base * 1.0
 * below 60%  → base * 0.5
 */
export function xpFromQuizScore(baseXP: number, score: number): number {
  if (score === 100) return Math.round(baseXP * 1.5);
  if (score >= 80) return Math.round(baseXP * 1.2);
  if (score >= 60) return Math.round(baseXP * 1.0);
  return Math.round(baseXP * 0.5);
}

/**
 * Returns a Tailwind text color class based on achievement rarity.
 */
export function rarityColor(rarity: string): string {
  switch (rarity) {
    case 'common':
      return 'text-gray-300';
    case 'rare':
      return 'text-blue-400';
    case 'epic':
      return 'text-purple-400';
    case 'legendary':
      return 'text-yellow-400';
    default:
      return 'text-gray-300';
  }
}

/**
 * Returns a Tailwind background color class based on achievement rarity.
 */
export function rarityBg(rarity: string): string {
  switch (rarity) {
    case 'common':
      return 'bg-gray-800';
    case 'rare':
      return 'bg-blue-900/50';
    case 'epic':
      return 'bg-purple-900/50';
    case 'legendary':
      return 'bg-yellow-900/50';
    default:
      return 'bg-gray-800';
  }
}
