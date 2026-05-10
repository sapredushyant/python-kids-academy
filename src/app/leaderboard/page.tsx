'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchLeaderboard, syncToLeaderboard, supabase, LeaderboardRow } from '@/lib/supabase';
import { useGameStore } from '@/lib/store';
import AuthModal from '@/components/AuthModal';
import { getLevelTitle } from '@/lib/utils';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const store = useGameStore();

  useEffect(() => {
    // Resolve current user
    supabase.auth.getUser().then(({ data: { user } }) => setUserId(user?.id ?? null));

    // Keep auth state in sync
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id ?? null);
    });

    // Fetch board
    fetchLeaderboard().then((data) => {
      setRows(data);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSync() {
    setSyncing(true);
    await syncToLeaderboard({
      username: store.username,
      avatar: store.avatar,
      xp: store.xp,
      level: store.level,
      streak: store.streak,
      completedModulesCount: Object.keys(store.completedModules).length,
    });
    const fresh = await fetchLeaderboard();
    setRows(fresh);
    setSyncing(false);
  }

  const myIndex = userId ? rows.findIndex((r) => r.id === userId) : -1;
  const myRank = myIndex >= 0 ? myIndex + 1 : null;

  const podium = rows.slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/40 animate-pulse text-lg">Loading leaderboard…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="text-6xl mb-3">🏆</div>
          <h1 className="text-4xl font-bold text-white mb-2">Global Leaderboard</h1>
          <p className="text-white/50">Top Python learners from around the world</p>
        </motion.div>

        {/* ── Auth / Sync bar ─────────────────────────────────────────────────── */}
        {!userId ? (
          <div className="bg-brand-600/20 border border-brand-500/30 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-white/70 text-sm">
              Sign in to save your score and compete globally!
            </p>
            <button
              onClick={() => setShowAuth(true)}
              className="bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all whitespace-nowrap"
            >
              Sign In Free
            </button>
          </div>
        ) : (
          <div className="bg-space-800/60 border border-white/10 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {myRank ? (
              <div>
                <p className="text-white/70 text-sm">
                  You&apos;re ranked{' '}
                  <span className="text-gold-400 font-bold">#{myRank}</span> globally
                  {myRank === 1 && ' 👑'}
                </p>
                {myRank > 1 && rows[myRank - 2] && (
                  <p className="text-white/40 text-xs mt-0.5">
                    Only{' '}
                    {Math.max(0, rows[myRank - 2].xp - store.xp).toLocaleString()} XP away
                    from #{myRank - 1}!
                  </p>
                )}
              </div>
            ) : (
              <p className="text-white/50 text-sm">
                Sync your score to appear on the leaderboard!
              </p>
            )}
            <button
              onClick={handleSync}
              disabled={syncing}
              className="bg-gold-500/20 hover:bg-gold-500/30 disabled:opacity-50 border border-gold-500/40 text-gold-400 text-sm font-semibold px-5 py-2 rounded-xl transition-all whitespace-nowrap"
            >
              {syncing ? 'Syncing…' : 'Sync My Score ⚡'}
            </button>
          </div>
        )}

        {rows.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌟</div>
            <p className="text-white/50 text-lg">No one&apos;s on the board yet.</p>
            <p className="text-white/30 text-sm mt-1">Sign in and be the first!</p>
          </div>
        ) : (
          <>
            {/* ── Podium ──────────────────────────────────────────────────────── */}
            {podium.length >= 1 && (
              <div className="flex items-end justify-center gap-3 sm:gap-6 mb-10">
                {/* 2nd place */}
                {podium[1] ? (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`flex flex-col items-center gap-1.5 ${podium[1].id === userId ? 'ring-2 ring-brand-400 rounded-2xl px-3 py-1' : ''}`}
                  >
                    <span className="text-3xl">{podium[1].avatar}</span>
                    <span className="text-white/80 font-semibold text-xs text-center w-20 truncate">
                      {podium[1].username}
                    </span>
                    <span className="text-gold-400 text-xs font-bold tabular-nums">
                      {podium[1].xp.toLocaleString()} XP
                    </span>
                    <div className="bg-space-700 border border-white/10 rounded-t-xl w-20 h-20 flex items-end justify-center pb-2">
                      <span className="text-3xl">🥈</span>
                    </div>
                  </motion.div>
                ) : <div className="w-20" />}

                {/* 1st place */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                  className={`flex flex-col items-center gap-1.5 ${podium[0].id === userId ? 'ring-2 ring-brand-400 rounded-2xl px-3 py-1' : ''}`}
                >
                  <span className="text-4xl">{podium[0].avatar}</span>
                  <span className="text-white font-bold text-sm text-center w-24 truncate">
                    {podium[0].username}
                  </span>
                  <span className="text-gold-400 text-sm font-bold tabular-nums">
                    {podium[0].xp.toLocaleString()} XP
                  </span>
                  <div className="bg-gradient-to-t from-gold-600/30 to-gold-400/10 border border-gold-500/30 rounded-t-xl w-24 h-28 flex items-end justify-center pb-2">
                    <span className="text-4xl">🥇</span>
                  </div>
                </motion.div>

                {/* 3rd place */}
                {podium[2] ? (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`flex flex-col items-center gap-1.5 ${podium[2].id === userId ? 'ring-2 ring-brand-400 rounded-2xl px-3 py-1' : ''}`}
                  >
                    <span className="text-3xl">{podium[2].avatar}</span>
                    <span className="text-white/80 font-semibold text-xs text-center w-20 truncate">
                      {podium[2].username}
                    </span>
                    <span className="text-gold-400 text-xs font-bold tabular-nums">
                      {podium[2].xp.toLocaleString()} XP
                    </span>
                    <div className="bg-space-700 border border-white/10 rounded-t-xl w-20 h-14 flex items-end justify-center pb-2">
                      <span className="text-3xl">🥉</span>
                    </div>
                  </motion.div>
                ) : <div className="w-20" />}
              </div>
            )}

            {/* ── Rank table ──────────────────────────────────────────────────── */}
            <div className="bg-space-800/50 border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-white/40 text-xs font-semibold px-4 py-3 w-12">#</th>
                    <th className="text-left text-white/40 text-xs font-semibold px-4 py-3">Player</th>
                    <th className="text-right text-white/40 text-xs font-semibold px-4 py-3">XP</th>
                    <th className="text-right text-white/40 text-xs font-semibold px-4 py-3 hidden sm:table-cell">
                      Level
                    </th>
                    <th className="text-right text-white/40 text-xs font-semibold px-4 py-3 hidden sm:table-cell">
                      Streak
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => {
                    const isMe = row.id === userId;
                    return (
                      <motion.tr
                        key={row.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(idx * 0.03, 0.5) }}
                        className={`border-b border-white/5 last:border-0 transition-colors ${
                          isMe ? 'bg-brand-500/10' : ''
                        }`}
                      >
                        <td className="px-4 py-3 text-sm font-medium">
                          {idx < 3 ? (
                            <span className="text-base">{MEDALS[idx]}</span>
                          ) : (
                            <span className="text-white/40">#{idx + 1}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{row.avatar}</span>
                            <div>
                              <span
                                className={`font-semibold text-sm ${
                                  isMe ? 'text-brand-300' : 'text-white/85'
                                }`}
                              >
                                {row.username}
                                {isMe && (
                                  <span className="text-brand-400 text-xs ml-1">(you)</span>
                                )}
                              </span>
                              <div className="text-white/30 text-xs hidden sm:block">
                                {getLevelTitle(row.level)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-gold-400 font-bold text-sm tabular-nums">
                            {row.xp.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-white/50 text-sm hidden sm:table-cell">
                          Lv.{row.level}
                        </td>
                        <td className="px-4 py-3 text-right text-sm hidden sm:table-cell">
                          <span className="text-orange-400">🔥 {row.streak}</span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Auth modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}
