"use client";

import { useEffect, useMemo, useState } from "react";
import { Spinner } from "@/components/Spinner";
import { SearchIcon } from "@/components/Icons";
import { fetchAdminHome, type AdminHome, type AdminTab, type CatalogItem } from "@/lib/home";
import type { Profile } from "@/lib/api";
import styles from "./home.module.css";

function toneClass(tone: string) {
  return styles[`tone${tone}`] ?? styles.tonea;
}

function artworkStyle(item: CatalogItem) {
  return item.buildArtwork ? { backgroundImage: `url(${item.buildArtwork})` } : undefined;
}

const TABS: { key: AdminTab; label: string }[] = [
  { key: "builds", label: "Builds" },
  { key: "users", label: "Users" },
  { key: "apis", label: "APIs" },
];

export function AdminDashboard({ profile }: { profile: Profile }) {
  const [home, setHome] = useState<AdminHome | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<AdminTab>("builds");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let live = true;
    fetchAdminHome().then((res) => {
      if (!live) return;
      if (!res.data) {
        setLoadError(res.error ?? "could not load admin home");
        return;
      }
      setHome(res.data);
    });
    return () => {
      live = false;
    };
  }, []);

  const q = query.trim().toLowerCase();

  const rows = useMemo(() => {
    if (!home) return [];
    if (tab === "users") return [] as CatalogItem[];
    const items = tab === "builds" ? home.projects : home.apis;
    if (!q) return items;
    return items.filter(
      (it) =>
        it.name.toLowerCase().includes(q) ||
        it.category.name.toLowerCase().includes(q) ||
        (it.creator?.username ?? "").toLowerCase().includes(q),
    );
  }, [home, tab, q]);

  const users = useMemo(() => {
    if (!home || tab !== "users") return [];
    if (!q) return home.users;
    return home.users.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [home, tab, q]);

  return (
    <main className={styles.feed}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Signed in as @{profile.username} · Admin console</p>
        <h1 className={`text-gradient ${styles.hello}`}>Hey, Kludge Admin.</h1>
        <p className={styles.lede}>
          Every build, API, and account on Kludge — flat, filterable, no rails.
        </p>
      </section>

      {home && (
        <section className={styles.stats} aria-label="Admin stats">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`${styles.stat} ${tab === t.key ? styles.statOn : ""}`}
              onClick={() => setTab(t.key)}
            >
              <span className={styles.statLabel}>{t.label}</span>
              <span className={styles.statCount}>{home.stats[t.key]}</span>
            </button>
          ))}
        </section>
      )}

      <section className={styles.block}>
        <div className={styles.searchRow}>
          <label className={styles.search}>
            <SearchIcon size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by name, creator, email…"
              aria-label="Filter the admin list"
            />
          </label>
        </div>
      </section>

      <section className={styles.list} aria-label="Admin list">
        {loadError ? (
          <p className={styles.cardBlurb}>{loadError}</p>
        ) : !home ? (
          <div className={styles.boot}>
            <Spinner size={18} />
          </div>
        ) : tab === "users" ? (
          users.map((u) => (
            <article key={u.id} className={styles.card}>
              <div className={styles.cardMain}>
                <div className={styles.cardHead}>
                  {u.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className={styles.adminAvatar} src={u.avatarUrl} alt="" />
                  ) : (
                    <span className={`${styles.mark} ${styles.toneb}`}>{(u.username || "?").slice(0, 2)}</span>
                  )}
                  <div className={styles.cardId}>
                    <p className={styles.cardName}>
                      {u.fullName || u.username}
                      {u.role === "admin" && <span className={`${styles.adminRole} ${styles.adminRoleAdmin}`}>admin</span>}
                    </p>
                    <p className={styles.cardCat}>@{u.username}</p>
                  </div>
                </div>
                <p className={styles.adminEmail}>{u.email || "no email on file"}</p>
              </div>
              <p className={styles.statCount}>{u.projectCount}</p>
            </article>
          ))
        ) : (
          rows.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.cardMain}>
                <div className={styles.cardHead}>
                  <span className={`${styles.mark} ${item.buildArtwork ? styles.hasArt : toneClass(item.tone)}`} style={artworkStyle(item)}>
                    {item.buildArtwork ? null : item.mark}
                  </span>
                  <div className={styles.cardId}>
                    <p className={styles.cardName}>{item.name}</p>
                    <p className={styles.cardCat}>
                      {item.category.name}
                      {item.creator ? ` · by @${item.creator.username}` : ""}
                    </p>
                  </div>
                </div>
                <p className={styles.cardBlurb}>{item.blurb}</p>
              </div>
              <p className={styles.statCount}>{item.metric.display}</p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
