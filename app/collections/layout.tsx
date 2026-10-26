import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections — Kludge",
  description: "Saved builds and kits on Kludge.",
};

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
