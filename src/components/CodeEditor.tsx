'use client';

import { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Copy, Check, Loader2, Terminal, X, AlertTriangle } from 'lucide-react';
import { usePyodide } from '@/hooks/usePyodide';

// ─── Dynamic Monaco import (SSR disabled) ────────────────────────────────────

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <MonacoSkeleton />,
});

// ─── Monaco loading skeleton ──────────────────────────────────────────────────

function MonacoSkeleton() {
  return (
    <div
      className="w-full rounded-b-xl overflow-hidden bg-[#1e1e1e]"
      style={{ height: '300px' }}
      aria-label="Loading code editor..."
    >
      {/* Fake line numbers + shimmer lines */}
      <div className="flex h-full pt-4 px-0">
        {/* Gutter */}
        <div className="w-10 h-full bg-[#1e1e1e] flex flex-col gap-3 pt-1 px-2 flex-shrink-0">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-3 rounded bg-white/5"
              style={{ width: `${Math.random() * 10 + 14}px` }}
            />
          ))}
        </div>
        {/* Code area shimmer */}
        <div className="flex-1 flex flex-col gap-3 pt-1 px-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-3 rounded"
              style={{
                width: `${[60, 80, 45, 72, 55, 88, 40, 65, 78, 50][i % 10]}%`,
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s linear infinite',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CodeEditorProps {
  initialCode: string;
  height?: string;
  readOnly?: boolean;
  onCodeChange?: (code: string) => void;
  showRunButton?: boolean;
  title?: string;
}

// ─── Output panel ─────────────────────────────────────────────────────────────

interface OutputPanelProps {
  output: string;
  error: string | null;
  onClear: () => void;
}

function OutputPanel({ output, error, onClear }: OutputPanelProps) {
  const hasContent = output.trim().length > 0 || (error && error.trim().length > 0);

  return (
    <motion.div
      key="output-panel"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mt-2 rounded-xl overflow-hidden border border-white/8 bg-black/80"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/8 bg-black/60">
        <div className="flex items-center gap-1.5">
          <Terminal size={12} className="text-white/40" aria-hidden="true" />
          <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
            Output
          </span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-[11px] text-white/35
                     hover:text-white/70 transition-colors duration-150
                     focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-500
                     rounded px-1 py-0.5"
          aria-label="Clear output"
        >
          <X size={11} strokeWidth={2.5} aria-hidden="true" />
          Clear
        </button>
      </div>

      {/* Content */}
      <div
        className="font-mono text-sm px-3 py-3 min-h-[64px] max-h-[240px] overflow-y-auto
                   scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
        aria-live="polite"
        aria-atomic="true"
      >
        {!hasContent && (
          <span className="text-white/20 text-xs italic select-none">
            No output yet. Run your code to see results.
          </span>
        )}

        {/* stdout */}
        {output.trim().length > 0 && (
          <pre className="text-green-400 whitespace-pre-wrap break-words leading-relaxed">
            {output}
          </pre>
        )}

        {/* stderr / error */}
        {error && error.trim().length > 0 && (
          <pre className="text-red-400 whitespace-pre-wrap break-words leading-relaxed mt-1">
            {output.trim().length > 0 && (
              <span className="text-red-500/60 text-xs block mb-1">— Error —</span>
            )}
            {error}
          </pre>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CodeEditor({
  initialCode,
  height = '300px',
  readOnly = false,
  onCodeChange,
  showRunButton = true,
  title,
}: CodeEditorProps) {
  const [code, setCode] = useState<string>(initialCode);
  const [output, setOutput] = useState<string>('');
  const [runError, setRunError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { status, runPython } = usePyodide();

  const isPyodideLoading = status === 'loading' || status === 'idle';
  const isPyodideError = status === 'error';
  const isPyodideReady = status === 'ready';

  // ── Editor change handler ───────────────────────────────────────────────────

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      const newCode = value ?? '';
      setCode(newCode);
      onCodeChange?.(newCode);
    },
    [onCodeChange]
  );

  // ── Run code ────────────────────────────────────────────────────────────────

  const handleRun = useCallback(async () => {
    if (!isPyodideReady || isRunning) return;
    setIsRunning(true);
    setShowOutput(true);
    setOutput('');
    setRunError(null);

    try {
      const result = await runPython(code);
      setOutput(result.output ?? '');
      setRunError(result.error ?? null);
    } catch (err: unknown) {
      setRunError(
        err instanceof Error ? err.message : 'An unexpected error occurred.'
      );
    } finally {
      setIsRunning(false);
    }
  }, [isPyodideReady, isRunning, runPython, code]);

  // ── Copy code ───────────────────────────────────────────────────────────────

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available — silently ignore
    }
  }, [code]);

  // ── Clear output ────────────────────────────────────────────────────────────

  const handleClearOutput = useCallback(() => {
    setOutput('');
    setRunError(null);
    setShowOutput(false);
  }, []);

  // ── Keyboard shortcut: Ctrl/Cmd + Enter to run ──────────────────────────────

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    },
    [handleRun]
  );

  // ─────────────────────────────────────────────────────────────────────────────

  const runButtonDisabled = !isPyodideReady || isRunning || readOnly;

  return (
    <div className="flex flex-col w-full" onKeyDown={handleKeyDown}>
      {/* ── Optional title ─────────────────────────────────────────────────── */}
      {title && (
        <div className="mb-2">
          <span className="text-sm font-semibold text-white/70">{title}</span>
        </div>
      )}

      {/* ── Editor container ───────────────────────────────────────────────── */}
      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#1e1e1e]">
        {/* Top toolbar */}
        <div
          className="flex items-center justify-between px-3 py-1.5
                     bg-[#1e1e1e] border-b border-white/8"
        >
          {/* Language dot */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="text-[11px] text-white/30 font-mono ml-1 select-none">
              Python
            </span>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md px-2 py-1
                       text-[11px] font-medium
                       text-white/40 hover:text-white/75
                       hover:bg-white/6 transition-all duration-150
                       focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-500"
            aria-label={copied ? 'Copied!' : 'Copy code to clipboard'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1 text-emerald-400"
                >
                  <Check size={11} strokeWidth={2.5} aria-hidden="true" />
                  Copied!
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1"
                >
                  <Copy size={11} strokeWidth={2} aria-hidden="true" />
                  Copy
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Monaco editor */}
        <MonacoEditor
          height={height}
          defaultLanguage="python"
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            readOnly,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            contextmenu: !readOnly,
            folding: true,
            lineDecorationsWidth: 4,
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
          }}
          aria-label="Python code editor"
        />
      </div>

      {/* ── Bottom bar: run button + status ───────────────────────────────── */}
      {showRunButton && (
        <div className="mt-2 flex items-center justify-between gap-3">
          {/* Left: Pyodide status indicators */}
          <div className="flex items-center gap-2 min-h-[28px]">
            <AnimatePresence mode="wait">
              {isPyodideLoading && (
                <motion.div
                  key="py-loading"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5 text-xs text-white/40"
                >
                  <Loader2
                    size={12}
                    strokeWidth={2.5}
                    className="animate-spin text-brand-400"
                    aria-hidden="true"
                  />
                  <span>Loading Python engine...</span>
                </motion.div>
              )}

              {isPyodideError && (
                <motion.div
                  key="py-error"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5 text-xs text-red-400"
                >
                  <AlertTriangle size={12} strokeWidth={2.5} aria-hidden="true" />
                  <span>Python engine failed to load</span>
                </motion.div>
              )}

              {isPyodideReady && !readOnly && (
                <motion.div
                  key="py-ready"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-[11px] text-white/25 select-none"
                >
                  {/* Ctrl/Cmd+Enter shortcut hint */}
                  <kbd className="font-mono">⌘</kbd>
                  <span>/</span>
                  <kbd className="font-mono">Ctrl</kbd>
                  <span className="ml-0.5">+ Enter to run</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Run button */}
          {!readOnly && (
            <motion.button
              onClick={handleRun}
              disabled={runButtonDisabled}
              whileTap={runButtonDisabled ? {} : { scale: 0.96 }}
              className={[
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold',
                'transition-all duration-200 focus:outline-none',
                'focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2',
                'focus-visible:ring-offset-space-900',
                runButtonDisabled
                  ? 'bg-white/8 text-white/30 cursor-not-allowed'
                  : 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30',
              ].join(' ')}
              aria-label={
                isPyodideLoading
                  ? 'Python engine is loading, please wait'
                  : isRunning
                  ? 'Code is running...'
                  : 'Run code'
              }
            >
              <AnimatePresence mode="wait" initial={false}>
                {isRunning ? (
                  <motion.span
                    key="running"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2
                      size={14}
                      strokeWidth={2.5}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                    Running...
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-2"
                  >
                    <Play
                      size={14}
                      strokeWidth={2.5}
                      className="fill-current"
                      aria-hidden="true"
                    />
                    Run Code
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </div>
      )}

      {/* ── Output panel (slide-up, conditionally rendered) ───────────────── */}
      <AnimatePresence>
        {showOutput && (
          <OutputPanel
            output={output}
            error={runError}
            onClear={handleClearOutput}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
