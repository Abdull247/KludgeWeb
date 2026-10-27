import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rejected verifications — Kludge",
  description: "Builds that did not pass review.",
};

export default function RejectedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
