export type AppNavItem = { label: string; href: string; hint: string };

export const APP_NAV: AppNavItem[] = [
  { label: "Home", href: "/home", hint: "Your feed" },
  { label: "Explore", href: "/explore", hint: "Trending builds & kits" },
  { label: "Publish", href: "/add", hint: "Drop a build" },
  { label: "Collections", href: "/collections", hint: "Saved builds" },
  { label: "Profile", href: "/profile", hint: "Your handle" },
];

export const ADMIN_NAV: AppNavItem[] = [
  { label: "Users", href: "/admin/users", hint: "Every account on Kludge" },
  { label: "Requests", href: "/admin/requests", hint: "Pending reviews & reports" },
  { label: "Activity", href: "/admin/activity", hint: "Drops, likes, and ingest" },
  { label: "Status", href: "/admin/status", hint: "Uptime and ingest health" },
];

export const NAV = [
  { label: "Explore", slug: "explore", hint: "Trending apps & mods", menu: true },
  { label: "Categories", slug: "categories", hint: "APKs, APIs & agentic tools", menu: true },
  { label: "Creators", slug: "creators", hint: "Devs & reverse engineers", menu: false },
  { label: "Playgrounds", slug: "playgrounds", hint: "Live API testing", menu: false },
  { label: "Community", slug: "community", hint: "Discussions & showcases", menu: false },
] as const;

export const STACKS = [
  "Modded APK",
  "Premium Unlock",
  "AI Jailbreak",
  "Agentic API",
  "Prompt Injection",
  "Reverse Engineering",
  "Proxy/SOCKS5",
  "Scrapers",
  "Bypass Tools",
  "Webhooks",
  "Custom ROM",
  "Root Modules",
  "Frida Hooks",
  "REST/GraphQL",
  "Cloudflare Bypass",
  "Unofficial SDK",
  "Cross-platform",
  "Unsigned Builds",
];

export const FEATURES = [
  {
    t: "Anything goes, all in one place",
    d: "Modded apps, leaked APIs, jailbreak prompts and bypass scripts — tagged by platform and capability so you find the right tool fast.",
    k: "apks · apis · jailbreaks",
  },
  {
    t: "Built for the grey area",
    d: "Agentic workflows, uncensored models and unofficial SDKs live right next to the tools that break them.",
    k: "agentic · mods · leaks",
  },
  {
    t: "Hashes, not blind trust",
    d: "Every build comes with its SHA-256, version history and permissions list. Fork the source or download the binary.",
    k: "sha-256 · versions",
  },
  {
    t: "Creators, not influencers",
    d: "Profiles show what someone actually shipped — hooks, patches, and modded builds — not their follower count.",
    k: "devs · modders",
  },
];

export const STEPS = [
  { t: "Drop it in", d: "Upload the APK or link the repo/endpoint. We hash it, read the manifest, and tag the capabilities." },
  { t: "Get found", d: "Your build shows up where people search — by platform, bypass type, or agentic use case." },
  { t: "Watch it run", d: "Download counts, forks and exploit reports roll back to you with attribution attached." },
];

export const FOOTER_COLS = [
  { t: "Platform", l: ["explore", "categories", "creators", "playgrounds"] },
  { t: "Company", l: ["about", "blog", "status", "changelog"] },
  { t: "Legal", l: ["terms", "privacy", "dmca"] },
];