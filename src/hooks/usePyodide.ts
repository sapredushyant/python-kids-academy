'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Global window augmentation for Pyodide singleton management
// ---------------------------------------------------------------------------
declare global {
  interface Window {
    __pyodide: PyodideInterface | undefined;
    __pyodideLoading: Promise<PyodideInterface> | undefined;
    loadPyodide: (options: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

interface PyodideInterface {
  runPython: (code: string) => unknown;
  runPythonAsync: (code: string) => Promise<unknown>;
}

// ---------------------------------------------------------------------------
// Hook types
// ---------------------------------------------------------------------------
type PyodideStatus = 'idle' | 'loading' | 'ready' | 'error';

interface UsePyodideReturn {
  status: PyodideStatus;
  runPython: (code: string) => Promise<{ output: string; error: string | null }>;
  isReady: boolean;
}

// ---------------------------------------------------------------------------
// Script loader helper
// ---------------------------------------------------------------------------
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // If the script tag already exists, skip re-inserting it
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

// ---------------------------------------------------------------------------
// Pyodide CDN constants
// ---------------------------------------------------------------------------
const PYODIDE_BASE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/';
const PYODIDE_SCRIPT_URL = `${PYODIDE_BASE_URL}pyodide.js`;

// ---------------------------------------------------------------------------
// Wrapper that redirects stdout/stderr and executes user code safely.
// The user's code is embedded inside a triple-quoted exec() call.
// ---------------------------------------------------------------------------
function buildWrappedCode(userCode: string): string {
  // Escape backslashes and triple-quotes to avoid breaking the Python string
  const escaped = userCode
    .replace(/\\/g, '\\\\')
    .replace(/"""/g, '\\"\\"\\"');

  return `import sys, io
_stdout = io.StringIO()
_stderr = io.StringIO()
sys.stdout = _stdout
sys.stderr = _stderr
try:
    exec(compile("""${escaped}""", "<string>", "exec"), {})
except Exception as e:
    sys.stderr.write(str(e))
finally:
    sys.stdout = sys.__stdout__
    sys.stderr = sys.__stderr__`;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function usePyodide(): UsePyodideReturn {
  const [status, setStatus] = useState<PyodideStatus>('idle');
  const pyodideRef = useRef<PyodideInterface | null>(null);

  // On mount: load Pyodide (or attach to already-loading singleton)
  useEffect(() => {
    let cancelled = false;

    async function initPyodide(): Promise<void> {
      // Already initialised globally
      if (window.__pyodide) {
        pyodideRef.current = window.__pyodide;
        if (!cancelled) setStatus('ready');
        return;
      }

      // Another instance is already loading — wait for it
      if (window.__pyodideLoading) {
        if (!cancelled) setStatus('loading');
        try {
          const pyodide = await window.__pyodideLoading;
          pyodideRef.current = pyodide;
          if (!cancelled) setStatus('ready');
        } catch {
          if (!cancelled) setStatus('error');
        }
        return;
      }

      // First loader: create the shared promise
      if (!cancelled) setStatus('loading');

      const loadingPromise: Promise<PyodideInterface> = (async () => {
        await loadScript(PYODIDE_SCRIPT_URL);
        const pyodide = await window.loadPyodide({ indexURL: PYODIDE_BASE_URL });
        window.__pyodide = pyodide;
        return pyodide;
      })();

      window.__pyodideLoading = loadingPromise;

      try {
        const pyodide = await loadingPromise;
        pyodideRef.current = pyodide;
        if (!cancelled) setStatus('ready');
      } catch (err) {
        console.error('[usePyodide] Failed to load Pyodide:', err);
        // Clean up so a future mount can retry
        window.__pyodideLoading = undefined;
        if (!cancelled) setStatus('error');
      }
    }

    initPyodide();

    return () => {
      cancelled = true;
    };
  }, []);

  // ---------------------------------------------------------------------------
  // runPython
  // ---------------------------------------------------------------------------
  const runPython = useCallback(
    async (code: string): Promise<{ output: string; error: string | null }> => {
      const pyodide = pyodideRef.current;

      if (!pyodide) {
        return {
          output: '',
          error: 'Pyodide is not ready yet. Please wait and try again.',
        };
      }

      try {
        const wrapped = buildWrappedCode(code);
        pyodide.runPython(wrapped);

        const output = pyodide.runPython('_stdout.getvalue()') as string;
        const errOutput = pyodide.runPython('_stderr.getvalue()') as string;

        return {
          output: output ?? '',
          error: errOutput ? errOutput : null,
        };
      } catch (jsError: unknown) {
        const message =
          jsError instanceof Error ? jsError.message : String(jsError);
        return {
          output: '',
          error: message,
        };
      }
    },
    []
  );

  return {
    status,
    runPython,
    isReady: status === 'ready',
  };
}
