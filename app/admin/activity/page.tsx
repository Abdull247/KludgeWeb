"use client";

import { PageTopBar } from "@/components/PageTopBar";
import { Spinner } from "@/components/Spinner";
import { useAuthProfile } from "@/lib/useAuthProfile";
import styles from "../admin.module.css";

export default function AdminActivityPage() {
  const profile = useAuthProfile();

  if (!profile) {
    return (
      <div className={styles.page}>
        <div className={styles.boot}>
          <Spinner size={22} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageTopBar title="Activity" />
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.kicker}>Admin</p>
          <h1 className={styles.title}>Drops, likes, ingest</h1>
          <p className={styles.lede}>Live activity will land here next.</p>
        </section>
        <p className={styles.empty}>Nothing to show yet.</p>
      </main>
    </div>
  );
}
