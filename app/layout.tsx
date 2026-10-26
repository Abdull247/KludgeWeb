import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kludge — Share projects & resources for every stack",
    template: "%s",
  },
  description:
    "Discover, fork and share projects, templates, UI kits and assets for every stack. Built for developers and designers.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Kludge — Share projects & resources for every stack",
    description: "Discover, fork and share projects, templates, UI kits and assets for every stack.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
