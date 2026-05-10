'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Confetti from 'react-confetti';
import { ASSESSMENT_QUESTIONS, getStartingModule } from '@/data/assessment';
import { useGameStore } from '@/lib/store';

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = 'intro' | 'quiz' | 'results';

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_QUESTIONS = ASSESSMENT_QUESTIONS.length; // 20
const MAX_SCORE = ASSESSMENT_QUESTIONS.reduce((sum, q) => sum + q.points, 0);

const DIFFICULTY_BADGE: Record<
  string,
  { label: string; classes: string }
> = {
  basic:        { label: 'Basic',        classes: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' },
  intermediate: { label: 'Intermediate', classes: 'bg-blue-500/20   text-blue-400   border border-blue-500/40'     },
  advanced:     { label: 'Advanced',     classes: 'bg-violet-500/20  text-violet-400  border border-violet-500/40'  },
  expert:       { label: 'Expert',       classes: 'bg-amber-500/20   text-amber-400   border border-amber-500/40'   },
};

function levelRecommendationText(pct: number): string {
  if (pct < 0.30) return "You've got solid Python basics! We'll start you with some cool new tricks.";
  if (pct < 0.55) return "Nice work! You're ready for intermediate Python.";
  if (pct < 0.75) return "Impressive! You already know the intermediate stuff.";
  if (pct < 0.90) return "Wow! Advanced territory for you.";
  return "Python ninja! Jumping straight to expert topics.";
}

function getStartingModuleTitle(id: string): string {
  const MAP: Record<string, string> = {
    'supercharged-variables': 'Supercharged Variables',
    'function-superpowers':   'Function Superpowers',
    'error-defender':         'Error Defender',
    'comprehension-magic':    'Comprehension Magic',
    'decorator-workshop':     'Decorator Workshop',
  };
  return MAP[id] ?? id;
}

// ─── Window size hook (avoids SSR issues) ─────────────────────────────────────

function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function update() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return size;
}

// ─── Intro Phase ──────────────────────────────────────────────────────────────

