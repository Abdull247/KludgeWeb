"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Spinner } from "@/components/Spinner";
import { Toast, useToast } from "@/components/Toast";
import { api, type Profile } from "@/lib/api";
import { getSessionToken } from "@/lib/session";
import styles from "./onboarding.module.css";

export default function OnboardingPage() {
  const router = useRouter();
  const { toast, show, dismiss } = useToast();
  const [choice, setChoice] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const noticed = useRef(false);

  useEffect(() => {
    getSessionToken();
    api<Profile>("/api/profile/me").then((res) => {
      if (!res.data) {
        router.replace("/auth");
        return;
      }
      if (res.data.onboardingCompleted) {
        router.replace("/home");
        return;
      }
      const params = new URLSearchParams(window.location.search);
      if (params.get("welcome") && !noticed.current) {
        noticed.current = true;
        show("Signed in. Welcome to Kludge.", "success");
        window.history.replaceState({}, "", "/onboarding");
      }
      setReady(true);
    });
  }, [router, show]);

  const submit = async () => {
    if (choice === null || loading) return;
    setLoading(true);
    const res = await api<Profile>("/api/profile/onboarding", {
      method: "POST",
      body: JSON.stringify({ hasCodingBackground: choice }),
    });
    setLoading(false);
    if (!res.data) {
      show(res.error || "could not save your answer", "error");
      return;
    }
    router.replace("/home?welcome=1");
  };

  if (!ready) {
    return (
      <div className={`bg-app ${styles.page}`}>
        <div className={styles.center}>
          <Spinner size={22} />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-app ${styles.page}`}>
      <div className={`grid-lines ${styles.grid}`} />
      <header className={styles.top}>
        <Logo />
      </header>
      <main className={styles.body}>
        <p className={styles.kicker}>One last thing</p>
        <h1 className={`text-gradient ${styles.title}`}>Do you have a coding background?</h1>
        <p className={styles.sub}>Tell us so we can point you at the right builds first.</p>
        <div className={styles.chips}>
          <button
            type="button"
            className={`${styles.chip} ${choice === true ? styles.chipOn : ""}`}
            onClick={() => setChoice(true)}
          >
            Yes
          </button>
          <button
            type="button"
            className={`${styles.chip} ${choice === false ? styles.chipOn : ""}`}
            onClick={() => setChoice(false)}
          >
            No
          </button>
        </div>
        <button
          type="button"
          className={styles.continue}
          disabled={choice === null || loading}
          onClick={submit}
        >
          {loading ? <Spinner size={16} /> : "Continue"}
        </button>
      </main>
      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  );
}
