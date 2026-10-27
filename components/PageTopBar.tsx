"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "./Icons";
import styles from "./PageTopBar.module.css";

export function PageTopBar({ title }: { title: string }) {
  const router = useRouter();

  return (
    <header className={styles.top}>
      <button type="button" className={styles.back} onClick={() => router.back()} aria-label="Back">
        <ArrowLeft size={18} />
      </button>
      <span className={styles.chip}>
        <span className={styles.chipText}>{title}</span>
      </span>
    </header>
  );
}
