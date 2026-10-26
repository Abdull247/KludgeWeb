import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { LogoMark } from "@/components/Logo";
import { ArrowLeft } from "@/components/Icons";
import styles from "../coming-soon.module.css";

type ComingSoonProps = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: ComingSoonProps): Promise<Metadata> {
  const { slug } = await params;
  const name = slug?.[0] || "page";
  return {
    title: "Coming soon — Kludge",
    description: "This part of Kludge is still being built. Check back soon.",
    openGraph: {
      title: `${name} is coming soon — Kludge`,
      description: "This part of Kludge is still being built.",
    },
  };
}

export default async function ComingSoon({ params }: ComingSoonProps) {
  const { slug } = await params;
  const name = slug?.[0] || "page";

  return (
    <div className={`bg-page ${styles.page}`}>
      <Navbar />
      <div className={`grid-lines ${styles.grid}`} />
      <div className={styles.horizonWrap}>
        <div className="horizon" />
      </div>
      <main className={styles.main}>
        <div className={`glass ${styles.mark}`}>
          <span className={styles.bob}>
            <LogoMark size={28} />
          </span>
        </div>
        <p className={styles.prompt}>
          $ kludge build /{name} <span>— in progress</span>
        </p>
        <h1 className={`text-gradient ${styles.title}`}>{name} is coming soon</h1>
        <p className={styles.copy}>We&apos;re still putting this part together. It&apos;ll be worth the wait.</p>
        <Link href="/" className={`glass ${styles.back}`}>
          <ArrowLeft size={16} /> Back home
        </Link>
      </main>
    </div>
  );
}
