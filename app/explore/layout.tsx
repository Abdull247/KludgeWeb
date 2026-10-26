import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore — Kludge",
  description: "Browse unofficial builds, APIs, and kits on Kludge.",
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
