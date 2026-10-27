"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PageTopBar } from "@/components/PageTopBar";
import { SearchIcon } from "@/components/Icons";
import { Spinner } from "@/components/Spinner";
import { Toast, useToast } from "@/components/Toast";
import { useAuthProfile } from "@/lib/useAuthProfile";
import {
  fetchAdminRequests,
  fetchItemTypes,
  prefetchItem,
  type CatalogItem,
  type ItemTypeDef,
} from "@/lib/home";
import styles from "../admin.module.css";

function toneClass(tone: string) {
  return styles[`tone${tone}`] ?? styles.tonea;
}

export default function AdminRequestsPage() {
  const profile = useAuthProfile();
  const { toast, show, dismiss } = useToast();
  const [items, setItems] = useState<CatalogItem[] | null>(null);
  const [types, setTypes] = useState<ItemTypeDef[]>([]);
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(query), 220);
    return () => window.clearTimeout(t);
  }, [query]);

  useEffect(() => {
    fetchItemTypes().then((res) => {
      if (res.data) setTypes(res.data);
    });
  }, []);

  useEffect(() => {
    if (!profile) return;
    let live = true;
    fetchAdminRequests(debounced, type).then((res) => {
      if (!live) return;
      if (!res.data) {
        show(res.error ?? "could not load requests", "error");
        setItems([]);
        return;
      }
      setItems(res.data.items);
    });
    return () => {
      live = false;
    };
  }, [profile, debounced, type, show]);

  const chips = useMemo(() => [{ slug: "all", label: "All" }, ...types.map((t) => ({ slug: t.slug, label: t.label }))], [types]);

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
      <PageTopBar title="Requests" />
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.kicker}>Admin review</p>
          <h1 className={styles.title}>Pending builds</h1>
          <p className={styles.lede}>Locked until you verify them. Owners can still see their own drop.</p>
        </section>

        <div className={styles.chips} role="tablist" aria-label="Project type">
          {chips.map((c) => (
            <button
              key={c.slug}
              type="button"
              className={`${styles.chip} ${type === c.slug ? styles.chipOn : ""}`}
              onClick={() => setType(c.slug)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <label className={styles.search}>
          <SearchIcon size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pending builds"
            aria-label="Search pending builds"
          />
        </label>

        <section className={styles.list} aria-label="Pending requests">
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
                href={`/item/${item.id}`}
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
                  <p className={styles.cardCat}>
                    {item.category?.name || item.typeLabel || item.type}
                    {item.publisher ? ` · @${item.publisher.username}` : item.creator ? ` · @${item.creator.username}` : ""}
                  </p>
                  <p className={styles.cardBlurb}>{item.blurb}</p>
                </div>
              </Link>
            ))
          )}
        </section>
      </main>
      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  );
}
