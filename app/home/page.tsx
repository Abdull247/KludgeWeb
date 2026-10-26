"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { LogoMark } from "@/components/Logo";
import { Spinner } from "@/components/Spinner";
import { Toast, useToast } from "@/components/Toast";
import { api, type Profile } from "@/lib/api";
import styles from "./home.module.css";

export default function AppHome() {
  const router = useRouter();
  const { toast, show, dismiss } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const noticed = useRef(false);

  useEffect(() => {
    api<Profile>("/api/profile/me").then((res) => {
      if (!res.data) {
        router.replace("/auth");
        return;
      }
      if (!res.data.onboardingCompleted) {
        router.replace("/onboarding");
        return;
      }
      setProfile(res.data);
      const params = new URLSearchParams(window.location.search);
      if (params.get("welcome") && !noticed.current) {
        noticed.current = true;
        show("You're in. Welcome to Kludge.", "success");
        window.history.replaceState({}, "", "/home");
      }
    });
  }, [router, show]);

  return (
    <div className={`bg-app ${styles.page}`}>
      <Navbar />
      <div className={`grid-lines ${styles.grid}`} />
      <main className={styles.main}>
        <div className={`glass ${styles.mark}`}>
          <LogoMark size={28} />
        </div>
        {!profile ? (
          <Spinner size={22} />
        ) : (
          <>
            <p className={styles.prompt}>
              $ kludge whoami <span>@{profile.username}</span>
            </p>
            <h1 className={`text-gradient ${styles.title}`}>Home is on the way</h1>
            <p className={styles.copy}>
              You&apos;re in, {profile.fullName || profile.username}. The feed is still being wired — this is the stub for now.
            </p>
          </>
        )}
      </main>
      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  );
}
