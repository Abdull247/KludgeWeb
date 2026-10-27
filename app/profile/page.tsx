"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppTopBar } from "@/components/AppTopBar";
import { ArrowRight, VerifiedIcon } from "@/components/Icons";
import { Spinner } from "@/components/Spinner";
import { Toast, useToast } from "@/components/Toast";
import { useAuthProfile } from "@/lib/useAuthProfile";
import { fetchMyProfile, prefetchItem, type CatalogItem, type ProfileFeed } from "@/lib/home";
import styles from "./profile.module.css";

function toneClass(tone: string) {
  return styles[`tone${tone}`] ?? styles.tonea;
}

function formatCount(n: number) {
  if (n >= 1000) {
    const v = n / 1000;
    return n % 1000 === 0 ? `${n / 1000}k` : `${v.toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(n);
}

const TABS = [
  { key: "publications", label: "Publications" },
  { key: "saved", label: "Saved" },
  { key: "liked", label: "Liked" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function ItemCard({ item }: { item: CatalogItem }) {
  const verified = (item.verificationStatus || "verified") === "verified";
  return (
    <Link href={`/item/${item.id}`} className={styles.card} onPointerEnter={() => prefetchItem(item.id)}>
      <span className={`${styles.mark} ${item.buildArtwork ? "" : toneClass(item.tone)}`}>
        {item.buildArtwork ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.buildArtwork} alt="" />
        ) : (
          item.mark
        )}
      </span>
      <div className={styles.cardMain}>
        <p className={styles.cardName}>
          {verified ? <VerifiedIcon size={14} className={styles.verified} /> : null}
          {item.name}
        </p>
        <p className={styles.cardCat}>{item.category?.name || item.typeLabel || item.type}</p>
        <p className={styles.cardBlurb}>{item.blurb}</p>
      </div>
    </Link>
  );
}

export default function ProfilePage() {
  const profile = useAuthProfile();
  const { toast, show, dismiss } = useToast();
  const [feed, setFeed] = useState<ProfileFeed | null>(null);
  const [tab, setTab] = useState<TabKey>("publications");

  useEffect(() => {
    if (!profile) return;
    let live = true;
    fetchMyProfile().then((res) => {
      if (!live) return;
      if (!res.data) {
        show(res.error ?? "could not load profile", "error");
        return;
      }
      setFeed(res.data);
    });
    return () => {
      live = false;
    };
  }, [profile, show]);

  if (!profile) {
    return (
      <div className={styles.page}>
        <div className={styles.boot}>
          <Spinner size={22} />
        </div>
      </div>
    );
  }

  const index = TABS.findIndex((t) => t.key === tab);
  const lists = {
    publications: feed?.published ?? [],
    saved: feed?.saved ?? [],
    liked: feed?.liked ?? [],
  };

  return (
    <div className={styles.page}>
      <AppTopBar />
      <main className={styles.main}>
        <section className={styles.identity}>
          <div className={styles.avatar}>
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt="" />
            ) : (
              (profile.username || "?").slice(0, 2).toUpperCase()
            )}
          </div>
          <div className={styles.handle}>
            <h1 className={styles.name}>{profile.fullName || profile.username}</h1>
            <p className={styles.user}>@{profile.username}</p>
          </div>
        </section>

        <section className={styles.stats} aria-label="Profile stats">
          <div className={styles.stat}>
            <span className={styles.statValue}>{formatCount(feed?.stats.projects ?? 0)}</span>
            <span className={styles.statLabel}>Projects</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{formatCount(feed?.stats.downloads ?? 0)}</span>
            <span className={styles.statLabel}>Downloads</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{formatCount(feed?.stats.likes ?? 0)}</span>
            <span className={styles.statLabel}>Likes</span>
          </div>
        </section>

        {feed && feed.stats.pending > 0 ? (
          <Link href="/profile/pending" className={styles.banner}>
            <span className={styles.bannerText}>Pending verifications</span>
            <ArrowRight size={14} />
          </Link>
        ) : null}

        {feed && feed.stats.rejected > 0 ? (
          <Link href="/profile/rejected" className={`${styles.banner} ${styles.bannerWarn}`}>
            <span className={styles.bannerText}>Rejected verifications</span>
            <ArrowRight size={14} />
          </Link>
        ) : null}

        <div className={styles.tabs} role="tablist" aria-label="Library">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={`${styles.tab} ${tab === t.key ? styles.tabOn : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.pager}>
          <div className={styles.track} style={{ transform: `translateX(-${index * 33.333}%)` }}>
            {TABS.map((t) => (
              <div key={t.key} className={styles.pane} role="tabpanel">
                {!feed ? (
                  <div className={styles.boot}>
                    <Spinner size={18} />
                  </div>
                ) : lists[t.key].length === 0 ? (
                  <p className={styles.empty}>Nothing here yet.</p>
                ) : (
                  lists[t.key].map((item) => <ItemCard key={item.id} item={item} />)
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  );
}
