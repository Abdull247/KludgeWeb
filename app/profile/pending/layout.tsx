import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pending verifications — Kludge",
  description: "Your builds waiting on review.",
};

export default function PendingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
