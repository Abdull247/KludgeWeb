import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={`bg-page ${styles.page}`}>
      <div className={styles.box}>
        <h1 className={`text-gradient font-mono ${styles.code}`}>404</h1>
        <p className={styles.copy}>This page doesn&apos;t exist or has been moved.</p>
        <Link href="/" className={`glass ${styles.home}`}>
          Go home
        </Link>
      </div>
    </div>
  );
}
