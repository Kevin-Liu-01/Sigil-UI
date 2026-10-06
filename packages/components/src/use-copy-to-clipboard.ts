"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type CopyStatus = "idle" | "copying" | "copied" | "error";

/** Copy text with honest feedback, retry support, and cleanup on value changes. */
export function useCopyToClipboard(value: string | (() => string), timeout = 2000) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const operation = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setStatus("idle");
    return () => {
      operation.current += 1;
      clearTimeout(timer.current);
    };
  }, [value, timeout]);

  const copy = useCallback(async () => {
    const request = ++operation.current;
    clearTimeout(timer.current);
    setStatus("copying");
    try {
      await navigator.clipboard.writeText(typeof value === "function" ? value() : value);
      if (request !== operation.current) return false;
      setStatus("copied");
      timer.current = setTimeout(() => setStatus("idle"), timeout);
      return true;
    } catch {
      if (request === operation.current) setStatus("error");
      return false;
    }
  }, [value, timeout]);

  return { copy, status, copied: status === "copied", error: status === "error" };
}
