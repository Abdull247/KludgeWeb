"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ArrowLeft, Check, Github, Star, GoogleIcon } from "@/components/Icons";
import { Spinner } from "@/components/Spinner";
import { Toast, useToast } from "@/components/Toast";
import { api, authStartUrl, type Profile } from "@/lib/api";
import styles from "./auth.module.css";

type Provider = "github" | "google";

export default function AuthPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [shake, setShake] = useState(0);
  const [loading, setLoading] = useState<Provider | null>(null);
  const { toast, show, dismiss } = useToast();
  const noticed = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err && !noticed.current) {
      noticed.current = true;
      show(err, "error");
      window.history.replaceState({}, "", "/auth");
    }

    api<Profile>("/api/profile/me").then((res) => {
      if (!res.data) return;
      router.replace(res.data.onboardingCompleted ? "/home" : "/onboarding");
    });
  }, [router, show]);

  const go = (provider: Provider) => {
    if (loading) return;
    if (!agreed) {
      setShake((s) => s + 1);
      return;
    }
    setLoading(provider);
    window.location.assign(authStartUrl(provider));
  };

  return (
    <div className={`bg-app ${styles.page}`}>
      <div className={styles.formCol}>
        <div className={`grid-lines ${styles.formGrid}`} />
        <div className={styles.top}>
          <Logo />
          <Link href="/" className={styles.homeLink}>
            <ArrowLeft size={16} /> Home
          </Link>
        </div>

        <div className={styles.body}>
          <div className={styles.intro}>
            <h1 className={`text-gradient ${styles.title}`}>Welcome to Kludge</h1>
            <p className={styles.sub}>Sign in to post your work and save what you love.</p>
          </div>

          <div className={styles.actions}>
            <button
              onClick={() => go("github")}
              disabled={loading !== null}
              className={`${styles.githubBtn} ${agreed ? "" : styles.disabled}`}
            >
              {loading === "github" ? (
                <Spinner />
              ) : (
                <>
                  <Github size={18} /> Continue with GitHub
                </>
              )}
            </button>
            <button
              onClick={() => go("google")}
              disabled={loading !== null}
              className={`glass ${styles.googleBtn} ${agreed ? "" : styles.disabled}`}
            >
              {loading === "google" ? (
                <Spinner />
              ) : (
                <>
                  <GoogleIcon /> Continue with Google
                </>
              )}
            </button>
          </div>

          <label key={shake} className={`${styles.agree} ${shake ? styles.shake : ""}`}>
            <button
              type="button"
              role="checkbox"
              aria-checked={agreed}
              onClick={() => setAgreed((a) => !a)}
              className={`${styles.check} ${agreed ? styles.checkOn : ""} ${shake && !agreed ? styles.checkWarn : ""}`}
            >
              {agreed && (
                <span className={styles.checkMark}>
                  <Check size={14} strokeWidth={3} />
                </span>
              )}
            </button>
            <span onClick={() => setAgreed((a) => !a)}>
              I agree to the{" "}
              <Link href="/terms" onClick={(e) => e.stopPropagation()}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" onClick={(e) => e.stopPropagation()}>
                Privacy Policy
              </Link>
              .
            </span>
          </label>
        </div>

        <p className={styles.footNote}>No passwords. Ever.</p>
      </div>

      <div className={styles.visual}>
        <div className={`grid-lines ${styles.visualGrid}`} />
        <div className={styles.visualHorizon}>
          <div className="horizon" />
        </div>
        <div className={styles.stageWrap}>
          <div className={styles.stage}>
            <div className={`${styles.float} ${styles.card1}`}>
              <div className={`glass-strong ${styles.card} ${styles.cardIn}`}>
                <p className={styles.pushLine}>~ kludge push</p>
                <p className={styles.monoLine}>
                  ✓ detected stack: <span>next.js · tailwind</span>
                </p>
                <p className={styles.monoLine}>
                  ✓ license: <span>MIT</span>
                </p>
                <p className={styles.monoLine}>
                  ✓ live at <span>kludge.dev/@you/dash</span>
                </p>
              </div>
            </div>
            <div className={`${styles.float} ${styles.card2}`}>
              <div className={`glass-strong ${styles.card} ${styles.cardIn}`}>
                <div className={styles.person}>
                  <div className={styles.avatar} />
                  <div>
                    <p className={styles.personName}>@amaka.dev</p>
                    <p className={styles.personSub}>forked your template</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles.float} ${styles.card3}`}>
              <div className={`glass-strong ${styles.card} ${styles.cardIn}`}>
                <p className={styles.kitTitle}>Orbit UI Kit</p>
                <p className={styles.kitSub}>Figma · 240 screens</p>
                <div className={styles.swatches}>
                  <span className={`${styles.swatch} ${styles.swatchA}`} />
                  <span className={`${styles.swatch} ${styles.swatchB}`} />
                  <span className={`${styles.swatch} ${styles.swatchC}`} />
                  <span className={`${styles.swatch} ${styles.swatchD}`} />
                </div>
                <p className={styles.saves}>
                  <Star size={12} /> 980 saves
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className={styles.caption}>Ship it. Share it. Someone needs it.</p>
      </div>

      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  );
}
