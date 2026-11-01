"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "cj-prep-ready";

/** Reads the questions this device has marked as ready. Storage can be blocked, so every access is guarded. */
function read(): Set<string> {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

function write(ready: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...ready]));
  } catch {
    /* storage blocked: the ticks still work for this visit */
  }
}

/**
 * Tracks which prep questions this device has ticked as ready. Ids look like "dbms:3".
 * Progress stays in this browser only; nothing is sent to the server.
 */
export function useReady() {
  const [ready, setReady] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setReady(read());
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const toggle = useCallback((id: string) => {
    setReady((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      write(next);
      return next;
    });
  }, []);

  const reset = useCallback((ids: string[]) => {
    setReady((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      write(next);
      return next;
    });
  }, []);

  return { ready, loaded, toggle, reset };
}
