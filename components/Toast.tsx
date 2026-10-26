"use client";

import { useCallback, useEffect, useState } from "react";
import { Hourglass, X } from "./Icons";
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
    const t = window.setTimeout(onDismiss, 4000);
    return () => window.clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className={styles.wrap} key={toast.id}>
      <div className={`glass-strong ${styles.card}`}>
        <div className={styles.row}>
          <div className={styles.iconWrap}>
            <span className={styles.spin}>
              <Hourglass size={16} />
            </span>
          </div>
          <div className={styles.copy}>
            <p className={styles.title}>{toast.provider} sign-in isn&apos;t live yet</p>
            <p className={styles.sub}>We&apos;re still wiring this up. Check back soon.</p>
          </div>
          <button onClick={onDismiss} className={styles.close} aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
        <div className={styles.bar} />
      </div>
    </div>
  );
}
