import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drop a build — Kludge",
  description: "Share a build, API, or kit on Kludge.",
};

export default function AddLayout({ children }: { children: React.ReactNode }) {
  return children;
}
