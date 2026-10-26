import Link from "next/link";
import styles from "./Logo.module.css";

export function LogoMark({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <img
      src="/kludge.png"
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={`${styles.mark} ${className ?? ""}`}
      style={{ height: size, width: size }}
    />
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`${styles.logo} ${className ?? ""}`} aria-label="Kludge home">
      <LogoMark />
      <span className={styles.word}>Kludge</span>
    </Link>
  );
}
