"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageTopBar } from "@/components/PageTopBar";
import { Spinner } from "@/components/Spinner";
import { Toast, useToast } from "@/components/Toast";
import { useAuthProfile } from "@/lib/useAuthProfile";
import { fetchMyPending, prefetchItem, type CatalogItem } from "@/lib/home";
import styles from "../profile.module.css";

function toneClass(tone: string) {
  return styles[`tone${tone}`] ?? styles.tonea;
}

export default function PendingPage() {
  const profile = useAuthProfile();
  const { toast, show, dismiss } = useToast();
  const [items, setItems] = useState<CatalogItem[] | null>(null);

  useEffect(() => {
    if (!profile) return;
    let live = true;
    fetchMyPending().then((res) => {
      if (!live) return;
      if (!res.data) {
        show(res.error ?? "could not load pending builds", "error");
        setItems([]);
        return;
      }
      setItems(res.data.items);
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

  return (
    <div className={styles.page}>
      <PageTopBar title="Pending verifications" />
      <main className={styles.main}>
        {items === null ? (
          <div className={styles.boot}>
            <Spinner size={18} />
          </div>
        ) : items.length === 0 ? (
          <p className={styles.empty}>Nothing waiting on review.</p>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              href={`/item?id=${encodeURIComponent(item.id)}`}
              className={styles.card}
              onPointerEnter={() => prefetchItem(item.id)}
            >
              <span className={`${styles.mark} ${item.buildArtwork ? "" : toneClass(item.tone)}`}>
                {item.buildArtwork ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.buildArtwork} alt="" />
                ) : (
                  item.mark
                )}
              </span>
              <div className={styles.cardMain}>
                <p className={styles.cardName}>{item.name}</p>
                <p className={styles.cardCat}>{item.category?.name || item.typeLabel || item.type}</p>
                <p className={styles.cardBlurb}>{item.blurb}</p>
              </div>
            </Link>
          ))
        )}
      </main>
      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  );
}
