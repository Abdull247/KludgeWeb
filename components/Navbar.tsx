"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { ArrowRight, ChevronDown, Github } from "./Icons";
import { Spinner } from "./Spinner";
import { NAV, APP_NAV } from "@/lib/nav";
import { apiUrl } from "@/lib/api";
import { useSession } from "@/lib/useSession";
import styles from "./Navbar.module.css";

type MenuItem = { key: string; href: string; label: string; hint: string; menu: boolean };

function Burger({ open }: { open: boolean }) {
  return (
    <span className={styles.burger}>
      <span className={`${styles.bar} ${open ? styles.barTopOpen : styles.barTop}`} />
      <span className={`${styles.bar} ${open ? styles.barMidOpen : styles.barMid}`} />
      <span className={`${styles.bar} ${open ? styles.barBotOpen : styles.barBot}`} />
    </span>
  );
}

export function Navbar() {
  const router = useRouter();
  const { profile } = useSession();
  const loggedIn = Boolean(profile);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [chipVis, setChipVis] = useState(1);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setChipVis(Math.max(0, Math.min(1, 1 - y / 140)));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-lock", open);
    return () => document.body.classList.remove("nav-lock");
  }, [open]);

  const items: MenuItem[] = loggedIn
    ? APP_NAV.map((n) => ({ key: n.href, href: n.href, label: n.label, hint: n.hint, menu: false }))
    : NAV.map((n) => ({ key: n.slug, href: `/${n.slug}`, label: n.label, hint: n.hint, menu: n.menu }));

  const logout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    await fetch(apiUrl("/api/auth/logout"), { method: "POST", credentials: "include" }).catch(() => null);
    router.replace("/auth");
  };

  return (
    <>
      <header
        className={`${styles.header} ${scrolled && !open ? styles.scrolled : ""}`}
        style={{ "--vis": chipVis } as React.CSSProperties}
      >
        <div className={styles.inner}>
          <Logo />
          <nav className={styles.desktopNav}>
            {items.map((n) => (
              <Link key={n.key} href={n.href} className={styles.navLink}>
                {n.label}
                {n.menu && <ChevronDown size={14} className={styles.chevron} />}
              </Link>
            ))}
          </nav>
          <div className={styles.desktopActions}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className={styles.githubLink}
            >
              <Github size={16} />
              <span className="font-mono">4.2K</span>
            </a>
            {loggedIn ? (
              <button onClick={logout} disabled={loggingOut} className={styles.signIn}>
                {loggingOut ? <Spinner size={14} /> : "Log out"}
              </button>
            ) : (
              <Link href="/auth" className={styles.signIn}>
                Sign in
              </Link>
            )}
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            className={styles.menuBtn}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <Burger open={open} />
          </button>
        </div>
      </header>

      <div
        className={`${styles.overlay} bg-page-deep ${open ? styles.overlayOpen : ""} ${mounted ? styles.overlayReady : ""}`}
        aria-hidden={!open}
      >
        <div className={`grid-lines ${styles.overlayGrid}`} />
        <ul className={styles.overlayList}>
          {items.map((n, i) => (
            <li
              key={n.key}
              className={styles.overlayItem}
              style={{ transitionDelay: open ? `${0.2 + i * 0.06}s` : "0s" }}
            >
              <Link
                href={n.href}
                onClick={() => setOpen(false)}
                className={`${styles.overlayLink} ${i < items.length - 1 ? styles.overlayLinkBorder : ""}`}
              >
                <span className={styles.overlayLabel}>{n.label}</span>
                <span className={styles.overlayHintText}>{n.hint}</span>
                <ArrowRight size={16} className={styles.overlayArrow} />
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.overlayFooter}>
          {loggedIn ? (
            <button onClick={logout} disabled={loggingOut} className={styles.overlaySignIn}>
              {loggingOut ? <Spinner size={14} /> : "Log out"}
            </button>
          ) : (
            <Link href="/auth" onClick={() => setOpen(false)} className={styles.overlaySignIn}>
              Sign in to Kludge
            </Link>
          )}
          <a href="https://github.com" target="_blank" rel="noreferrer" className={styles.overlayGithub}>
            <Github size={16} /> Star us · <span className="font-mono">4.2K</span>
          </a>
        </div>
      </div>
    </>
  );
}
