"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Spinner } from "@/components/Spinner";
import { Toast, useToast } from "@/components/Toast";
import {
  ArrowLeft,
  BookmarkIcon,
  CommentIcon,
  DownloadIcon,
  FlagIcon,
  HeartIcon,
  ShareIcon,
} from "@/components/Icons";
import { useAuthProfile } from "@/lib/useAuthProfile";
import {
  fetchItem,
  fetchRecommends,
  patchItem,
  toggleLike,
  toggleSave,
  type CatalogItem,
} from "@/lib/home";
import styles from "./item.module.css";

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

function handleOf(item: CatalogItem) {
  return item.publisher?.username || item.creator?.username || "";
}

function galleryOf(item: CatalogItem) {
  if (item.banners && item.banners.length > 0) return item.banners;
  return item.buildArtwork ? [item.buildArtwork] : [];
}

export default function ItemPage() {
  const profile = useAuthProfile();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast, show, dismiss } = useToast();
  const id = decodeURIComponent(params?.id ?? "");

  const [item, setItem] = useState<CatalogItem | null>(null);
  const [recs, setRecs] = useState<CatalogItem[]>([]);
  const [missing, setMissing] = useState(false);
  const [busy, setBusy] = useState<"like" | "save" | null>(null);

  useEffect(() => {
    if (!profile || !id) return;
    let live = true;
    setItem(null);
    setMissing(false);
    fetchItem(id).then((res) => {
      if (!live) return;
      if (!res.data) {
        setMissing(true);
        show(res.error ?? "item not found", "error");
        return;
      }
      setItem(res.data);
      document.title = `${res.data.name} — Kludge`;
    });
    fetchRecommends(id).then((res) => {
      if (!live) return;
      setRecs(res.data?.items ?? []);
    });
    return () => {
      live = false;
    };
  }, [profile, id, show]);

  const react = async (action: "save" | "like") => {
    if (!item || busy) return;
    setBusy(action);
    const res = action === "save" ? await toggleSave(item.id) : await toggleLike(item.id);
    setBusy(null);
    if (!res.data) {
      show(res.error ?? "could not update", "error");
      return;
    }
    setItem(patchItem(item, res.data));
  };

  const share = async () => {
    if (!item) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: item.name, text: item.blurb, url });
        return;
      }
    } catch {
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      show("Link copied.", "success");
    } catch {
      show("Could not share.", "error");
    }
  };

  const download = () => {
    if (!item) return;
    if (item.sourceUrl) {
      window.open(item.sourceUrl, "_blank", "noopener,noreferrer");
      return;
    }
    show("No source file on this drop yet.", "error");
  };

  if (!profile) {
    return (
      <div className={styles.page}>
        <div className={styles.boot}>
          <Spinner size={22} />
        </div>
      </div>
    );
  }

  if (missing) {
    return (
      <div className={styles.page}>
        <header className={styles.top}>
          <button type="button" className={styles.back} onClick={() => router.back()} aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <span className={styles.chip}>
            <span className={styles.chipText}>Missing</span>
          </span>
        </header>
        <div className={styles.missing}>
          <p className={styles.empty}>This drop is gone or the id is wrong.</p>
          <Link href="/home" className={styles.download}>
            Back home
          </Link>
        </div>
        <Toast toast={toast} onDismiss={dismiss} />
      </div>
    );
  }

  if (!item) {
    return (
      <div className={styles.page}>
        <div className={styles.boot}>
          <Spinner size={22} />
        </div>
      </div>
    );
  }

  const handle = handleOf(item);
  const shots = galleryOf(item);
  const isShot = item.galleryKind === "screenshots" || item.type === "modded_apk";
  const about = item.description || item.blurb;
  const version = item.version || "1.0.0";
  const size = item.sizeDisplay || "—";
  const downloads = formatCount(item.downloads ?? item.stats.pulls ?? 0);

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <button type="button" className={styles.back} onClick={() => router.back()} aria-label="Back">
          <ArrowLeft size={18} />
        </button>
        <span className={styles.chip}>
          <span className={styles.chipText}>{item.name}</span>
        </span>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={`${styles.art} ${item.buildArtwork ? "" : toneClass(item.tone)}`}>
            {item.buildArtwork ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.buildArtwork} alt="" />
            ) : (
              item.mark
            )}
          </div>
          <div className={styles.heroCopy}>
            <h1 className={styles.heroName}>{item.name}</h1>
            {handle ? <p className={styles.heroBy}>by {handle}</p> : null}
            <p className={styles.heroCat}>{item.category?.name || item.typeLabel || item.type}</p>
          </div>
        </section>

        <section className={styles.stats} aria-label="Details">
          <div className={styles.stat}>
            <span className={styles.statValue}>{version}</span>
            <span className={styles.statLabel}>Version</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{size}</span>
            <span className={styles.statLabel}>Size</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{downloads}</span>
            <span className={styles.statLabel}>Downloads</span>
          </div>
        </section>

        <button type="button" className={styles.download} onClick={download}>
          <DownloadIcon size={16} strokeWidth={2.2} />
          Download
        </button>

        {shots.length > 0 ? (
          <div className={styles.gallery} aria-label={isShot ? "Screenshots" : "Banners"}>
            {shots.map((src) => (
              <div key={src} className={isShot ? styles.shot : styles.banner}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" />
              </div>
            ))}
          </div>
        ) : null}

        {about ? (
          <section className={styles.about}>
            <h2 className={styles.aboutTitle}>About</h2>
            <p className={styles.aboutBody}>{about}</p>
          </section>
        ) : null}

        <div className={styles.actions} aria-label="Actions">
          <button type="button" className={styles.action} onClick={() => show("Comments are next.", "success")}>
            <span className={styles.actionIcon}>
              <CommentIcon size={16} />
            </span>
            <span className={styles.actionLabel}>Comment</span>
          </button>
          <button
            type="button"
            className={`${styles.action} ${item.viewer.liked ? styles.actionLiked : ""}`}
            onClick={() => react("like")}
            aria-pressed={item.viewer.liked}
          >
            <span className={styles.actionIcon}>
              <HeartIcon size={16} filled={item.viewer.liked} />
            </span>
            <span className={styles.actionLabel}>{item.viewer.liked ? "Liked" : "Like"}</span>
          </button>
          <button
            type="button"
            className={`${styles.action} ${item.viewer.saved ? styles.actionOn : ""}`}
            onClick={() => react("save")}
            aria-pressed={item.viewer.saved}
          >
            <span className={styles.actionIcon}>
              <BookmarkIcon size={16} filled={item.viewer.saved} />
            </span>
            <span className={styles.actionLabel}>{item.viewer.saved ? "Saved" : "Save"}</span>
          </button>
          <button type="button" className={styles.action} onClick={share}>
            <span className={styles.actionIcon}>
              <ShareIcon size={16} />
            </span>
            <span className={styles.actionLabel}>Share</span>
          </button>
          <button type="button" className={styles.action} onClick={() => show("Report sent.", "success")}>
            <span className={styles.actionIcon}>
              <FlagIcon size={16} />
            </span>
            <span className={styles.actionLabel}>Report</span>
          </button>
        </div>

        <section className={styles.recs}>
          <h2 className={styles.recsHead}>More like this</h2>
          {recs.length === 0 ? (
            <p className={styles.empty}>No related drops yet.</p>
          ) : (
            <div className={styles.recRail}>
              {recs.map((it) => (
                <Link key={it.id} href={`/item/${it.id}`} className={styles.rec}>
                  <div className={`${styles.recArt} ${it.buildArtwork ? "" : toneClass(it.tone)}`}>
                    {it.buildArtwork ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.buildArtwork} alt="" />
                    ) : null}
                  </div>
                  <p className={styles.recName}>{it.name}</p>
                  <p className={styles.recMeta}>{it.category?.name || it.typeLabel}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  );
}
