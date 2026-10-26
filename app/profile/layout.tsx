import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile — Kludge",
  description: "Your Kludge profile.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