function IntroPhase({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center min-h-screen px-4 py-12"
    >
      <div className="w-full max-w-lg">
        {/* Card */}
        <div
          className="relative rounded-3xl overflow-hidden border border-white/10
                     bg-space-800 shadow-2xl"
        >
          {/* Top gradient band */}
          <div
            className="h-2 w-full"
            style={{
              background:
                'linear-gradient(90deg,#7c3aed 0%,#a78bfa 40%,#22d3ee 80%,#fbbf24 100%)',
            }}
          />

          <div className="px-8 pt-8 pb-10 flex flex-col items-center text-center">
            {/* Icon */}
            <motion.div
              initial={{ rotate: -12, scale: 0.7 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
              className="text-6xl mb-5 select-none"
              aria-hidden="true"
            >
              🧪
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.5 }}
              className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight"
            >
              Python Level Check!
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.5 }}
              className="text-white/60 text-base sm:text-lg max-w-sm mb-8 leading-relaxed"
            >
              Answer{' '}
              <span className="text-violet-400 font-semibold">20 questions</span>{' '}
              to find your perfect starting point. Don&apos;t worry — there are{' '}
              <span className="text-emerald-400 font-semibold">no wrong answers</span>,
              we just want to find the right level for{' '}
              <span className="text-white font-bold">YOU!</span>
            </motion.p>

            {/* Benefits list */}
            <motion.ul
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.5 }}
              className="w-full max-w-xs mb-8 space-y-3"
              aria-label="What you'll get"
            >
              {[
                { icon: '🗺️', text: 'A personalised learning path' },
                { icon: '⏩', text: 'Skip what you already know' },
                { icon: '🎯', text: 'Start right at your level' },
              ].map(({ icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-3 text-left
                             bg-white/5 border border-white/8 rounded-xl px-4 py-3"
                >
                  <span className="text-xl select-none" aria-hidden="true">
                    {icon}
                  </span>
                  <span className="text-white/80 text-sm font-medium">{text}</span>
                </li>
              ))}
            </motion.ul>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.4 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={onStart}
              className="relative inline-flex items-center gap-2 px-8 py-4
                         rounded-2xl font-bold text-lg text-white
                         shadow-lg shadow-violet-500/30
                         focus:outline-none focus-visible:ring-2
                         focus-visible:ring-violet-400 focus-visible:ring-offset-2
                         focus-visible:ring-offset-space-800"
              style={{
                background:
                  'linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#06b6d4 100%)',
              }}
            >
              Let&apos;s Go!
              <span aria-hidden="true">→</span>
            </motion.button>

            {/* Quick note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mt-5 text-white/30 text-xs"
            >
              Takes about 5 minutes · No account needed to start
            </motion.p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Quiz Phase ───────────────────────────────────────────────────────────────

interface QuizPhaseProps {
  currentQ: number;
  answers: Record<number, number>;
  onAnswer: (optionIndex: number) => void;
  onNext: () => void;
  runningScore: number;
}

function QuizPhase({
  currentQ,
  answers,
  onAnswer,
  onNext,
  runningScore,
}: QuizPhaseProps) {
  const question = ASSESSMENT_QUESTIONS[currentQ];
  const selectedAnswer = answers[currentQ];
  const hasAnswered = selectedAnswer !== undefined;
  const diffCfg = DIFFICULTY_BADGE[question.difficulty] ?? DIFFICULTY_BADGE['basic'];

  return (
    <div className="flex flex-col min-h-screen px-4 py-6">
      {/* ── Progress bar ──────────────────────────────────────────────────── */}
      <div className="w-full max-w-2xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/60 text-sm font-medium">
            Question{' '}
            <span className="text-white font-bold">{currentQ + 1}</span>{' '}
            of {TOTAL_QUESTIONS}
          </span>

          {/* Running XP preview */}
          <span
            className="text-sm font-semibold tabular-nums"
            style={{ color: '#fbbf24', textShadow: '0 0 8px rgba(251,191,36,0.5)' }}
          >
            ⚡ {runningScore} XP so far!
          </span>
        </div>

        {/* Bar track */}
        <div className="w-full h-3 rounded-full bg-space-700 border border-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background:
                'linear-gradient(90deg,#7c3aed 0%,#a78bfa 50%,#22d3ee 100%)',
            }}
            initial={false}
            animate={{ width: `${((currentQ) / TOTAL_QUESTIONS) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* ── Question card ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`q-${currentQ}`}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Card */}
              <div
                className="rounded-3xl border border-white/10 bg-space-800
                           shadow-2xl overflow-hidden"
              >
                {/* Top accent */}
                <div
                  className="h-1.5 w-full"
                  style={{
                    background:
                      'linear-gradient(90deg,#7c3aed,#a78bfa,#22d3ee)',
                  }}
                />

                <div className="px-6 sm:px-8 pt-6 pb-8">
                  {/* Difficulty badge + question number */}
                  <div className="flex items-center gap-3 mb-5">
                    <span
                      className={`inline-block rounded-full px-3 py-0.5 text-xs
                                  font-bold uppercase tracking-wider ${diffCfg.classes}`}
                    >
                      {diffCfg.label}
                    </span>
                    <span className="text-white/30 text-xs">
                      {question.points} point{question.points !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Question text */}
                  <p className="text-white text-lg sm:text-xl font-semibold leading-snug mb-7">
                    {question.question}
                  </p>

                  {/* Options */}
                  <div className="space-y-3" role="radiogroup" aria-label="Answer options">
                    {question.options.map((option, optIdx) => {
                      const isSelected = selectedAnswer === optIdx;
                      return (
                        <motion.button
                          key={optIdx}
                          whileHover={!hasAnswered ? { scale: 1.015 } : {}}
                          whileTap={!hasAnswered ? { scale: 0.985 } : {}}
                          onClick={() => {
                            if (!hasAnswered) onAnswer(optIdx);
                          }}
                          role="radio"
                          aria-checked={isSelected}
                          aria-label={`Option ${optIdx + 1}: ${option}`}
                          className={[
                            'w-full text-left px-5 py-4 rounded-2xl border',
                            'transition-all duration-200 font-medium text-sm sm:text-base',
                            'focus:outline-none focus-visible:ring-2',
                            'focus-visible:ring-violet-400',
                            hasAnswered && !isSelected
                              ? 'opacity-50 cursor-default border-white/8 bg-white/3 text-white/50'
                              : isSelected
                              ? 'border-violet-500 bg-violet-500/20 text-white shadow-lg shadow-violet-500/20 cursor-default'
                              : 'border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/8 hover:text-white cursor-pointer',
                          ].join(' ')}
                        >
                          <span className="flex items-center gap-3">
                            {/* Option letter */}
                            <span
                              className={[
                                'flex-shrink-0 w-7 h-7 rounded-full flex items-center',
                                'justify-center text-xs font-bold border',
                                isSelected
                                  ? 'bg-violet-500 border-violet-400 text-white'
                                  : 'bg-white/8 border-white/15 text-white/50',
                              ].join(' ')}
                              aria-hidden="true"
                            >
                              {isSelected ? '✓' : String.fromCharCode(65 + optIdx)}
                            </span>
                            {option}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Next button */}
                  <div className="mt-7 flex justify-end">
                    <motion.button
                      whileHover={hasAnswered ? { scale: 1.04 } : {}}
                      whileTap={hasAnswered ? { scale: 0.97 } : {}}
                      onClick={hasAnswered ? onNext : undefined}
                      disabled={!hasAnswered}
                      className={[
                        'inline-flex items-center gap-2 px-7 py-3',
                        'rounded-2xl font-bold text-base transition-all duration-200',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400',
                        hasAnswered
                          ? 'text-white shadow-lg shadow-violet-500/30 cursor-pointer'
                          : 'opacity-35 text-white/60 cursor-not-allowed',
                      ].join(' ')}
                      style={
                        hasAnswered
                          ? {
                              background:
                                'linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#06b6d4 100%)',
                            }
                          : { background: 'rgba(255,255,255,0.06)' }
                      }
                      aria-label={
                        currentQ < TOTAL_QUESTIONS - 1
                          ? 'Next question'
                          : 'See results'
                      }
                    >
                      {currentQ < TOTAL_QUESTIONS - 1 ? 'Next' : 'See Results'}
                      <span aria-hidden="true">→</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Results Phase ────────────────────────────────────────────────────────────

interface ResultsPhaseProps {
  score: number;
  startingModuleId: string;
  onBeginJourney: () => void;
}

function ResultsPhase({ score, startingModuleId, onBeginJourney }: ResultsPhaseProps) {
  const { width, height } = useWindowSize();
  const pct = MAX_SCORE > 0 ? score / MAX_SCORE : 0;
  const pctDisplay = Math.round(pct * 100);
  const recommendationText = levelRecommendationText(pct);
  const moduleTitle = getStartingModuleTitle(startingModuleId);

  return (
    <>
      {/* Confetti — runs for ~8 seconds then stops */}
      {width > 0 && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={280}
          recycle={false}
          gravity={0.18}
          colors={['#7c3aed', '#a855f7', '#22d3ee', '#fbbf24', '#f472b6', '#34d399']}
        />
      )}

      <motion.div
        key="results"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col items-center justify-center min-h-screen px-4 py-12"
      >
        <div className="w-full max-w-lg">
          {/* Card */}
          <div
            className="relative rounded-3xl border border-white/10 bg-space-800
                       shadow-2xl overflow-hidden"
          >
            {/* Top gradient */}
            <div
              className="h-2 w-full"
              style={{
                background:
                  'linear-gradient(90deg,#7c3aed 0%,#a78bfa 40%,#22d3ee 80%,#fbbf24 100%)',
              }}
            />

            <div className="px-7 sm:px-10 pt-8 pb-10 flex flex-col items-center text-center">
              {/* Celebration emoji */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.15 }}
                className="text-6xl mb-4 select-none"
                aria-hidden="true"
              >
                🎉
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.45 }}
                className="text-3xl sm:text-4xl font-extrabold text-white mb-1"
              >
                Assessment Complete!
              </motion.h1>

              {/* Score */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="text-white/50 text-base mb-6"
              >
                <span className="text-gold-400 font-bold text-2xl">{score}</span>
                <span className="text-white/40 text-xl"> / {MAX_SCORE} points</span>
              </motion.p>

              {/* Percentage bar */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="w-full mb-2"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white/40 text-xs">0%</span>
                  <span className="text-white font-bold text-sm">{pctDisplay}%</span>
                  <span className="text-white/40 text-xs">100%</span>
                </div>
                <div className="w-full h-4 rounded-full bg-space-700 border border-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background:
                        'linear-gradient(90deg,#7c3aed 0%,#a78bfa 50%,#fbbf24 100%)',
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${pctDisplay}%` }}
                    transition={{ duration: 1.0, delay: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                </div>
              </motion.div>

              {/* Recommendation text */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.4 }}
                className="w-full bg-violet-500/10 border border-violet-500/25
                           rounded-2xl px-5 py-4 mt-4 mb-4 text-left"
              >
                <p className="text-violet-300 text-sm font-medium leading-relaxed">
                  {recommendationText}
                </p>
              </motion.div>

              {/* First module */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.4 }}
                className="w-full flex items-center gap-3 bg-white/5 border border-white/10
                           rounded-2xl px-5 py-4 mb-6 text-left"
              >
                <span className="text-2xl select-none" aria-hidden="true">🚀</span>
                <div>
                  <p className="text-white/40 text-xs font-medium mb-0.5 uppercase tracking-wider">
                    Your first module
                  </p>
                  <p className="text-white font-semibold text-sm">{moduleTitle}</p>
                </div>
              </motion.div>

              {/* +50 XP Bonus */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.75, type: 'spring', stiffness: 260, damping: 18 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                           bg-amber-500/15 border border-amber-500/30 mb-7"
              >
                <span className="text-xl select-none" aria-hidden="true">⚡</span>
                <span
                  className="font-bold text-base"
                  style={{
                    color: '#fbbf24',
                    textShadow: '0 0 10px rgba(251,191,36,0.55)',
                  }}
                >
                  +50 XP Bonus
                </span>
                <span className="text-white/40 text-sm">for completing assessment</span>
              </motion.div>

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.4 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={onBeginJourney}
                className="w-full inline-flex items-center justify-center gap-2
                           px-8 py-4 rounded-2xl font-bold text-lg text-white
                           shadow-lg shadow-violet-500/30
                           focus:outline-none focus-visible:ring-2
                           focus-visible:ring-violet-400"
                style={{
                  background:
                    'linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#06b6d4 100%)',
                }}
              >
                Begin My Journey!
                <span aria-hidden="true">→</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AssessmentPage() {
  const router = useRouter();
  const { completeAssessment, addXP } = useGameStore();

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);
  const [startingModuleId, setStartingModuleId] = useState('');

  // Running score: sum of points for correctly answered questions so far
  const runningScore = Object.entries(answers).reduce((acc, [qIdxStr, chosenIdx]) => {
    const qIdx = Number(qIdxStr);
    const q = ASSESSMENT_QUESTIONS[qIdx];
    if (q && chosenIdx === q.correctIndex) {
      return acc + q.points;
    }
    return acc;
  }, 0);

  // Handle option selection
  const handleAnswer = useCallback((optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentQ]: optionIndex }));
  }, [currentQ]);

  // Handle "Next" button
  const handleNext = useCallback(() => {
    if (currentQ < TOTAL_QUESTIONS - 1) {
      setCurrentQ((prev) => prev + 1);
    } else {
      // Final question — answers state already contains the last pick (set by handleAnswer).
      // Compute total score by walking all answers.
      const totalScore = Object.entries(answers).reduce((acc, [qIdxStr, chosenIdx]) => {
        const qIdx = Number(qIdxStr);
        const q = ASSESSMENT_QUESTIONS[qIdx];
        if (q && chosenIdx === q.correctIndex) {
          return acc + q.points;
        }
        return acc;
      }, 0);

      const modId = getStartingModule(totalScore, MAX_SCORE);
      setScore(totalScore);
      setStartingModuleId(modId);
      setPhase('results');
    }
  }, [currentQ, answers]);

  // Handle "Begin My Journey" button
  const handleBeginJourney = useCallback(() => {
    completeAssessment(score, MAX_SCORE, startingModuleId);
    addXP(50);
    router.push('/dashboard');
  }, [score, startingModuleId, completeAssessment, addXP, router]);

  return (
    <div className="min-h-screen bg-space-900">
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <IntroPhase key="intro" onStart={() => setPhase('quiz')} />
        )}

        {phase === 'quiz' && (
          <motion.div key="quiz" className="min-h-screen">
            <QuizPhase
              currentQ={currentQ}
              answers={answers}
              onAnswer={handleAnswer}
              onNext={handleNext}
              runningScore={runningScore}
            />
          </motion.div>
        )}

        {phase === 'results' && (
          <ResultsPhase
            key="results"
            score={score}
            startingModuleId={startingModuleId}
            onBeginJourney={handleBeginJourney}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
