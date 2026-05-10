'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Trophy,
  Star,
  Sparkles,
  RotateCcw,
  Home,
} from 'lucide-react';
import { getModuleById, getNextModule } from '@/data/modules';
import { useGameStore } from '@/lib/store';
import { starsFromScore, xpFromQuizScore } from '@/lib/utils';
import { syncToLeaderboard } from '@/lib/supabase';

// react-confetti is client-only
const ReactConfetti = dynamic(() => import('react-confetti'), { ssr: false });

// ─── Star rating display ─────────────────────────────────────────────────────

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex items-center gap-2" aria-label={`${stars} out of 3 stars`}>
      {[1, 2, 3].map((n) => (
        <motion.span
          key={n}
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 15,
            delay: n * 0.15,
          }}
          className={`text-4xl ${n <= stars ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'text-white/15'}`}
        >
          ★
        </motion.span>
      ))}
    </div>
  );
}

// ─── Question option button ───────────────────────────────────────────────────

interface OptionProps {
  text: string;
  index: number;
  selected: boolean;
  correct: boolean;
  revealed: boolean;
  onClick: () => void;
}

function OptionButton({ text, index, selected, correct, revealed, onClick }: OptionProps) {
  const letters = ['A', 'B', 'C', 'D'];

  let bg        = 'bg-space-800/70 hover:bg-space-700/80 border-white/10 hover:border-white/20 cursor-pointer';
  let textColor = 'text-white/80';
  let badge     = 'bg-white/10 text-white/50';

  if (revealed) {
    if (correct) {
      bg        = 'bg-green-400/15 border-green-400/50 cursor-default';
      textColor = 'text-green-300';
      badge     = 'bg-green-400/30 text-green-300';
    } else if (selected && !correct) {
      bg        = 'bg-red-400/15 border-red-400/50 cursor-default';
      textColor = 'text-red-300';
      badge     = 'bg-red-400/30 text-red-300';
    } else {
      bg        = 'bg-space-800/40 border-white/5 cursor-default opacity-50';
      textColor = 'text-white/40';
      badge     = 'bg-white/5 text-white/25';
    }
  } else if (selected) {
    bg        = 'bg-brand-500/20 border-brand-400/50 cursor-pointer';
    textColor = 'text-brand-300';
    badge     = 'bg-brand-500/30 text-brand-300';
  }

  return (
    <motion.button
      whileHover={!revealed ? { scale: 1.01 } : {}}
      whileTap={!revealed ? { scale: 0.99 } : {}}
      onClick={!revealed ? onClick : undefined}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-200 text-left ${bg}`}
    >
      <span
        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${badge}`}
      >
        {letters[index]}
      </span>
      <span className={`text-sm sm:text-base font-medium leading-snug ${textColor}`}>{text}</span>
      {revealed && correct && (
        <CheckCircle2 size={18} className="ml-auto flex-shrink-0 text-green-400" />
      )}
      {revealed && selected && !correct && (
        <XCircle size={18} className="ml-auto flex-shrink-0 text-red-400" />
      )}
    </motion.button>
  );
}

// ─── Quiz page ───────────────────────────────────────────────────────────────

