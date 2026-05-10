'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, BookOpen, Clock, Star, Lightbulb, Code2, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { getModuleById, SectionQuestion } from '@/data/modules';
import { useGameStore } from '@/lib/store';
import CodeEditor from '@/components/CodeEditor';

// ─── Sound helpers ───────────────────────────────────────────────────────────

function playCorrectSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = ctx.currentTime;
    // Two ascending notes: C5 → E5
    [[523.25, now], [659.25, now + 0.15]].forEach(([freq, start]) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq as number, start as number);
      gain.gain.setValueAtTime(0.35, start as number);
      gain.gain.exponentialRampToValueAtTime(0.001, (start as number) + 0.35);
      osc.start(start as number);
      osc.stop((start as number) + 0.35);
    });
    setTimeout(() => ctx.close(), 800);
  } catch { /* audio not available */ }
}

function playWrongSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = ctx.currentTime;
    // Short descending "ding": E4 → C4
    [[329.63, now], [261.63, now + 0.12]].forEach(([freq, start]) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq as number, start as number);
      gain.gain.setValueAtTime(0.3, start as number);
      gain.gain.exponentialRampToValueAtTime(0.001, (start as number) + 0.28);
      osc.start(start as number);
      osc.stop((start as number) + 0.28);
    });
    setTimeout(() => ctx.close(), 700);
  } catch { /* audio not available */ }
}

// ─── Section question card ────────────────────────────────────────────────────

const XP_PENALTY    = 5;   // XP deducted per wrong answer
const MAX_PENALTIES = 2;   // stop deducting after this many wrong attempts
const HINT_AFTER    = 3;   // show re-read hint after this many wrong attempts

interface QuestionCardProps {
  question: SectionQuestion;
  onCorrect: () => void;
  onWrong: (attempts: number) => void;
}

