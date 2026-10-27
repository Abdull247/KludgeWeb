import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Kludge",
  description: "Admin console on Kludge.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
