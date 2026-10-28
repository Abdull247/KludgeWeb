"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageTopBar } from "@/components/PageTopBar";
import { ArrowRight } from "@/components/Icons";
import { Spinner } from "@/components/Spinner";
import { Toast, useToast } from "@/components/Toast";
import { useAuthProfile } from "@/lib/useAuthProfile";
import { fetchVisitor, type Visitor } from "@/lib/home";
import styles from "../admin.module.css";

function VisitorDetail() {
  const profile = useAuthProfile();
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const { toast, show, dismiss } = useToast();
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!profile || !id) return;
    let live = true;
    fetchVisitor(id).then((res) => {
      if (!live) return;
      if (!res.data) {
        setMissing(true);
        show(res.error ?? "visit not found", "error");
        return;
      }
      setVisitor(res.data);
    });
    return () => {
      live = false;
    };
  }, [profile, id, show]);

  if (!profile) {
    return (
      <div className={styles.page}>
        <div className={styles.boot}>
          <Spinner size={22} />
        </div>
      </div>
    );
  }

  const guest = visitor ? !(visitor.authenticated || visitor.email || visitor.username) : false;
  const when = visitor ? new Date(visitor.createdAt).toLocaleString() : "";

  return (
    <div className={styles.page}>
      <PageTopBar title="Visitor details" />
      <main className={styles.main}>
        {missing ? (
          <p className={styles.empty}>That visit is gone from the log.</p>
        ) : !visitor ? (
          <div className={styles.boot}>
            <Spinner size={18} />
          </div>
        ) : (
          <>
            <section className={styles.hero}>
              <p className={styles.kicker}>Visitors log</p>
              <h1 className={styles.title}>{visitor.name || visitor.username || "Guest visitor"}</h1>
              <p className={styles.lede}>{visitor.email || (guest ? "Unidentified browser on your site." : `@${visitor.username}`)}</p>
            </section>

            <article className={styles.card}>
              {visitor.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={styles.adminAvatar} src={visitor.avatarUrl} alt="" />
              ) : (
                <span className={`${styles.mark} ${styles.tonec}`}>{guest ? "GU" : (visitor.name || visitor.username || "?").slice(0, 2).toUpperCase()}</span>
              )}
              <div className={styles.cardMain}>
                <p className={styles.cardName}>
                  {guest ? "Guest" : "Signed in"}
                  <span className={`${styles.badge} ${guest ? styles.badgeGuest : styles.badgeUser}`}>{guest ? "guest" : "known"}</span>
                </p>
                {visitor.username ? <p className={styles.cardCat}>@{visitor.username}</p> : null}
                <p className={styles.adminEmail}>{visitor.email || "no email — anonymous session"}</p>
              </div>
            </article>

            <p className={styles.section}>Visit</p>
            <article className={styles.card}>
              <div className={styles.cardMain}>
                <div className={styles.kv}>
                  <div className={styles.kvRowBlock}>
                    <p className={styles.kvKey}>Item</p>
                    <p className={styles.kvVal}>{visitor.itemName}</p>
                  </div>
                  <div className={styles.kvRowBlock}>
                    <p className={styles.kvKey}>Item id</p>
                    <p className={`${styles.kvVal} ${styles.adminEmail}`}>{visitor.itemId}</p>
                  </div>
                  <div className={styles.kvRowBlock}>
                    <p className={styles.kvKey}>When</p>
                    <p className={styles.kvVal}>{when}</p>
                  </div>
                </div>
              </div>
            </article>
            <Link href={`/item?id=${encodeURIComponent(visitor.itemId)}`} className={styles.card}>
              <div className={styles.cardMain}>
                <p className={styles.cardName}>Open item page</p>
              </div>
              <ArrowRight size={14} />
            </Link>

            <p className={styles.section}>Browser</p>
            <article className={styles.card}>
              <div className={styles.cardMain}>
                <div className={styles.kv}>
                  <div className={styles.kvRowBlock}>
                    <p className={styles.kvKey}>IP address</p>
                    <p className={`${styles.kvVal} ${styles.adminEmail}`}>{visitor.ipAddress || "unknown"}</p>
                  </div>
                  <div className={styles.kvRowBlock}>
                    <p className={styles.kvKey}>Languages</p>
                    <p className={styles.kvVal}>{visitor.language || "unknown"}</p>
                  </div>
                  <div className={styles.kvRowBlock}>
                    <p className={styles.kvKey}>Came from</p>
                    <p className={styles.kvVal}>{visitor.referer || "direct / not sent"}</p>
                  </div>
                  <div className={styles.kvRowBlock}>
                    <p className={styles.kvKey}>User agent</p>
                    <p className={styles.kvVal}>{visitor.userAgent || "unknown"}</p>
                  </div>
                </div>
              </div>
            </article>
          </>
        )}
      </main>
      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  );
}

export default function AdminVisitorPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.page}>
          <div className={styles.boot}>
            <Spinner size={22} />
          </div>
        </div>
      }
    >
      <VisitorDetail />
    </Suspense>
  );
}
