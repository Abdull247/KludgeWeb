"use client";

import { useEffect, useMemo, useState } from "react";
import { PageTopBar } from "@/components/PageTopBar";
import { SearchIcon } from "@/components/Icons";
import { Spinner } from "@/components/Spinner";
import { Toast, useToast } from "@/components/Toast";
import { useAuthProfile } from "@/lib/useAuthProfile";
import { fetchAdminUsers, type AdminUser } from "@/lib/home";
import styles from "../admin.module.css";

export default function AdminUsersPage() {
  const profile = useAuthProfile();
  const { toast, show, dismiss } = useToast();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!profile) return;
    let live = true;
    fetchAdminUsers().then((res) => {
      if (!live) return;
      if (!res.data) {
        show(res.error ?? "could not load users", "error");
        setUsers([]);
        return;
      }
      setUsers(res.data.users);
    });
    return () => {
      live = false;
    };
  }, [profile, show]);

  const q = query.trim().toLowerCase();
  const rows = useMemo(() => {
    if (!users) return [];
    if (!q) return users;
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [users, q]);

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
      <PageTopBar title="Users" />
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.kicker}>Admin</p>
          <h1 className={styles.title}>Every account</h1>
          <p className={styles.lede}>People on Kludge, newest first.</p>
        </section>

        <label className={styles.search}>
          <SearchIcon size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name, handle, email"
            aria-label="Filter users"
          />
        </label>

        <section className={styles.list} aria-label="Users">
          {users === null ? (
            <div className={styles.boot}>
              <Spinner size={18} />
            </div>
          ) : rows.length === 0 ? (
            <p className={styles.empty}>No accounts match that.</p>
          ) : (
            rows.map((u) => (
              <article key={u.id} className={styles.card}>
                {u.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className={styles.adminAvatar} src={u.avatarUrl} alt="" />
                ) : (
                  <span className={`${styles.mark} ${styles.toneb}`}>{(u.username || "?").slice(0, 2)}</span>
                )}
                <div className={styles.cardMain}>
                  <p className={styles.cardName}>
                    {u.fullName || u.username}
                    {u.role === "admin" ? <span className={`${styles.adminRole} ${styles.adminRoleAdmin}`}>admin</span> : null}
                  </p>
                  <p className={styles.cardCat}>@{u.username}</p>
                  <p className={styles.adminEmail}>{u.email || "no email on file"}</p>
                </div>
                <p className={styles.count}>{u.projectCount}</p>
              </article>
            ))
          )}
        </section>
      </main>
      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  );
}
