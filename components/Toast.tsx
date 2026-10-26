"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "./Icons";
import styles from "./Toast.module.css";

export type ToastKind = "success" | "error";
export type ToastState = { id: number; message: string; kind: ToastKind } | null;

export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);

  const show = useCallback((message: string, kind: ToastKind = "success") => {
    setToast({ id: Date.now(), message, kind });
  }, []);

  const dismiss = useCallback(() => setToast(null), []);

  return { toast, show, dismiss };
}

export function Toast({
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
      <div className={`${styles.card} ${toast.kind === "error" ? styles.error : styles.success}`} role="status">
        <p className={styles.copy}>{toast.message}</p>
        <button onClick={onDismiss} className={styles.close} aria-label="Dismiss">
          <X size={14} />
        </button>
        <span className={styles.bar} />
      </div>
    </div>
  );
}
