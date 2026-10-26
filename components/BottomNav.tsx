"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookmarkIcon, CompassIcon, HomeIcon, PlusIcon, UserIcon } from "./Icons";
import styles from "./BottomNav.module.css";

const TABS = [
  { href: "/home", label: "Home", Icon: HomeIcon },
  { href: "/explore", label: "Explore", Icon: CompassIcon },
  { href: "/publish", label: "Publish", Icon: PlusIcon },
  { href: "/collections", label: "Collections", Icon: BookmarkIcon },
  { href: "/profile", label: "Profile", Icon: UserIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.wrap} aria-label="App">
      <div className={styles.bar}>
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.item} ${active ? styles.active : ""}`}
              aria-current={active ? "page" : undefined}
              aria-label={label}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              {active && <span className={styles.dot} />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
