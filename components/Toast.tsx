"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "./Icons";
import styles from "./Toast.module.css";

type ToastState = { id: number; provider: string } | null;

export function useComingSoonToast() {
  const [toast, setToast] = useState<ToastState>(null);

  const show = useCallback((provider: string) => {
    setToast({ id: Date.now(), provider });
  }, []);

  const dismiss = useCallback(() => setToast(null), []);

  return { toast, show, dismiss };
}

export function ComingSoonToast({
  toast,
  onDismiss,
}: {
  toast: ToastState;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(onDismiss, 3800);
    return () => window.clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className={styles.wrap} key={toast.id}>
      <div className={styles.card} role="status">
        <p className={styles.copy}>
          <span className={styles.provider}>{toast.provider}</span> sign-in isn&apos;t live yet
        </p>
        <button onClick={onDismiss} className={styles.close} aria-label="Dismiss">
          <X size={14} />
        </button>
        <span className={styles.bar} />
      </div>
    </div>
  );
}
