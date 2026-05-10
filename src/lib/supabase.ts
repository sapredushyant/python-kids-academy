import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export interface LeaderboardRow {
  id: string;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  completed_modules: number;
  updated_at: string;
}

export async function syncToLeaderboard(stats: {
  username: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  completedModulesCount: number;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return; // not logged in — silently skip

  await supabase.from('leaderboard').upsert({
    id: user.id,
    username: stats.username || 'Anonymous',
    avatar: stats.avatar,
    xp: stats.xp,
    level: stats.level,
    streak: stats.streak,
    completed_modules: stats.completedModulesCount,
    updated_at: new Date().toISOString(),
  });
}

export async function fetchLeaderboard(): Promise<LeaderboardRow[]> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('xp', { ascending: false })
    .limit(100);

  if (error) return [];
  return data ?? [];
}
