"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "-80px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className ?? ""}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return <span className="glass pill">{children}</span>;
}
