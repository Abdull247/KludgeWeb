"use client";

import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/Spinner";
import { Toast, useToast } from "@/components/Toast";
import { BottomNav } from "@/components/BottomNav";
import { AppTopBar } from "@/components/AppTopBar";
import {
  ChevronUp,
  ChevronDown,
  ExternalIcon,
  PlusIcon,
  SearchIcon,
  SlidersIcon,
} from "@/components/Icons";
import { useAuthProfile } from "@/lib/useAuthProfile";
import { COLLECTIONS, FEED, FRESH, STATS, TRENDING, type StatTab } from "@/lib/feed";
import styles from "./home.module.css";

export default function AppHome() {
  const profile = useAuthProfile();
  const { toast, show, dismiss } = useToast();
  const noticed = useRef(false);
  const [tab, setTab] = useState<StatTab>("builds");
  const [query, setQuery] = useState("");
  const [votes, setVotes] = useState<Record<string, number>>(() =>
    Object.fromEntries(FEED.map((f) => [f.id, f.votes])),
  );

  useEffect(() => {
    if (!profile) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("welcome") && !noticed.current) {
      noticed.current = true;
      show("You're in. Welcome to Kludge.", "success");
      window.history.replaceState({}, "", "/home");
    }
  }, [profile, show]);

  const vote = (id: string, dir: 1 | -1) => {
    setVotes((v) => ({ ...v, [id]: Math.max(0, (v[id] ?? 0) + dir) }));
  };

  const feed = FEED.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.blurb.toLowerCase().includes(q);
  });

  if (!profile) {
    return (
      <div className={`bg-app ${styles.page}`}>
        <div className={styles.boot}>
          <Spinner size={22} />
        </div>
      </div>
    );
  }

  const first = profile.fullName.split(" ")[0] || profile.username;

  return (
    <div className={`bg-app ${styles.page}`}>
      <div className={styles.horizonClip} aria-hidden>
        <div className="horizon" />
      </div>
      <div className={`grid-lines ${styles.grid}`} />

      <AppTopBar />

      <main className={styles.feed}>
        <section className={styles.hero}>
          <p className={styles.kicker}>Signed in as @{profile.username}</p>
          <h1 className={`text-gradient ${styles.hello}`}>Hey {first}.</h1>
          <p className={styles.lede}>Unofficial builds, APIs, and kits — dropped by people who actually ship.</p>
          <div className={styles.actions}>
            <button type="button" className={styles.pillPrimary}>
              <PlusIcon size={15} strokeWidth={2.4} /> Drop a build
            </button>
            <button type="button" className={styles.pillIcon} aria-label="Search">
              <SearchIcon size={16} />
            </button>
          </div>
        </section>

        <section className={styles.stats} aria-label="Catalog">
          {STATS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`${styles.stat} ${tab === s.id ? styles.statOn : ""}`}
              onClick={() => setTab(s.id)}
            >
              <span className={styles.statLabel}>{s.label}</span>
              <span className={styles.statCount}>{s.count}</span>
            </button>
          ))}
        </section>

        <section className={styles.block}>
          <div className={styles.blockHead}>
            <h2 className={styles.blockTitle}>Trending this week</h2>
            <button type="button" className={styles.pillGhost}>
              <PlusIcon size={14} strokeWidth={2.4} /> Share a build
            </button>
          </div>
          <div className={styles.rail}>
            {TRENDING.map((item) => (
              <article key={item.id} className={styles.railCard}>
                <div className={`${styles.cover} ${styles[`tone${item.tone}`]}`} />
                <p className={styles.railTitle}>{item.title}</p>
                <p className={styles.railMeta}>
                  {item.tag} · {item.meta}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.block}>
          <div className={styles.searchRow}>
            <label className={styles.search}>
              <SearchIcon size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search builds, APIs, kits"
                aria-label="Search the feed"
              />
            </label>
            <button type="button" className={styles.filter} aria-label="Filters">
              <SlidersIcon size={16} />
            </button>
          </div>
        </section>

        <section className={styles.list} aria-label="Feed">
          {feed.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.cardMain}>
                <div className={styles.cardHead}>
                  <span className={`${styles.mark} ${styles[`tone${item.tone}`]}`}>{item.mark}</span>
                  <div className={styles.cardId}>
                    <p className={styles.cardName}>
                      {item.name} <ExternalIcon size={12} />
                    </p>
                    <p className={styles.cardCat}>{item.category}</p>
                  </div>
                </div>
                <p className={styles.cardBlurb}>{item.blurb}</p>
              </div>
              <div className={styles.vote}>
                <button type="button" onClick={() => vote(item.id, 1)} aria-label={`Upvote ${item.name}`}>
                  <ChevronUp size={16} />
                </button>
                <span>{votes[item.id]}</span>
                <button type="button" onClick={() => vote(item.id, -1)} aria-label={`Downvote ${item.name}`}>
                  <ChevronDown size={16} />
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className={styles.block}>
          <div className={styles.blockHead}>
            <h2 className={styles.blockTitle}>Just dropped</h2>
          </div>
          <div className={styles.rail}>
            {FRESH.map((item) => (
              <article key={item.id} className={styles.railCard}>
                <div className={`${styles.cover} ${styles[`tone${item.tone}`]}`} />
                <p className={styles.railTitle}>{item.title}</p>
                <p className={styles.railMeta}>
                  {item.tag} · {item.meta}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.block}>
          <div className={styles.blockHead}>
            <h2 className={styles.blockTitle}>Collections to steal</h2>
          </div>
          <div className={styles.rail}>
            {COLLECTIONS.map((item) => (
              <article key={item.id} className={`${styles.railCard} ${styles.railWide}`}>
                <div className={`${styles.cover} ${styles.coverWide} ${styles[`tone${item.tone}`]}`} />
                <p className={styles.railTitle}>{item.title}</p>
                <p className={styles.railMeta}>
                  {item.tag} · {item.meta}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  );
}
