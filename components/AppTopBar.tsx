"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import styles from "./AppTopBar.module.css";

export function AppTopBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <Logo />
      </div>
    </header>
  );
}
