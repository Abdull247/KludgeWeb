"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/Spinner";
import styles from "@/components/AppShell.module.css";

export default function PublishPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/add");
  }, [router]);
  return (
    <div className={`bg-app ${styles.page}`}>
      <div className={styles.boot}>
        <Spinner size={22} />
      </div>
    </div>
  );
}
