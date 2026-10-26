"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { ArrowRight, ChevronDown, Github } from "./Icons";
import { NAV } from "@/lib/nav";
import styles from "./Navbar.module.css";

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
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-lock", open);
    return () => document.body.classList.remove("nav-lock");
  }, [open]);

  return (
    <>
      <header className={`${styles.header} ${scrolled && !open ? styles.scrolled : ""}`}>
        <div className={styles.inner}>
          <Logo />
          <nav className={styles.desktopNav}>
            {NAV.map((n) => (
              <Link key={n.slug} href={`/${n.slug}`} className={styles.navLink}>
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
            <Link href="/auth" className={styles.signIn}>
              Sign in
            </Link>
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            className={`glass ${styles.menuBtn}`}
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
          {NAV.map((n, i) => (
            <li
              key={n.slug}
              className={styles.overlayItem}
              style={{ transitionDelay: open ? `${0.2 + i * 0.06}s` : "0s" }}
            >
              <Link
                href={`/${n.slug}`}
                onClick={() => setOpen(false)}
                className={`${styles.overlayLink} ${i < NAV.length - 1 ? styles.overlayLinkBorder : ""}`}
              >
                <span className={styles.overlayLabel}>{n.label}</span>
                <span className={styles.overlayHintText}>{n.hint}</span>
                <ArrowRight size={16} className={styles.overlayArrow} />
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.overlayFooter}>
          <Link href="/auth" onClick={() => setOpen(false)} className={styles.overlaySignIn}>
            Sign in to Kludge
          </Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className={styles.overlayGithub}>
            <Github size={16} /> Star us · <span className="font-mono">4.2K</span>
          </a>
        </div>
      </div>
    </>
  );
}
