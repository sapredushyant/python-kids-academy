import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ACHIEVEMENTS, Achievement, AchievementStats } from '@/data/achievements';

export interface ModuleProgress {
  completedAt: string;
  stars: number;
  quizScore: number;
  xpEarned: number;
}

export interface GameStore {
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  completedModules: Record<string, ModuleProgress>;
  startingModuleId: string;
  assessmentCompleted: boolean;
  assessmentScore: number;
  assessmentMaxScore: number;
  streak: number;
  longestStreak: number;
  lastLoginDate: string;
  unlockedAchievements: string[];
  weeklyModuleCount: number;
  weekStart: string;
  perfectQuizCount: number;
  pendingAchievements: string[];
  setUsername: (name: string) => void;
  setAvatar: (avatar: string) => void;
  completeAssessment: (score: number, maxScore: number, startingModuleId: string) => void;
  completeModule: (moduleId: string, quizScore: number, stars: number, xpEarned: number) => void;
  addXP: (amount: number) => void;
  checkAndUpdateStreak: () => void;
  dismissAchievement: (id: string) => void;
  resetProgress: () => void;
}

function calcLevel(xp: number): number {
  return Math.min(Math.floor(Math.sqrt(xp / 100)) + 1, 30);
}

function todayYMD(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayYMD(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a).getTime();
  const db = new Date(b).getTime();
  return Math.abs(Math.round((db - da) / (1000 * 60 * 60 * 24)));
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => {
      // Internal helper: not exported, runs inside set()
      // Returns newly unlocked achievement ids
      function checkAchievements(state: {
        completedModules: Record<string, ModuleProgress>;
        streak: number;
        longestStreak: number;
        perfectQuizCount: number;
        xp: number;
        level: number;
        weeklyModuleCount: number;
        unlockedAchievements: string[];
        pendingAchievements: string[];
      }): {
        unlockedAchievements: string[];
        pendingAchievements: string[];
        xp: number;
        level: number;
      } {
        const stats: AchievementStats = {
          completedModuleCount: Object.keys(state.completedModules).length,
          streak: state.streak,
          longestStreak: state.longestStreak,
          perfectQuizCount: state.perfectQuizCount,
          totalXP: state.xp,
          level: state.level,
          weeklyModuleCount: state.weeklyModuleCount,
        };

        const newlyUnlocked: Achievement[] = ACHIEVEMENTS.filter(
          (a) =>
            !state.unlockedAchievements.includes(a.id) &&
            a.condition(stats)
        );

        if (newlyUnlocked.length === 0) {
          return {
            unlockedAchievements: state.unlockedAchievements,
            pendingAchievements: state.pendingAchievements,
            xp: state.xp,
            level: state.level,
          };
        }

        const bonusXP = newlyUnlocked.reduce((sum, a) => sum + a.xpBonus, 0);
        const newXP = state.xp + bonusXP;
        const newLevel = calcLevel(newXP);
        const newIds = newlyUnlocked.map((a) => a.id);

        return {
          unlockedAchievements: [...state.unlockedAchievements, ...newIds],
          pendingAchievements: [...state.pendingAchievements, ...newIds],
          xp: newXP,
          level: newLevel,
        };
      }

      return {
        _hasHydrated: false,
        setHasHydrated: (v: boolean) => set({ _hasHydrated: v }),
        username: '',
        avatar: '🐍',
        xp: 0,
        level: 1,
        completedModules: {},
        startingModuleId: 'variables-basics',
        assessmentCompleted: false,
        assessmentScore: 0,
        assessmentMaxScore: 0,
        streak: 0,
        longestStreak: 0,
        lastLoginDate: '',
        unlockedAchievements: [],
        weeklyModuleCount: 0,
        weekStart: '',
        perfectQuizCount: 0,
        pendingAchievements: [],

        setUsername: (name: string) => set({ username: name }),

        setAvatar: (avatar: string) => set({ avatar }),

        completeAssessment: (
          score: number,
          maxScore: number,
          startingModuleId: string
        ) =>
          set({
            assessmentCompleted: true,
            assessmentScore: score,
            assessmentMaxScore: maxScore,
            startingModuleId,
          }),

        completeModule: (
          moduleId: string,
          quizScore: number,
          stars: number,
          xpEarned: number
        ) =>
          set((state) => {
            const today = todayYMD();

            // Update weekly module count
            let weeklyModuleCount = state.weeklyModuleCount;
            let weekStart = state.weekStart;
            if (!weekStart || daysBetween(weekStart, today) >= 7) {
              weeklyModuleCount = 0;
              weekStart = today;
            }
            weeklyModuleCount += 1;

            // Update perfectQuizCount
            const perfectQuizCount =
              quizScore === 100
                ? state.perfectQuizCount + 1
                : state.perfectQuizCount;

            // Update completedModules (keep highest stars / score)
            const existing = state.completedModules[moduleId];
            const updatedModules: Record<string, ModuleProgress> = {
              ...state.completedModules,
              [moduleId]: {
                completedAt: today,
                stars: existing ? Math.max(existing.stars, stars) : stars,
                quizScore: existing
                  ? Math.max(existing.quizScore, quizScore)
                  : quizScore,
                xpEarned: existing
                  ? Math.max(existing.xpEarned, xpEarned)
                  : xpEarned,
              },
            };

            // Update XP and level
            const newXP = state.xp + xpEarned;
            const newLevel = calcLevel(newXP);

            // Build intermediate state for achievement check
            const intermediate = {
              completedModules: updatedModules,
              streak: state.streak,
              longestStreak: state.longestStreak,
              perfectQuizCount,
              xp: newXP,
              level: newLevel,
              weeklyModuleCount,
              unlockedAchievements: state.unlockedAchievements,
              pendingAchievements: state.pendingAchievements,
            };

            const achievementUpdate = checkAchievements(intermediate);

            return {
              completedModules: updatedModules,
              xp: achievementUpdate.xp,
              level: achievementUpdate.level,
              weeklyModuleCount,
              weekStart,
              perfectQuizCount,
              unlockedAchievements: achievementUpdate.unlockedAchievements,
              pendingAchievements: achievementUpdate.pendingAchievements,
            };
          }),

        addXP: (amount: number) =>
          set((state) => {
            const newXP = state.xp + amount;
            const newLevel = calcLevel(newXP);
            return { xp: newXP, level: newLevel };
          }),

        checkAndUpdateStreak: () =>
          set((state) => {
            const today = todayYMD();
            const yesterday = yesterdayYMD();

            let streak = state.streak;

            if (state.lastLoginDate === today) {
              // Already checked in today — no change
              return {};
            } else if (state.lastLoginDate === yesterday) {
              streak = streak + 1;
            } else {
              streak = 1;
            }

            const longestStreak = Math.max(streak, state.longestStreak);

            // Check achievements after streak update
            const intermediate = {
              completedModules: state.completedModules,
              streak,
              longestStreak,
              perfectQuizCount: state.perfectQuizCount,
              xp: state.xp,
              level: state.level,
              weeklyModuleCount: state.weeklyModuleCount,
              unlockedAchievements: state.unlockedAchievements,
              pendingAchievements: state.pendingAchievements,
            };

            const achievementUpdate = checkAchievements(intermediate);

            return {
              streak,
              longestStreak,
              lastLoginDate: today,
              xp: achievementUpdate.xp,
              level: achievementUpdate.level,
              unlockedAchievements: achievementUpdate.unlockedAchievements,
              pendingAchievements: achievementUpdate.pendingAchievements,
            };
          }),

        dismissAchievement: (id: string) =>
          set((state) => {
            const idx = state.pendingAchievements.indexOf(id);
            if (idx === -1) return {};
            const updated = [...state.pendingAchievements];
            updated.splice(idx, 1);
            return { pendingAchievements: updated };
          }),

        resetProgress: () =>
          set({
            username: '',
            avatar: '🐍',
            xp: 0,
            level: 1,
            completedModules: {},
            startingModuleId: 'variables-basics',
            assessmentCompleted: false,
            assessmentScore: 0,
            assessmentMaxScore: 0,
            streak: 0,
            longestStreak: 0,
            lastLoginDate: '',
            unlockedAchievements: [],
            weeklyModuleCount: 0,
            weekStart: '',
            perfectQuizCount: 0,
            pendingAchievements: [],
          }),
      };
    },
    {
      name: 'pka-store',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