function QuestionCard({ question, onCorrect, onWrong }: QuestionCardProps) {
  const [selected,  setSelected]  = useState<number | null>(null);
  const [attempts,  setAttempts]  = useState(0);
  const [showPenalty, setShowPenalty] = useState(false);
  const [shake,     setShake]     = useState(false);

  function handleAnswer(idx: number) {
    if (selected !== null && selected === question.correctIndex) return; // already correct
    setSelected(idx);

    if (idx === question.correctIndex) {
      playCorrectSound();
      onCorrect();
    } else {
      playWrongSound();
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      onWrong(newAttempts);

      // Shake animation
      setShake(true);
      setTimeout(() => setShake(false), 500);

      // XP penalty flash (only for first MAX_PENALTIES wrong answers)
      if (newAttempts <= MAX_PENALTIES) {
        setShowPenalty(true);
        setTimeout(() => setShowPenalty(false), 1500);
      }

      // Reset selection after a moment so they can try again
      setTimeout(() => setSelected(null), 800);
    }
  }

  const isCorrect = selected === question.correctIndex;
  const showHint  = attempts >= HINT_AFTER;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, x: shake ? [0, -6, 6, -6, 6, 0] : 0 }}
      transition={{ duration: shake ? 0.4 : 0.35 }}
      className="relative rounded-xl border border-brand-400/30 bg-brand-500/8 p-4 mt-4"
    >
      {/* Floating XP penalty */}
      <AnimatePresence>
        {showPenalty && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -32 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="absolute top-2 right-4 text-red-400 font-bold text-sm pointer-events-none z-10"
          >
            -{XP_PENALTY} XP
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-white/90 font-semibold text-sm mb-3">
        🧠 Quick Check: {question.prompt}
      </p>

      <div className="space-y-2">
        {question.options.map((opt, i) => {
          let style = 'bg-space-800/60 border-white/10 text-white/70 hover:border-brand-400/40 hover:bg-brand-500/10 cursor-pointer';
          if (selected !== null) {
            if (i === question.correctIndex) {
              style = 'bg-green-400/15 border-green-400/50 text-green-300 cursor-default';
            } else if (i === selected) {
              style = 'bg-red-400/15 border-red-400/50 text-red-300 cursor-default';
            } else {
              style = 'bg-space-800/30 border-white/5 text-white/30 cursor-default';
            }
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={isCorrect}
              className={`w-full text-left px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-150 ${style}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Re-read hint after too many wrong attempts */}
      {showHint && !isCorrect && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-yellow-400/70 text-xs flex items-center gap-1.5"
        >
          💡 Hint: re-read the section above — the answer is there!
        </motion.p>
      )}

      {isCorrect && (
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 text-green-400 text-xs font-semibold flex items-center gap-1.5"
        >
          <CheckCircle2 size={13} /> Correct! You can now mark this section done.
        </motion.p>
      )}
    </motion.div>
  );
}

// ─── Difficulty badge ────────────────────────────────────────────────────────

const difficultyConfig = {
  beginner:     { label: 'Beginner',     color: 'text-green-400',  bg: 'bg-green-400/10',  border: 'border-green-400/30'  },
  intermediate: { label: 'Intermediate', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  advanced:     { label: 'Advanced',     color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
  expert:       { label: 'Expert',       color: 'text-red-400',    bg: 'bg-red-400/10',    border: 'border-red-400/30'    },
};

// ─── Page component ──────────────────────────────────────────────────────────

export default function ModulePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const module           = getModuleById(id);
  const completedModules = useGameStore((s) => s.completedModules);

  const [currentSection,    setCurrentSection]    = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [showChallenge,     setShowChallenge]      = useState(false);
  const [revealedHints,     setRevealedHints]      = useState(0);
  const [hintsOpen,         setHintsOpen]          = useState(false);

  // ── Anti-skip gates ──────────────────────────────────────────────────────
  // Sections where code was run at least once
  const [sectionCodeRun,   setSectionCodeRun]   = useState<Set<number>>(new Set());
  // Sections where the comprehension question was answered correctly
  const [sectionAnswered,  setSectionAnswered]   = useState<Set<number>>(new Set());
  // Whether the comprehension question is visible per section
  const [questionVisible,  setQuestionVisible]   = useState<Set<number>>(new Set());
  // Whether code challenge editor has been run at least once
  const [challengeRun,     setChallengeRun]      = useState(false);

  const addXP = useGameStore((s) => s.addXP);

  const timerRefs = useRef<Record<number, ReturnType<typeof setInterval>>>({});

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const challengeRef = useRef<HTMLDivElement | null>(null);

  const alreadyCompleted = !!completedModules[id];

  // When all sections done, show challenge after a tick
  useEffect(() => {
    if (module && completedSections.size === module.sections.length && !showChallenge) {
      const timer = setTimeout(() => setShowChallenge(true), 400);
      return () => clearTimeout(timer);
    }
  }, [completedSections.size, module, showChallenge]);

  // Show question after code is run (code sections) or after 5s (text sections)
  useEffect(() => {
    if (!module) return;
    const section = module.sections[currentSection];
    if (!section) return;
    if (completedSections.has(currentSection)) return;
    if (questionVisible.has(currentSection)) return;

    if (section.code) return; // for code sections, question appears after Run click

    // Text-only section: show question after 5 seconds
    const id = setTimeout(() => {
      setQuestionVisible((prev) => { const n = new Set(prev); n.add(currentSection); return n; });
    }, 5000);
    timerRefs.current[currentSection] = id as unknown as ReturnType<typeof setInterval>;
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection, module]);

  // Cleanup on unmount
  useEffect(() => {
    const refs = timerRefs.current;
    return () => { Object.values(refs).forEach(clearInterval); };
  }, []);

  // Whether "Got it" is unlocked: question must be answered correctly
  const canMarkDone = useCallback((idx: number): boolean => {
    return sectionAnswered.has(idx);
  }, [sectionAnswered]);

  // ── Not found ──────────────────────────────────────────────────────────────

  if (!module) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-white mb-2">Module Not Found</h1>
          <p className="text-white/50 mb-8">
            We couldn&apos;t find a module with the id <code className="text-brand-400 bg-brand-400/10 px-1.5 py-0.5 rounded">{id}</code>.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors duration-200"
          >
            <ChevronLeft size={18} />
            Back to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  const diff        = difficultyConfig[module.difficulty];
  const allDone     = completedSections.size === module.sections.length;
  const quizUnlocked = allDone && (challengeRun || alreadyCompleted);

  function markSectionDone(idx: number) {
    setCompletedSections((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
    setCurrentSection(idx + 1);

    // Scroll to next section (or challenge)
    const nextIdx = idx + 1;
    if (nextIdx < module!.sections.length) {
      setTimeout(() => {
        sectionRefs.current[nextIdx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } else {
      setTimeout(() => {
        challengeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 600);
    }
  }

  function jumpToSection(idx: number) {
    setCurrentSection(idx);
    setTimeout(() => {
      sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  function revealNextHint() {
    if (revealedHints < module!.codeChallenge.hints.length) {
      setRevealedHints((n) => n + 1);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT SIDEBAR (desktop) ──────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 fixed top-0 left-0 h-screen pt-16 z-20 border-r border-white/8 bg-space-900/80 backdrop-blur-md overflow-y-auto">

        {/* Module identity */}
        <div className={`px-5 py-5 border-b border-white/8`}>
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-3xl w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
            >
              {module.icon}
            </span>
            <div className="min-w-0">
              <h2 className="text-white font-bold text-sm leading-tight truncate">{module.title}</h2>
              <p className="text-white/40 text-xs truncate">{module.subtitle}</p>
            </div>
          </div>
          {/* Color accent bar */}
          <div className={`h-1 rounded-full bg-gradient-to-r ${module.color}`} />
        </div>

        {/* Section navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Module sections">
          <p className="text-white/30 text-xs font-semibold uppercase tracking-wider px-2 mb-3">
            Sections
          </p>
          {module.sections.map((sec, idx) => {
            const done    = completedSections.has(idx);
            const active  = currentSection === idx;
            return (
              <button
                key={idx}
                onClick={() => jumpToSection(idx)}
                className={[
                  'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-sm transition-all duration-150',
                  active
                    ? 'bg-brand-500/20 text-brand-400 font-semibold'
                    : done
                    ? 'text-green-400/80 hover:bg-white/5'
                    : 'text-white/50 hover:bg-white/5 hover:text-white/80',
                ].join(' ')}
              >
                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  {done
                    ? <CheckCircle2 size={16} className="text-green-400" />
                    : <span className="text-xs font-bold text-white/30">{idx + 1}</span>
                  }
                </span>
                <span className="truncate leading-tight">{sec.title}</span>
              </button>
            );
          })}

          {/* Challenge nav item */}
          {showChallenge && (
            <button
              onClick={() => challengeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-sm text-yellow-400/80 hover:bg-yellow-400/10 transition-all duration-150"
            >
              <Code2 size={16} className="flex-shrink-0" />
              <span className="truncate">Code Challenge</span>
            </button>
          )}
        </nav>

        {/* Progress + actions */}
        <div className="px-4 py-4 border-t border-white/8 space-y-3">
          {/* Progress text */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">Progress</span>
            <span className="text-white/70 font-semibold">
              {completedSections.size} / {module.sections.length} sections
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-space-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${module.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${(completedSections.size / module.sections.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Take the Quiz button */}
          <button
            disabled={!quizUnlocked}
            onClick={() => router.push(`/module/${id}/quiz`)}
            className={[
              'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200',
              quizUnlocked
                ? 'bg-gradient-to-r from-brand-500 to-cyan-500 text-white shadow-lg shadow-brand-500/30 hover:opacity-90'
                : 'bg-white/5 text-white/25 cursor-not-allowed',
            ].join(' ')}
          >
            <Trophy size={15} />
            {!allDone ? 'Complete sections first' : !challengeRun && !alreadyCompleted ? 'Run the challenge first' : 'Take the Quiz →'}
          </button>

          {/* Back link */}
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors duration-150"
          >
            <ChevronLeft size={13} />
            Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <main className="flex-1 lg:ml-64 pt-16 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">

          {/* ── Already completed banner ──────────────────────────────────── */}
          <AnimatePresence>
            {alreadyCompleted && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="flex items-center justify-between gap-4 px-5 py-4 rounded-2xl bg-yellow-400/10 border border-yellow-400/30"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="text-yellow-300 font-bold text-sm">You&apos;ve completed this module!</p>
                    <p className="text-yellow-400/60 text-xs">
                      Score: {completedModules[id].quizScore}% · Stars: {'★'.repeat(completedModules[id].stars)}{'☆'.repeat(3 - completedModules[id].stars)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => router.push(`/module/${id}/quiz`)}
                    className="px-3 py-1.5 rounded-lg bg-yellow-400/20 text-yellow-300 text-xs font-semibold hover:bg-yellow-400/30 transition-colors"
                  >
                    Quiz Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Module header ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Icon + title row */}
            <div className="flex items-start gap-5">
              <div
                className={`text-5xl w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${module.color} shadow-lg`}
                aria-hidden="true"
              >
                {module.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-1">
                  {module.title}
                </h1>
                <p className="text-white/50 text-base sm:text-lg">{module.subtitle}</p>
              </div>
            </div>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${diff.color} ${diff.bg} ${diff.border}`}>
                {diff.label}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-gold-400 bg-gold-400/10 border border-gold-400/20">
                <Star size={12} className="fill-current" />
                {module.xpReward} XP Reward
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white/50 bg-white/5 border border-white/10">
                <Clock size={12} />
                ~{module.estimatedMinutes} min
              </span>
            </div>
          </motion.div>

          {/* ── Mobile section tabs ───────────────────────────────────────── */}
          <div className="lg:hidden -mx-4 px-4 overflow-x-auto">
            <div className="flex gap-2 min-w-max pb-2">
              {module.sections.map((sec, idx) => {
                const done   = completedSections.has(idx);
                const active = currentSection === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => jumpToSection(idx)}
                    className={[
                      'flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150',
                      active
                        ? 'bg-brand-500/20 text-brand-400 border-brand-400/40'
                        : done
                        ? 'bg-green-400/10 text-green-400 border-green-400/30'
                        : 'bg-white/5 text-white/40 border-white/10 hover:text-white/70',
                    ].join(' ')}
                  >
                    {done && <CheckCircle2 size={12} />}
                    {idx + 1}. {sec.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Mobile progress pill ──────────────────────────────────────── */}
          <div className="lg:hidden flex items-center justify-between text-sm">
            <span className="text-white/40">{completedSections.size} / {module.sections.length} sections done</span>
            <button
              disabled={!quizUnlocked}
              onClick={() => router.push(`/module/${id}/quiz`)}
              className={[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200',
                quizUnlocked
                  ? 'bg-gradient-to-r from-brand-500 to-cyan-500 text-white shadow-md hover:opacity-90'
                  : 'bg-white/5 text-white/25 cursor-not-allowed',
              ].join(' ')}
            >
              <Trophy size={12} />
              {quizUnlocked ? 'Take Quiz →' : '🔒 Quiz Locked'}
            </button>
          </div>

          {/* ── What You'll Learn card ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-brand-400/20 bg-brand-500/5 p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-brand-400" />
              <h2 className="text-white font-bold text-base">What You&apos;ll Learn</h2>
            </div>
            <ul className="space-y-2.5">
              {module.whatYoullLearn.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                  <span className="text-base leading-none mt-0.5 flex-shrink-0">✨</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Section cards ─────────────────────────────────────────────── */}
          <div className="space-y-6">
            {module.sections.map((section, idx) => {
              const done = completedSections.has(idx);
              return (
                <motion.div
                  key={idx}
                  ref={(el) => { sectionRefs.current[idx] = el; }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * idx }}
                  className={[
                    'rounded-2xl border p-6 transition-all duration-300',
                    done
                      ? 'border-green-400/30 bg-green-400/5'
                      : 'border-white/10 bg-space-800/60 backdrop-blur-sm',
                  ].join(' ')}
                >
                  {/* Section header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={[
                          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
                          done
                            ? 'bg-green-400/20 text-green-400'
                            : 'bg-brand-500/20 text-brand-400',
                        ].join(' ')}
                      >
                        {done ? <CheckCircle2 size={16} /> : idx + 1}
                      </span>
                      <h3 className="text-white font-bold text-lg leading-tight">{section.title}</h3>
                    </div>
                    {done && (
                      <span className="flex-shrink-0 text-xs font-semibold text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-full">
                        ✓ Done
                      </span>
                    )}
                  </div>

                  {/* Section content */}
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-5">
                    {section.content}
                  </p>

                  {/* Code editor */}
                  {section.code && (
                    <div className="mb-4">
                      <CodeEditor
                        initialCode={section.code}
                        height="250px"
                        readOnly={false}
                        showRunButton={true}
                        onRun={() => {
                          setSectionCodeRun((prev) => { const n = new Set(prev); n.add(idx); return n; });
                          // Reveal question after running code
                          setQuestionVisible((prev) => { const n = new Set(prev); n.add(idx); return n; });
                        }}
                      />
                      {!done && !sectionCodeRun.has(idx) && (
                        <p className="mt-2 text-xs text-yellow-400/70 flex items-center gap-1.5">
                          <span>▶</span> Run the code above to reveal the question
                        </p>
                      )}
                    </div>
                  )}

                  {/* Comprehension question */}
                  {!done && questionVisible.has(idx) && !sectionAnswered.has(idx) && (
                    <QuestionCard
                      question={section.question}
                      onCorrect={() => {
                        setSectionAnswered((prev) => { const n = new Set(prev); n.add(idx); return n; });
                      }}
                      onWrong={(attempts) => {
                        if (attempts <= MAX_PENALTIES) addXP(-XP_PENALTY);
                      }}
                    />
                  )}

                  {/* Text-only sections: show waiting hint before question appears */}
                  {!done && !section.code && !questionVisible.has(idx) && (
                    <p className="text-xs text-white/30 italic mt-2">
                      📖 Read through the section — a quick question will appear shortly…
                    </p>
                  )}

                  {/* Got it button */}
                  {!done && (() => {
                    const unlocked = canMarkDone(idx);
                    return (
                      <motion.button
                        whileTap={unlocked ? { scale: 0.97 } : {}}
                        onClick={unlocked ? () => markSectionDone(idx) : undefined}
                        className={[
                          'flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 mt-4',
                          unlocked
                            ? 'bg-gradient-to-r from-brand-500 to-cyan-500 text-white shadow-lg shadow-brand-500/20 hover:opacity-90 cursor-pointer'
                            : 'bg-white/8 text-white/30 cursor-not-allowed',
                        ].join(' ')}
                      >
                        <CheckCircle2 size={16} />
                        {unlocked ? 'Got it! ✓' : 'Answer the question above first'}
                      </motion.button>
                    );
                  })()}

                  {done && (
                    <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                      <CheckCircle2 size={16} />
                      Section completed!
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* ── Code Challenge ─────────────────────────────────────────────── */}
          <AnimatePresence>
            {showChallenge && (
              <motion.div
                ref={challengeRef}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="rounded-2xl border border-yellow-400/30 bg-yellow-400/5 p-6 space-y-5"
              >
                {/* Challenge header */}
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400/20 flex items-center justify-center">
                    <Code2 size={20} className="text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-extrabold text-xl">Code Challenge</h2>
                    <p className="text-yellow-400/70 text-xs font-semibold uppercase tracking-wider">
                      Put it all together
                    </p>
                  </div>
                </div>

                {/* Challenge prompt */}
                <div className="bg-space-800/80 rounded-xl p-4 border border-white/8">
                  <p className="text-white/80 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {module.codeChallenge.prompt}
                  </p>
                </div>

                {/* Code editor for challenge */}
                <CodeEditor
                  initialCode={module.codeChallenge.starterCode}
                  height="300px"
                  readOnly={false}
                  showRunButton={true}
                  onRun={() => setChallengeRun(true)}
                />
                {!challengeRun && (
                  <p className="text-xs text-yellow-400/70 flex items-center gap-1.5 -mt-1">
                    <span>▶</span> Run your code above to unlock the quiz
                  </p>
                )}

                {/* Hints section */}
                {module.codeChallenge.hints.length > 0 && (
                  <div className="rounded-xl border border-white/10 overflow-hidden">
                    <button
                      onClick={() => setHintsOpen((o) => !o)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-space-800/60 hover:bg-space-800 transition-colors duration-150 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Lightbulb size={15} className="text-yellow-400" />
                        <span className="text-white/70 text-sm font-semibold">
                          Show Hints ({revealedHints} / {module.codeChallenge.hints.length} revealed)
                        </span>
                      </div>
                      {hintsOpen ? (
                        <ChevronUp size={15} className="text-white/40 flex-shrink-0" />
                      ) : (
                        <ChevronDown size={15} className="text-white/40 flex-shrink-0" />
                      )}
                    </button>

                    <AnimatePresence>
                      {hintsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 py-4 space-y-3 bg-space-900/40">
                            {/* Already revealed hints */}
                            {module.codeChallenge.hints.slice(0, revealedHints).map((hint, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-start gap-2.5 p-3 rounded-lg bg-yellow-400/8 border border-yellow-400/15"
                              >
                                <span className="text-yellow-400 font-bold text-sm flex-shrink-0">
                                  💡 {i + 1}.
                                </span>
                                <span className="text-white/70 text-sm">{hint}</span>
                              </motion.div>
                            ))}

                            {/* Reveal next hint button */}
                            {revealedHints < module.codeChallenge.hints.length && (
                              <button
                                onClick={revealNextHint}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-yellow-400/30 text-yellow-400 text-sm font-semibold hover:bg-yellow-400/10 transition-colors duration-150"
                              >
                                <Lightbulb size={14} />
                                Reveal Hint {revealedHints + 1}
                              </button>
                            )}

                            {revealedHints === module.codeChallenge.hints.length && (
                              <p className="text-white/30 text-xs italic">
                                All hints revealed. You&apos;ve got this!
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* CTA: Take the quiz */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                  <motion.button
                    whileTap={quizUnlocked ? { scale: 0.97 } : {}}
                    onClick={quizUnlocked ? () => router.push(`/module/${id}/quiz`) : undefined}
                    className={[
                      'flex items-center gap-2 px-6 py-3 rounded-xl font-extrabold text-sm transition-all duration-200',
                      quizUnlocked
                        ? 'bg-gradient-to-r from-brand-500 to-cyan-500 text-white shadow-xl shadow-brand-500/30 hover:opacity-90 cursor-pointer'
                        : 'bg-white/8 text-white/30 cursor-not-allowed',
                    ].join(' ')}
                  >
                    <Trophy size={16} />
                    {quizUnlocked ? "I'm done! Take the Quiz →" : '🔒 Run your code to unlock quiz'}
                  </motion.button>
                  <p className="text-white/30 text-xs">
                    Don&apos;t worry — you can come back and try the challenge again any time.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── All done but challenge not shown yet — teaser ──────────────── */}
          {allDone && !showChallenge && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="text-4xl mb-3 animate-float">🎉</div>
              <p className="text-white/50 text-sm">Loading your code challenge...</p>
            </motion.div>
          )}

          {/* ── Navigation hint at bottom ─────────────────────────────────── */}
          {!allDone && (
            <div className="flex items-center justify-between pt-4 border-t border-white/8">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm text-white/30 hover:text-white/60 transition-colors"
              >
                <ChevronLeft size={15} />
                Dashboard
              </Link>
              <p className="text-white/25 text-xs text-right">
                Complete all sections to unlock the quiz
              </p>
            </div>
          )}

          {allDone && (
            <div className="flex items-center justify-between pt-4 border-t border-white/8">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm text-white/30 hover:text-white/60 transition-colors"
              >
                <ChevronLeft size={15} />
                Dashboard
              </Link>
              {quizUnlocked ? (
                <button
                  onClick={() => router.push(`/module/${id}/quiz`)}
                  className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 font-semibold transition-colors"
                >
                  Take the Quiz
                  <ChevronRight size={15} />
                </button>
              ) : (
                <span className="text-white/30 text-xs">🔒 Complete the code challenge to unlock</span>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
