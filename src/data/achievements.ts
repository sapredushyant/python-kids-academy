export interface AchievementStats {
  completedModuleCount: number;
  streak: number;
  longestStreak: number;
  perfectQuizCount: number;
  totalXP: number;
  level: number;
  weeklyModuleCount: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;        // emoji
  xpBonus: number;
  condition: (stats: AchievementStats) => boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Complete your first module',
    icon: '🐍',
    xpBonus: 50,
    rarity: 'common',
    condition: (stats: AchievementStats) => stats.completedModuleCount >= 1,
  },
  {
    id: 'on-a-roll',
    title: 'On a Roll',
    description: 'Complete 3 modules',
    icon: '🎯',
    xpBonus: 75,
    rarity: 'common',
    condition: (stats: AchievementStats) => stats.completedModuleCount >= 3,
  },
  {
    id: 'module-master',
    title: 'Module Master',
    description: 'Complete 10 modules',
    icon: '🏆',
    xpBonus: 150,
    rarity: 'rare',
    condition: (stats: AchievementStats) => stats.completedModuleCount >= 10,
  },
  {
    id: 'completionist',
    title: 'Completionist',
    description: 'Complete all 20 modules',
    icon: '👑',
    xpBonus: 500,
    rarity: 'legendary',
    condition: (stats: AchievementStats) => stats.completedModuleCount >= 20,
  },
  {
    id: 'day-one',
    title: 'Day One',
    description: 'Start a daily streak',
    icon: '🔥',
    xpBonus: 25,
    rarity: 'common',
    condition: (stats: AchievementStats) => stats.streak >= 1,
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: '7-day streak',
    icon: '⚡',
    xpBonus: 200,
    rarity: 'rare',
    condition: (stats: AchievementStats) => stats.streak >= 7,
  },
  {
    id: 'fortnight-fighter',
    title: 'Fortnight Fighter',
    description: '14-day streak',
    icon: '💫',
    xpBonus: 400,
    rarity: 'epic',
    condition: (stats: AchievementStats) => stats.streak >= 14,
  },
  {
    id: 'monthly-legend',
    title: 'Monthly Legend',
    description: '30-day streak',
    icon: '🌟',
    xpBonus: 1000,
    rarity: 'legendary',
    condition: (stats: AchievementStats) => stats.streak >= 30,
  },
  {
    id: 'perfect-score',
    title: 'Perfect Score',
    description: 'Get 100% on a quiz',
    icon: '💯',
    xpBonus: 100,
    rarity: 'common',
    condition: (stats: AchievementStats) => stats.perfectQuizCount >= 1,
  },
  {
    id: 'quiz-ace',
    title: 'Quiz Ace',
    description: '5 perfect quiz scores',
    icon: '🎓',
    xpBonus: 250,
    rarity: 'rare',
    condition: (stats: AchievementStats) => stats.perfectQuizCount >= 5,
  },
  {
    id: 'xp-collector',
    title: 'XP Collector',
    description: 'Earn 1000 XP',
    icon: '✨',
    xpBonus: 50,
    rarity: 'common',
    condition: (stats: AchievementStats) => stats.totalXP >= 1000,
  },
  {
    id: 'xp-hoarder',
    title: 'XP Hoarder',
    description: 'Earn 5000 XP',
    icon: '💎',
    xpBonus: 150,
    rarity: 'rare',
    condition: (stats: AchievementStats) => stats.totalXP >= 5000,
  },
  {
    id: 'xp-legend',
    title: 'XP Legend',
    description: 'Earn 10000 XP',
    icon: '🌈',
    xpBonus: 300,
    rarity: 'epic',
    condition: (stats: AchievementStats) => stats.totalXP >= 10000,
  },
  {
    id: 'level-5',
    title: 'Leveling Up',
    description: 'Reach Level 5',
    icon: '⬆️',
    xpBonus: 100,
    rarity: 'common',
    condition: (stats: AchievementStats) => stats.level >= 5,
  },
  {
    id: 'level-10',
    title: 'Double Digits',
    description: 'Reach Level 10',
    icon: '🔟',
    xpBonus: 200,
    rarity: 'rare',
    condition: (stats: AchievementStats) => stats.level >= 10,
  },
  {
    id: 'level-20',
    title: 'Twenty Strong',
    description: 'Reach Level 20',
    icon: '🚀',
    xpBonus: 500,
    rarity: 'epic',
    condition: (stats: AchievementStats) => stats.level >= 20,
  },
  {
    id: 'level-30',
    title: 'Python Master',
    description: 'Reach the max Level 30',
    icon: '🐲',
    xpBonus: 1000,
    rarity: 'legendary',
    condition: (stats: AchievementStats) => stats.level >= 30,
  },
  {
    id: 'speed-learner',
    title: 'Speed Learner',
    description: 'Complete 3 modules in one week',
    icon: '⚡',
    xpBonus: 150,
    rarity: 'rare',
    condition: (stats: AchievementStats) => stats.weeklyModuleCount >= 3,
  },
  {
    id: 'streak-saver',
    title: 'Streak Saver',
    description: 'Reach a 5-day streak',
    icon: '🛡️',
    xpBonus: 100,
    rarity: 'rare',
    condition: (stats: AchievementStats) => stats.streak >= 5,
  },
  {
    id: 'elite-scholar',
    title: 'Elite Scholar',
    description: 'Get 10 perfect quiz scores',
    icon: '🎯',
    xpBonus: 500,
    rarity: 'epic',
    condition: (stats: AchievementStats) => stats.perfectQuizCount >= 10,
  },
];
