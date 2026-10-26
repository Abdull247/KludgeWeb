"use client";

import { useEffect } from "react";
import styles from "./error.module.css";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={`bg-page ${styles.page}`}>
      <div className={styles.box}>
        <h1 className={styles.title}>This page didn&apos;t load</h1>
        <p className={styles.copy}>Something went wrong. Try again or head home.</p>
        <div className={styles.actions}>
          <button onClick={reset} className={styles.retry}>
            Try again
          </button>
          <a href="/" className={`glass ${styles.home}`}>
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
