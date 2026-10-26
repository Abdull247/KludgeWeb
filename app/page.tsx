import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LogoMark } from "@/components/Logo";
import { Pill, Reveal } from "@/components/Reveal";
import { ArrowDown, ArrowRight, ArrowUpRight } from "@/components/Icons";
import { FEATURES, STACKS, STEPS } from "@/lib/nav";
import styles from "./home.module.css";

export default function Home() {
  return (
    <div className={`bg-page ${styles.page}`}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.pillIn}>
            <Pill>
              <LogoMark size={12} /> Now in early access
            </Pill>
          </div>
          <h1 className={`text-gradient ${styles.title}`}>
            Everything you build with, shared in one place
          </h1>
          <p className={styles.lede}>
            Projects, starters, UI kits and assets for every stack. Post what you made, grab what you need.
          </p>
          <div className={styles.ctas}>
            <Link href="/auth" className={`btn-ink ${styles.ctaPrimary}`}>
              Start sharing <ArrowRight size={16} className={styles.arrow} />
            </Link>
            <Link href="/explore" className={`glass btn-glass ${styles.ctaGhost}`}>
              Browse projects
            </Link>
          </div>
        </div>

        <div className={styles.horizonWrap}>
          <div className={styles.horizonClip}>
            <div className="horizon" />
          </div>
          <a href="#why" aria-label="Scroll down" className={`glass ${styles.scrollCue}`}>
            <span className={styles.scrollBounce}>
              <ArrowDown size={16} />
            </span>
          </a>
        </div>
      </section>

      <section className={styles.marqueeSection}>
        <Reveal>
          <p className={styles.marqueeLabel}>Works with whatever you&apos;re building in</p>
        </Reveal>
        <div className={styles.marqueeMask}>
          <div className={styles.marqueeTrack}>
            {[...STACKS, ...STACKS].map((s, i) => (
              <span key={`${s}-${i}`} className={`glass ${styles.chip}`}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className={styles.why}>
        <div className={styles.whyGrid}>
          <Reveal>
            <div className={styles.whySticky}>
              <Pill>Why Kludge</Pill>
              <h2 className={`text-gradient ${styles.whyTitle}`}>Less digging. More building.</h2>
              <p className={styles.whyCopy}>
                One place for the code, the kits and the assets — sorted the way you actually look for them.
              </p>
            </div>
          </Reveal>
          <ul className={styles.featureList}>
            {FEATURES.map((f, i) => (
              <Reveal key={f.t} delay={i * 0.06}>
                <li className={styles.featureItem}>
                  <span className={styles.featureNum}>0{i + 1}</span>
                  <div>
                    <h3 className={styles.featureTitle}>{f.t}</h3>
                    <p className={styles.featureDesc}>{f.d}</p>
                  </div>
                  <span className={styles.featureTag}>{f.k}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.how}>
        <Reveal className={styles.howHead}>
          <Pill>How it works</Pill>
          <h2 className={`text-gradient ${styles.howTitle}`}>From your repo to someone&apos;s next project</h2>
        </Reveal>
        <ol className={styles.steps}>
          <div className={styles.stepsLine} />
          {STEPS.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.12}>
              <li className={styles.step}>
                <span className={styles.stepNum}>{i + 1}</span>
                <h3 className={styles.stepTitle}>{s.t}</h3>
                <p className={styles.stepDesc}>{s.d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className={styles.ctaBanner}>
        <Reveal>
          <Link href="/auth" className={styles.ctaLink}>
            <div className={styles.ctaInner}>
              <div>
                <p className={styles.ctaKicker}>Early access is open</p>
                <h2 className={`text-gradient ${styles.ctaTitle}`}>Your side project deserves an audience.</h2>
              </div>
              <span className={styles.ctaAction}>
                Claim your handle
                <span className={styles.ctaIcon}>
                  <ArrowUpRight size={20} />
                </span>
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
