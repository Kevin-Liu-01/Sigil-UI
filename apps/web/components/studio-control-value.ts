"use client";

import { useEffect, useRef, useState } from "react";
import { useSigilActions, useSigilTokenRevision } from "./sandbox/token-provider";

/** Keep the thumb responsive while the rest of Studio reconciles after paint. */
export function useStudioControlValue<T>(value: T, onChange: (value: T) => void): [T, (next: T) => void] {
  const [draft, setDraft] = useState(value);
  const pendingRevision = useRef(0);
  const revision = useSigilTokenRevision();
  const { getSnapshot } = useSigilActions();
  useEffect(() => {
    // A delayed render from an earlier edit must not roll back the thumb.
    // Resets and preset changes also receive revisions, so they always win.
    if (revision >= pendingRevision.current) setDraft(value);
  }, [value, revision]);
  return [draft, next => {
    setDraft(next);
    onChange(next);
    pendingRevision.current = getSnapshot().revision;
  }];
}
