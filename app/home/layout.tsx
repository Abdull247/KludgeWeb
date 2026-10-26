import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home — Kludge",
  description: "Your Kludge home.",
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
