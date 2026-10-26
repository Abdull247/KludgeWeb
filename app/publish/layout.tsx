import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publish — Kludge",
  description: "Share a build, API, or kit on Kludge.",
};

export default function PublishLayout({ children }: { children: React.ReactNode }) {
  return children;
}