export default function QuizPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const module     = getModuleById(id);
  const nextModule = getNextModule(id);
  const completeModule = useGameStore((s) => s.completeModule);

  // quiz state
  const [currentQ,       setCurrentQ]       = useState(0);
  const [answers,        setAnswers]         = useState<Record<number, number>>({});
  const [selectedAnswer, setSelectedAnswer]  = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [phase,          setPhase]           = useState<'quiz' | 'results'>('quiz');
  const [score,          setScore]           = useState(0);

  // window size for confetti
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    function update() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── Not found ───────────────────────────────────────────────────────────────

  if (!module) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-white mb-2">Module Not Found</h1>
          <p className="text-white/50 mb-8">
            We couldn&apos;t find a module with the id{' '}
            <code className="text-brand-400 bg-brand-400/10 px-1.5 py-0.5 rounded">{id}</code>.
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

  // ── Quiz helpers ─────────────────────────────────────────────────────────────

  const questions = module.quiz;
  const total     = questions.length;
  const question  = questions[currentQ];

  function selectAnswer(idx: number) {
    if (showExplanation) return;
    setSelectedAnswer(idx);
    setAnswers((prev) => ({ ...prev, [currentQ]: idx }));
    setShowExplanation(true);
  }

  function nextQuestion() {
    if (currentQ < total - 1) {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Calculate final score
      const correct = questions.reduce((sum, q, i) => {
        const chosen = i === currentQ ? selectedAnswer : answers[i];
        return sum + (chosen === q.correctIndex ? 1 : 0);
      }, 0);
      const pct = Math.round((correct / total) * 100);
      setScore(pct);
      setPhase('results');
    }
  }

  // ── Results helpers ─────────────────────────────────────────────────────────

  const stars    = starsFromScore(score);
  const xpEarned = xpFromQuizScore(module.xpReward, score);

  const correctCount = questions.reduce((sum, q, i) => {
    const chosen = i === currentQ && phase === 'results' ? selectedAnswer : answers[i];
    return sum + (chosen === q.correctIndex ? 1 : 0);
  }, 0);

  function resultMessage() {
    if (score === 100) return { emoji: '🏆', text: 'PERFECT! You\'re a Python genius!', color: 'text-yellow-300' };
    if (score >= 80)  return { emoji: '🌟', text: 'Excellent work!',                  color: 'text-cyan-300'   };
    if (score >= 60)  return { emoji: '💪', text: 'Good job! Keep it up!',            color: 'text-green-300'  };
    return                   { emoji: '📚', text: 'Nice try! Review the lesson and try again.', color: 'text-orange-300' };
  }

  function handleFinish() {
    completeModule(id, score, stars, xpEarned);
    // Fire-and-forget sync — only uploads if the user is signed in
    const s = useGameStore.getState();
    syncToLeaderboard({
      username: s.username,
      avatar: s.avatar,
      xp: s.xp,
      level: s.level,
      streak: s.streak,
      completedModulesCount: Object.keys(s.completedModules).length,
    });
    if (nextModule) {
      router.push(`/module/${nextModule.id}`);
    } else {
      router.push('/dashboard');
    }
  }

  function handleRetry() {
    setCurrentQ(0);
    setAnswers({});
    setSelectedAnswer(null);
    setShowExplanation(false);
    setPhase('quiz');
    setScore(0);
  }

  // ─── RESULTS PHASE ──────────────────────────────────────────────────────────

  if (phase === 'results') {
    const msg = resultMessage();
    const showConfetti = score >= 70;

    return (
      <div className="min-h-screen pt-16 pb-24 flex flex-col items-center justify-center px-4">
        {showConfetti && (
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={320}
            gravity={0.18}
            colors={['#a78bfa', '#22d3ee', '#fbbf24', '#34d399', '#f472b6']}
          />
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="w-full max-w-lg"
        >
          <div className="rounded-3xl border border-white/10 bg-space-800/80 backdrop-blur-md overflow-hidden shadow-2xl shadow-black/40">

            {/* Gradient top banner */}
            <div className={`h-2 bg-gradient-to-r ${module.color}`} />

            <div className="p-8 space-y-7">

              {/* Module identity mini */}
              <div className="flex items-center gap-3">
                <span className="text-2xl">{module.icon}</span>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider font-semibold">Quiz Complete</p>
                  <p className="text-white font-bold text-sm">{module.title}</p>
                </div>
              </div>

              {/* Big result emoji + message */}
              <div className="text-center space-y-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.15 }}
                  className="text-6xl"
                >
                  {msg.emoji}
                </motion.div>
                <p className={`font-extrabold text-xl sm:text-2xl ${msg.color}`}>
                  {msg.text}
                </p>
              </div>

              {/* Stars */}
              <div className="flex justify-center">
                <StarRating stars={stars} />
              </div>

              {/* Score card */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-space-900/60 border border-white/8 p-4 text-center">
                  <p className="text-white/40 text-xs mb-1 font-semibold uppercase tracking-wider">Score</p>
                  <p className="text-white font-extrabold text-2xl tabular-nums">
                    {correctCount} / {total}
                  </p>
                  <p className="text-white/50 text-sm">{score}%</p>
                </div>
                <div className="rounded-2xl bg-yellow-400/8 border border-yellow-400/20 p-4 text-center">
                  <p className="text-yellow-400/60 text-xs mb-1 font-semibold uppercase tracking-wider">XP Earned</p>
                  <motion.p
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 18 }}
                    className="text-gold-400 font-extrabold text-2xl tabular-nums"
                  >
                    +{xpEarned}
                  </motion.p>
                  <p className="text-yellow-400/50 text-sm">XP</p>
                </div>
              </div>

              {/* Achievements note */}
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-brand-500/10 border border-brand-400/20">
                <Sparkles size={16} className="text-brand-400 flex-shrink-0" />
                <p className="text-brand-300 text-sm">
                  Check your <strong>achievements</strong> for new unlocks!
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {score < 60 ? (
                  <button
                    onClick={handleRetry}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 text-white font-semibold text-sm transition-colors duration-150"
                  >
                    <RotateCcw size={15} />
                    Try Again
                  </button>
                ) : (
                  <Link
                    href={`/module/${id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 text-white font-semibold text-sm transition-colors duration-150"
                  >
                    <ChevronLeft size={15} />
                    Review Lesson
                  </Link>
                )}

                <button
                  onClick={handleFinish}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 hover:opacity-90 transition-opacity duration-150"
                >
                  {nextModule ? (
                    <>
                      Next Module
                      <ChevronRight size={15} />
                    </>
                  ) : (
                    <>
                      <Home size={15} />
                      Dashboard
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── QUIZ PHASE ─────────────────────────────────────────────────────────────

  const progressPct = ((currentQ + (showExplanation ? 1 : 0)) / total) * 100;

  return (
    <div className="min-h-screen pt-16 pb-24 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl mx-auto py-8 space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <Link
              href={`/module/${id}`}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/8 hover:bg-white/14 border border-white/10 transition-colors duration-150"
              aria-label="Back to module"
            >
              <ChevronLeft size={17} className="text-white/60" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{module.icon}</span>
                <span className="text-white font-bold text-sm">{module.title}</span>
              </div>
              <p className="text-white/40 text-xs">Module Quiz</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-white font-extrabold text-xl tabular-nums">
              {currentQ + 1}
            </span>
            <span className="text-white/30 text-xl"> / {total}</span>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-space-700 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${module.color}`}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Question card with slide animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-2xl border border-white/10 bg-space-800/70 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/30"
          >
            {/* Question number badge + question */}
            <div className="px-6 py-6 border-b border-white/8">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold border border-brand-400/20">
                  Question {currentQ + 1}
                </span>
                {showExplanation && selectedAnswer === question.correctIndex && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-400/15 text-green-400 text-xs font-bold border border-green-400/20">
                    <CheckCircle2 size={11} />
                    Correct!
                  </span>
                )}
                {showExplanation && selectedAnswer !== question.correctIndex && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-400/15 text-red-400 text-xs font-bold border border-red-400/20">
                    <XCircle size={11} />
                    Incorrect
                  </span>
                )}
              </div>
              <p className="text-white font-semibold text-base sm:text-lg leading-snug">
                {question.question}
              </p>
            </div>

            {/* Options */}
            <div className="px-6 py-5 space-y-3">
              {question.options.map((opt, idx) => (
                <OptionButton
                  key={idx}
                  text={opt}
                  index={idx}
                  selected={selectedAnswer === idx}
                  correct={idx === question.correctIndex}
                  revealed={showExplanation}
                  onClick={() => selectAnswer(idx)}
                />
              ))}
            </div>

            {/* Explanation panel */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="overflow-hidden border-t border-white/8"
                >
                  <div
                    className={[
                      'px-6 py-5',
                      selectedAnswer === question.correctIndex
                        ? 'bg-green-400/5'
                        : 'bg-red-400/5',
                    ].join(' ')}
                  >
                    <div className="flex items-start gap-2.5 mb-3">
                      {selectedAnswer === question.correctIndex ? (
                        <CheckCircle2 size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        {selectedAnswer !== question.correctIndex && (
                          <p className="text-white/60 text-xs mb-1.5">
                            The correct answer was:{' '}
                            <span className="text-green-400 font-semibold">
                              {question.options[question.correctIndex]}
                            </span>
                          </p>
                        )}
                        <p
                          className={[
                            'text-sm leading-relaxed',
                            selectedAnswer === question.correctIndex
                              ? 'text-green-200/80'
                              : 'text-red-200/80',
                          ].join(' ')}
                        >
                          {question.explanation}
                        </p>
                      </div>
                    </div>

                    {/* Next / Finish button */}
                    <div className="flex justify-end mt-4">
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={nextQuestion}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 hover:opacity-90 transition-opacity duration-150"
                      >
                        {currentQ < total - 1 ? (
                          <>
                            Next Question
                            <ChevronRight size={15} />
                          </>
                        ) : (
                          <>
                            See Results
                            <Trophy size={15} />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Prompt to select if not yet selected */}
            {!showExplanation && (
              <div className="px-6 pb-5 flex items-center gap-2 text-white/25 text-xs">
                <Star size={12} className="flex-shrink-0" />
                Select an answer above
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Question dots */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {questions.map((_, idx) => {
            const answered = idx in answers || (idx === currentQ && showExplanation);
            const correct  = answered && (idx === currentQ
              ? selectedAnswer === questions[idx].correctIndex
              : answers[idx] === questions[idx].correctIndex);
            const isCurrent = idx === currentQ;

            return (
              <div
                key={idx}
                className={[
                  'w-3 h-3 rounded-full transition-all duration-300',
                  isCurrent && !showExplanation
                    ? 'bg-brand-400 scale-125'
                    : answered && correct
                    ? 'bg-green-400'
                    : answered && !correct
                    ? 'bg-red-400'
                    : 'bg-white/15',
                ].join(' ')}
                aria-label={`Question ${idx + 1}`}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
}
