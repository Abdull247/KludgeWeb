"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageTopBar } from "@/components/PageTopBar";
import { SearchIcon } from "@/components/Icons";
import { Spinner } from "@/components/Spinner";
import { Toast, useToast } from "@/components/Toast";
import { useAuthProfile } from "@/lib/useAuthProfile";
import { fetchVisitors, type Visitor } from "@/lib/home";
import styles from "../admin.module.css";

function timeAgo(iso: string) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const mins = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function visitorBucket(v: Visitor) {
  return v.authenticated || v.email || v.username ? "user" : "guest";
}

export default function AdminVisitorsPage() {
  const profile = useAuthProfile();
  const { toast, show, dismiss } = useToast();
  const [visitors, setVisitors] = useState<Visitor[] | null>(null);
  const [pagination, setPagination] = useState<{ page: number; totalPages: number; prevPage: number | null; nextPage: number | null } | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!profile) return;
    let live = true;
    // Debounce the search box so each keystroke does not hammer the log.
    const t = setTimeout(() => {
      fetchVisitors(page, 30, query).then((res) => {
        if (!live) return;
        if (!res.data) {
          show(res.error ?? "could not load visitors", "error");
          setVisitors([]);
          setPagination(null);
          return;
        }
        setVisitors(res.data.visitors);
        setPagination({
          page: res.data.pagination.page,
          totalPages: res.data.pagination.totalPages,
          prevPage: res.data.pagination.prevPage,
          nextPage: res.data.pagination.nextPage,
        });
        if (res.data.pagination.page !== page) setPage(res.data.pagination.page);
      });
    }, query ? 300 : 0);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [profile, page, query, show]);

  const rows = visitors ?? [];

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
      <PageTopBar title="Visitors log" />
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.kicker}>Admin</p>
          <h1 className={styles.title}>Every visitor</h1>
          <p className={styles.lede}>Who has been opening item pages, newest first.</p>
        </section>

        <label className={styles.search}>
          <SearchIcon size={16} />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Filter by name, email, item, IP"
            aria-label="Filter visitors"
          />
        </label>

        <section className={styles.list} aria-label="Visitors">
          {visitors === null ? (
            <div className={styles.boot}>
              <Spinner size={18} />
            </div>
          ) : rows.length === 0 ? (
            <p className={styles.empty}>No visits logged yet.</p>
          ) : (
            rows.map((v) => {
              const guest = visitorBucket(v) === "guest";
              return (
                <Link key={v.id} href={`/admin/visitor?id=${encodeURIComponent(v.id)}`} className={styles.card}>
                  {v.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className={styles.adminAvatar} src={v.avatarUrl} alt="" />
                  ) : (
                    <span className={`${styles.mark} ${styles.tonec}`}>{guest ? "GU" : (v.name || v.username || "?").slice(0, 2).toUpperCase()}</span>
                  )}
                  <div className={styles.cardMain}>
                    <p className={styles.cardName}>
                      {v.name || v.username || "Guest visitor"}
                      <span className={`${styles.badge} ${guest ? styles.badgeGuest : styles.badgeUser}`}>{guest ? "guest" : "signed in"}</span>
                    </p>
                    <p className={styles.cardCat}>{v.email || (guest ? v.ipAddress || "anonymous" : `@${v.username}`)}</p>
                    <p className={styles.cardBlurb}>{v.itemName}</p>
                  </div>
                  <p className={styles.whenMain}>{timeAgo(v.createdAt)}</p>
                </Link>
              );
            })
          )}
        </section>

        {pagination && pagination.totalPages > 1 ? (
          <div className={styles.pager}>
            <button type="button" className={styles.pagerBtn} disabled={pagination.prevPage === null} onClick={() => setPage(pagination.prevPage ?? 1)}>
              Prev
            </button>
            <span className={styles.pagerInfo}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button type="button" className={styles.pagerBtn} disabled={pagination.nextPage === null} onClick={() => setPage(pagination.nextPage ?? pagination.page)}>
              Next
            </button>
          </div>
        ) : null}
      </main>
      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  );
}
