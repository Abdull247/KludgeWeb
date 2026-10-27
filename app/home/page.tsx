"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Spinner } from "@/components/Spinner";
import { Toast, useToast } from "@/components/Toast";
import { Navbar } from "@/components/Navbar";
import {
  BookmarkIcon,
  ExternalIcon,
  HeartIcon,
  PlusIcon,
  SearchIcon,
  SlidersIcon,
} from "@/components/Icons";
import { useAuthProfile } from "@/lib/useAuthProfile";
import {
  fetchAdminHome,
  fetchHome,
  fetchSection,
  patchItem,
  toggleLike,
  toggleSave,
  type CatalogItem,
  type HomeFeed,
  type Section,
  type StatTab,
} from "@/lib/home";
import { AdminDashboard } from "./AdminDashboard";
import styles from "./home.module.css";

function toneClass(tone: string) {
  return styles[`tone${tone}`] ?? styles.tonea;
}

function artworkStyle(item: CatalogItem) {
  return item.buildArtwork ? { backgroundImage: `url(${item.buildArtwork})` } : undefined;
}

export default function AppHome() {
  const profile = useAuthProfile();
  const { toast, show, dismiss } = useToast();
  const noticed = useRef(false);
  const [tab, setTab] = useState<StatTab>("builds");
  const [query, setQuery] = useState("");
  const [home, setHome] = useState<HomeFeed | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [busy, setBusy] = useState(false);
  const [bounce, setBounce] = useState<Record<string, string>>({});
  const [debouncedQ, setDebouncedQ] = useState("");
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [dashboard, setDashboard] = useState<"admin" | "user">("user");
  const sectionIds = useRef<Record<string, string>>({});

  const applyItem = useCallback((next: CatalogItem) => {
    setHome((h) => {
      if (!h) return h;
      const mapRail = (items: CatalogItem[]) => items.map((it) => (it.id === next.id ? next : it));
      return {
        ...h,
        rails: {
          trending: { ...h.rails.trending, items: mapRail(h.rails.trending.items) },
          dropped: { ...h.rails.dropped, items: mapRail(h.rails.dropped.items) },
          collections: { ...h.rails.collections, items: mapRail(h.rails.collections.items) },
        },
        sections: h.sections.map((s) => ({
          ...s,
          feed: { ...s.feed, items: s.feed.items.map((it) => (it.id === next.id ? next : it)) },
        })),
      };
    });
    setSection((s) => {
      if (!s) return s;
      return {
        ...s,
        feed: { ...s.feed, items: s.feed.items.map((it) => (it.id === next.id ? next : it)) },
      };
    });
  }, []);

  const react = async (item: CatalogItem, action: "save" | "like") => {
    const key = `${item.id}:${action}`;
    setBounce((b) => ({ ...b, [key]: styles.bounce }));
    window.setTimeout(() => {
      setBounce((b) => {
        const n = { ...b };
        delete n[key];
        return n;
      });
    }, 420);
    const res = action === "save" ? await toggleSave(item.id) : await toggleLike(item.id);
    if (!res.data) {
      show(res.error ?? "could not update", "error");
      return;
    }
    applyItem(patchItem(item, res.data));
  };

  useEffect(() => {
    if (!profile) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("welcome") && !noticed.current) {
      noticed.current = true;
      show("You're in. Welcome to Kludge.", "success");
      window.history.replaceState({}, "", "/home");
    }
  }, [profile, show]);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQ(query), 220);
    return () => window.clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!profile) return;
    let live = true;
    fetchAdminHome().then((res) => {
      if (live) setIsAdmin(Boolean(res.data));
    });
    return () => {
      live = false;
    };
  }, [profile]);

  useEffect(() => {
    const stored = window.localStorage.getItem("kludge.dashboard");
    if (stored === "admin" || stored === "user") setDashboard(stored);
  }, []);

  const switchDashboard = (next: "admin" | "user") => {
    setDashboard(next);
    window.localStorage.setItem("kludge.dashboard", next);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    if (!profile) return;
    let live = true;
    fetchHome().then((res) => {
      if (!live) return;
      if (!res.data) {
        show(res.error ?? "could not load home", "error");
        return;
      }
      setHome(res.data);
      const ids: Record<string, string> = {};
      for (const s of res.data.sections) ids[s.slug] = s.id;
      sectionIds.current = ids;
      const builds = res.data.sections.find((s) => s.slug === "builds") ?? res.data.sections[0];
      setSection(builds ?? null);
      setReady(true);
    });
    return () => {
      live = false;
    };
  }, [profile, show]);

  useEffect(() => {
    if (!ready) return;
    const id = sectionIds.current[tab];
    if (!id) return;
    let live = true;
    setBusy(true);
    fetchSection(id, 1, 12, debouncedQ).then((res) => {
      if (!live) return;
      setBusy(false);
      if (res.data) setSection(res.data);
    });
    return () => {
      live = false;
    };
  }, [tab, debouncedQ, ready]);

  if (!profile || (isAdmin === null && dashboard === "admin")) {
    return (
      <div className={`bg-app ${styles.page}`}>
        <div className={styles.boot}>
          <Spinner size={22} />
        </div>
      </div>
    );
  }

  if (isAdmin && dashboard === "admin") {
    return (
      <div className={`bg-app ${styles.page}`}>
        <div className={styles.horizonClip} aria-hidden>
          <div className="horizon" />
        </div>
        <div className={`grid-lines ${styles.grid}`} />
        <Navbar dashboard={dashboard} onSwitchDashboard={switchDashboard} />
        <AdminDashboard profile={profile} />
        <Toast toast={toast} onDismiss={dismiss} />
      </div>
    );
  }

  if (!home || !section) {
    return (
      <div className={`bg-app ${styles.page}`}>
        <div className={styles.boot}>
          <Spinner size={22} />
        </div>
      </div>
    );
  }

  const first = home.viewer.greetingName || profile.fullName.split(" ")[0] || profile.username;
  const feed = section.feed.items;

  return (
    <div className={`bg-app ${styles.page}`}>
      <div className={styles.horizonClip} aria-hidden>
        <div className="horizon" />
      </div>
      <div className={`grid-lines ${styles.grid}`} />

      <Navbar dashboard={isAdmin ? dashboard : undefined} onSwitchDashboard={isAdmin ? switchDashboard : undefined} />

      <main className={styles.feed}>
        <section className={styles.hero}>
          <p className={styles.kicker}>Signed in as @{profile.username}</p>
          <h1 className={`text-gradient ${styles.hello}`}>Hey {first}.</h1>
          <p className={styles.lede}>Unofficial builds, APIs, and kits — dropped by people who actually ship.</p>
          <div className={styles.actions}>
            <Link href="/add" className={styles.pillPrimary}>
              <PlusIcon size={15} strokeWidth={2.4} /> Drop a build
            </Link>
            <button type="button" className={styles.pillIcon} aria-label="Search">
              <SearchIcon size={16} />
            </button>
          </div>
        </section>

        <section className={styles.stats} aria-label="Catalog">
          {home.sections.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`${styles.stat} ${tab === s.slug ? styles.statOn : ""}`}
              onClick={() => setTab(s.slug as StatTab)}
            >
              <span className={styles.statLabel}>{s.title}</span>
              <span className={styles.statCount}>{s.itemCount}</span>
            </button>
          ))}
        </section>

        <section className={styles.block}>
          <div className={styles.blockHead}>
            <h2 className={styles.blockTitle}>{home.rails.trending.title}</h2>
            <Link href="/add" className={styles.pillGhost}>
              <PlusIcon size={14} strokeWidth={2.4} /> Share a build
            </Link>
          </div>
          <div className={styles.rail}>
            {home.rails.trending.items.map((item) => (
              <article key={item.id} className={styles.railCard}>
                <div
                  className={`${styles.cover} ${toneClass(item.tone)}`}
                  style={artworkStyle(item)}
                />
                <p className={styles.railTitle}>{item.name}</p>
                <p className={styles.railMeta}>
                  {item.category.name} · {item.metric.display}
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
                placeholder={home.search.placeholder}
                aria-label="Search the feed"
              />
            </label>
            <button type="button" className={styles.filter} aria-label="Filters">
              <SlidersIcon size={16} />
            </button>
          </div>
        </section>

        <section className={styles.list} aria-label="Feed">
          {busy && feed.length === 0 ? (
            <div className={styles.boot}>
              <Spinner size={18} />
            </div>
          ) : (
            feed.map((item) => (
              <article key={item.id} className={styles.card}>
                <div className={styles.cardMain}>
                  <div className={styles.cardHead}>
                    <span
                      className={`${styles.mark} ${toneClass(item.tone)}`}
                      style={artworkStyle(item)}
                    >
                      {item.mark}
                    </span>
                    <div className={styles.cardId}>
                      <p className={styles.cardName}>
                        {item.name} <ExternalIcon size={12} />
                      </p>
                      <p className={styles.cardCat}>{item.category.name}</p>
                    </div>
                  </div>
                  <p className={styles.cardBlurb}>{item.blurb}</p>
                </div>
                <div className={styles.react}>
                  <button
                    type="button"
                    className={`${styles.reactBtn} ${item.viewer.saved ? styles.reactOn : ""} ${bounce[`${item.id}:save`] ?? ""}`}
                    onClick={() => react(item, "save")}
                    aria-label={item.viewer.saved ? `Unsave ${item.name}` : `Save ${item.name}`}
                    aria-pressed={item.viewer.saved}
                  >
                    <BookmarkIcon size={14} strokeWidth={2.1} filled={item.viewer.saved} />
                  </button>
                  <button
                    type="button"
                    className={`${styles.reactBtn} ${item.viewer.liked ? styles.reactLiked : ""} ${bounce[`${item.id}:like`] ?? ""}`}
                    onClick={() => react(item, "like")}
                    aria-label={item.viewer.liked ? `Unlike ${item.name}` : `Like ${item.name}`}
                    aria-pressed={item.viewer.liked}
                  >
                    <HeartIcon size={14} strokeWidth={2.1} filled={item.viewer.liked} />
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        <section className={styles.block}>
          <div className={styles.blockHead}>
            <h2 className={styles.blockTitle}>{home.rails.dropped.title}</h2>
          </div>
          <div className={styles.rail}>
            {home.rails.dropped.items.map((item) => (
              <article key={item.id} className={styles.railCard}>
                <div
                  className={`${styles.cover} ${toneClass(item.tone)}`}
                  style={artworkStyle(item)}
                />
                <p className={styles.railTitle}>{item.name}</p>
                <p className={styles.railMeta}>
                  {item.category.name} · {item.metric.display}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.block}>
          <div className={styles.blockHead}>
            <h2 className={styles.blockTitle}>{home.rails.collections.title}</h2>
          </div>
          <div className={styles.rail}>
            {home.rails.collections.items.map((item) => (
              <article key={`${item.id}-col`} className={`${styles.railCard} ${styles.railWide}`}>
                <div
                  className={`${styles.cover} ${styles.coverWide} ${toneClass(item.tone)}`}
                  style={artworkStyle(item)}
                />
                <p className={styles.railTitle}>{item.name}</p>
                <p className={styles.railMeta}>
                  {item.creator ? `by @${item.creator.username}` : item.category.name} · {item.metric.display}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  );
}
