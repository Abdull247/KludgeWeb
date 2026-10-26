import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A few details — Kludge",
  description: "Tell us if you have a coding background so we can tailor Kludge for you.",
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
