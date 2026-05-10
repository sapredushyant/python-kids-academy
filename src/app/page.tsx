'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store';

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: 'easeOut', delay },
  }),
};

// ---------------------------------------------------------------------------
// Feature card data
// ---------------------------------------------------------------------------
const FEATURES = [
  {
    icon: '🧠',
    title: 'Smart Learning Path',
    description:
      'A quick quiz places you exactly where you belong — no boring content you already know.',
  },
  {
    icon: '🎮',
    title: 'Full Gamification',
    description:
      'Earn XP, level up, unlock achievements, and keep your daily streak alive. Learning is an adventure.',
  },
  {
    icon: '🐍',
    title: 'Real Python in Your Browser',
    description:
      'Type and run actual Python code without installing anything. See your programs come to life instantly.',
  },
] as const;

// ---------------------------------------------------------------------------
// Stats row data
// ---------------------------------------------------------------------------
const STATS = [
  { value: '20', label: 'Modules' },
  { value: '500+', label: 'XP to earn' },
  { value: '∞', label: 'Achievements to unlock' },
] as const;

// ---------------------------------------------------------------------------
// Username input screen
// ---------------------------------------------------------------------------
function UsernameScreen({ onDone }: { onDone: (name: string) => void }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter your name first!');
      return;
    }
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    if (trimmed.length > 24) {
      setError('Name must be 24 characters or fewer.');
      return;
    }
    onDone(trimmed);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md text-center"
      >
        {/* Big friendly emoji */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-7xl mb-6 select-none"
          aria-hidden="true"
        >
          🐍
        </motion.div>

        <h1 className="text-4xl font-extrabold mb-2 text-gradient">
          Welcome, Coder!
        </h1>
        <p className="text-slate-400 mb-8 text-lg">
          What should we call you on your cosmic coding journey?
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter your name…"
              maxLength={24}
              autoFocus
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-violet-500/30 text-white text-xl text-center placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 transition-all duration-200"
            />
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-2 text-red-400 text-sm"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xl font-bold shadow-lg hover:shadow-violet-500/40 transition-all duration-200 animate-pulse-glow"
          >
            Let&apos;s Go! 🚀
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero / landing screen
// ---------------------------------------------------------------------------
function HeroScreen({
  username,
  onStart,
}: {
  username: string;
  onStart: () => void;
}) {
  const isReturning = username !== '';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center">
      {/* Snake emoji with float animation */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        custom={0}
        className="text-8xl mb-6 animate-float select-none"
        aria-hidden="true"
      >
        🐍
      </motion.div>

      {/* Headline */}
      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.1}
        className="text-6xl sm:text-7xl font-extrabold mb-3 text-gradient leading-tight"
      >
        Python Academy
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.2}
        className="text-xl sm:text-2xl text-slate-300 mb-4 max-w-xl"
      >
        Your epic coding adventure starts here
      </motion.p>

      {/* Returning-user welcome banner */}
      <AnimatePresence>
        {isReturning && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4 }}
            className="mb-6 px-6 py-3 rounded-full bg-violet-600/20 border border-violet-400/30 text-violet-200 text-lg font-medium"
          >
            Welcome back,{' '}
            <span className="text-gradient-gold font-bold">{username}</span>!
            Ready to start?
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feature cards */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.3}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-10"
      >
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            custom={0.35 + i * 0.1}
            className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-violet-500/20 hover:border-violet-400/50 hover:bg-white/8 transition-all duration-250 glow-purple"
          >
            <span className="text-4xl" aria-hidden="true">
              {feature.icon}
            </span>
            <h3 className="text-lg font-bold text-white">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA button */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.65}
      >
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="px-10 py-5 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-2xl font-extrabold shadow-2xl hover:shadow-violet-500/50 transition-all duration-200 animate-pulse-glow"
        >
          Start Your Adventure →
        </motion.button>
      </motion.div>

      {/* Stats row */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.8}
        className="mt-12 flex flex-wrap justify-center gap-8"
      >
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1">
            <span className="text-3xl font-extrabold text-gradient">
              {stat.value}
            </span>
            <span className="text-slate-400 text-sm uppercase tracking-widest">
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function HomePage() {
  const router = useRouter();
  const { username, assessmentCompleted, setUsername, checkAndUpdateStreak } =
    useGameStore();

  // Update login streak on mount (safe — idempotent if already called today)
  useEffect(() => {
    checkAndUpdateStreak();
  }, [checkAndUpdateStreak]);

  // If assessment is already done, send the user straight to the dashboard.
  // This runs after hydration to avoid SSR mismatch.
  useEffect(() => {
    if (assessmentCompleted) {
      router.replace('/dashboard');
    }
  }, [assessmentCompleted, router]);

  // While we wait for the redirect to happen, render nothing (or a tiny loader)
  // so we don't flash the landing page to a returning user.
  if (assessmentCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 rounded-full border-4 border-violet-500 border-t-transparent"
          />
          <p className="text-slate-400 text-sm">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  // Step 1: username not set → show name-collection screen
  if (!username) {
    return (
      <UsernameScreen
        onDone={(name) => {
          setUsername(name);
          // After saving the name, the component re-renders and shows HeroScreen
        }}
      />
    );
  }

  // Step 2: username set, assessment not done → show hero landing
  return (
    <HeroScreen
      username={username}
      onStart={() => router.push('/assessment')}
    />
  );
}
