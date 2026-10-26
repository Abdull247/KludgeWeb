export const NAV = [
  { label: "Explore", slug: "explore", hint: "Trending projects", menu: true },
  { label: "Resources", slug: "resources", hint: "Assets, kits & snippets", menu: false },
  { label: "Stacks", slug: "stacks", hint: "Browse by technology", menu: true },
  { label: "Designers", slug: "designers", hint: "UI kits, icons, type", menu: false },
  { label: "Community", slug: "community", hint: "Discussions & showcases", menu: false },
] as const;

export const STACKS = [
  "React",
  "Vue",
  "Svelte",
  "Next.js",
  "Rust",
  "Go",
  "Python",
  "Django",
  "Flutter",
  "Swift",
  "Kotlin",
  "Laravel",
  "Node",
  "Figma",
  "Blender",
  "Unity",
  "Tailwind",
  "Postgres",
];

export const FEATURES = [
  {
    t: "Any stack, one shelf",
    d: "Templates, libraries, CLIs and dotfiles — tagged by language and framework so you find the right thing fast.",
    k: "templates · libs · clis",
  },
  {
    t: "Made for designers too",
    d: "UI kits, icon sets, fonts, mockups and 3D assets live right next to the code that uses them.",
    k: "ui kits · icons · 3d",
  },
  {
    t: "Fork, don't copy-paste",
    d: "Pull any project into your GitHub in one click with its license and credits intact.",
    k: "one-click fork",
  },
  {
    t: "Real people, real work",
    d: "Profiles show what someone shipped, not how many followers they have.",
    k: "profiles",
  },
];

export const STEPS = [
  { t: "Drop it in", d: "Link a repo or upload files. We read the stack and tag it for you." },
  { t: "Get found", d: "Your work shows up where people actually search — by stack, use case and type." },
  { t: "Watch it grow", d: "Forks, remixes and feedback roll back to you with credit attached." },
];

export const FOOTER_COLS = [
  { t: "Platform", l: ["explore", "resources", "stacks", "designers"] },
  { t: "Company", l: ["about", "blog", "careers", "changelog"] },
  { t: "Legal", l: ["terms", "privacy", "licenses"] },
];
