"use client";

import { Spinner } from "./Spinner";
import { BottomNav } from "./BottomNav";
import { Logo } from "./Logo";
import { useAuthProfile } from "@/lib/useAuthProfile";
import styles from "./AppShell.module.css";

export function AppShell({
  title,
  copy,
}: {
  title: string;
  copy: string;
}) {
  const profile = useAuthProfile();

  if (!profile) {
    return (
      <div className={`bg-app ${styles.page}`}>
        <div className={styles.boot}>
          <Spinner size={22} />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-app ${styles.page}`}>
      <div className={styles.horizonClip} aria-hidden>
        <div className="horizon" />
      </div>
      <header className={styles.top}>
        <Logo />
      </header>
      <main className={styles.main}>
        <p className={styles.kicker}>@{profile.username}</p>
        <h1 className={`text-gradient ${styles.title}`}>{title}</h1>
        <p className={styles.copy}>{copy}</p>
      </main>
      <BottomNav />
    </div>
  );
}
