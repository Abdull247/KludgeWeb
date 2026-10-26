import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in — Kludge",
  description: "Sign in to Kludge with Google or GitHub to share and discover projects and resources.",
  openGraph: {
    title: "Sign in — Kludge",
    description: "Sign in to Kludge with Google or GitHub.",
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
