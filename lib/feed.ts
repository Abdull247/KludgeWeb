export type StatTab = "builds" | "creators" | "apis";

export const STATS: { id: StatTab; label: string; count: number }[] = [
  { id: "builds", label: "Builds", count: 248 },
  { id: "creators", label: "Creators", count: 86 },
  { id: "apis", label: "APIs", count: 41 },
];

export type CoverTone = "a" | "b" | "c" | "d" | "e" | "f";

export type RailItem = {
  id: string;
  title: string;
  tag: string;
  meta: string;
  tone: CoverTone;
};

export const TRENDING: RailItem[] = [
  { id: "orbit", title: "Orbit UI Kit", tag: "Figma", meta: "980 saves", tone: "a" },
  { id: "frida", title: "Frida Starter", tag: "Hooks", meta: "412 forks", tone: "b" },
  { id: "noclip", title: "Noclip APK", tag: "Android", meta: "2.1k pulls", tone: "c" },
  { id: "veil", title: "Veil Prompts", tag: "Jailbreak", meta: "640 saves", tone: "d" },
  { id: "relay", title: "Relay SOCKS", tag: "Proxy", meta: "219 runs", tone: "e" },
];

export const FRESH: RailItem[] = [
  { id: "rootkit", title: "Magisk Pack", tag: "Root", meta: "v26.4", tone: "f" },
  { id: "gql", title: "Ghost GraphQL", tag: "API", meta: "new", tone: "a" },
  { id: "rom", title: "Night ROM", tag: "Custom", meta: "A14", tone: "b" },
  { id: "hook", title: "Paywall Bypass", tag: "Patch", meta: "1.3.0", tone: "c" },
  { id: "sdk", title: "Unofficial SDK", tag: "TypeScript", meta: "beta", tone: "d" },
];

export type FeedItem = {
  id: string;
  name: string;
  mark: string;
  category: string;
  blurb: string;
  votes: number;
  tone: CoverTone;
};

export const FEED: FeedItem[] = [
  {
    id: "clipdio",
    name: "Noclip",
    mark: "N",
    category: "Modded APK",
    blurb: "Unlocked builds of popular Android apps — ads stripped, premium flags flipped, hashes posted with every drop.",
    votes: 42,
    tone: "a",
  },
  {
    id: "veilapi",
    name: "Veil API",
    mark: "V",
    category: "Agentic API",
    blurb: "An unofficial chat endpoint that ignores the usual refusals. Bring your own key, keep the transcripts local.",
    votes: 28,
    tone: "b",
  },
  {
    id: "hookkit",
    name: "Hookkit",
    mark: "H",
    category: "Frida",
    blurb: "A pocket of ready Frida scripts for SSL pinning, root hide, and receipt validation. Copy, attach, ship.",
    votes: 19,
    tone: "c",
  },
  {
    id: "dusk",
    name: "Dusk ROM",
    mark: "D",
    category: "Custom ROM",
    blurb: "A14-based, de-Googled, with per-app proxy and a silent update channel. Signed nightlies, SHA-256 on file.",
    votes: 11,
    tone: "d",
  },
];

export const COLLECTIONS: RailItem[] = [
  { id: "apk", title: "Weekend APKs", tag: "12 builds", meta: "by @amaka", tone: "e" },
  { id: "jail", title: "Jailbreak lab", tag: "8 prompts", meta: "by @ken", tone: "f" },
  { id: "proxy", title: "Quiet proxies", tag: "6 endpoints", meta: "by @nia", tone: "a" },
  { id: "sdkcol", title: "Leaked SDKs", tag: "9 packages", meta: "by @leo", tone: "b" },
];
