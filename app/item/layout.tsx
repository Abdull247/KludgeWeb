import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Item — Kludge",
  description: "Item details on Kludge.",
};

export default function ItemLayout({ children }: { children: React.ReactNode }) {
  return children;
}
