import Link from "next/link";
import { Logo } from "./Logo";
import { FOOTER_COLS } from "@/lib/nav";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <Logo />
          <p className={styles.blurb}>The shared shelf for everything you build with.</p>
        </div>
        {FOOTER_COLS.map((c) => (
          <div key={c.t}>
            <p className={`font-mono ${styles.colTitle}`}>{c.t}</p>
            <ul className={styles.colList}>
              {c.l.map((s) => (
                <li key={s}>
                  <Link href={`/${s}`} className={styles.colLink}>
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={`font-mono ${styles.bottom}`}>
        <span>© 2026 Kludge</span>
        <span>made with duct tape & care</span>
      </div>
    </footer>
  );
}
