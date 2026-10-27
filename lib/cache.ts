import type { Profile } from "./api";
import type { CatalogItem, HomeFeed, Section, StatTab } from "./home";

type HomeSnap = {
  home: HomeFeed;
  section: Section | null;
  tab: StatTab;
  ready: boolean;
  isAdmin: boolean | null;
  dashboard: "admin" | "user";
  sectionIds: Record<string, string>;
};

let profile: Profile | null = null;
let homeSnap: HomeSnap | null = null;
const items = new Map<string, CatalogItem>();
const recs = new Map<string, CatalogItem[]>();
const inflight = new Map<string, Promise<void>>();

export function cachedProfile() {
  return profile;
}

export function rememberProfile(next: Profile) {
  profile = next;
}

export function cachedHome() {
  return homeSnap;
}

export function rememberHome(next: HomeSnap) {
  homeSnap = next;
  seedItems(next.home.rails.trending.items);
  seedItems(next.home.rails.dropped.items);
  seedItems(next.home.rails.collections.items);
  for (const s of next.home.sections) seedItems(s.feed.items);
  if (next.section) seedItems(next.section.feed.items);
}

export function rememberItem(it: CatalogItem) {
  items.set(it.id, it);
  if (it.slug) items.set(it.slug, it);
}

export function seedItems(list: CatalogItem[]) {
  for (const it of list) rememberItem(it);
}

export function cachedItem(id: string) {
  return items.get(id) ?? null;
}

export function rememberRecs(id: string, list: CatalogItem[]) {
  recs.set(id, list);
  seedItems(list);
  const it = items.get(id);
  if (it?.slug) recs.set(it.slug, list);
}

export function cachedRecs(id: string) {
  return recs.get(id) ?? null;
}

export function patchCachedItem(next: CatalogItem) {
  rememberItem(next);
  if (!homeSnap) return;
  const mapRail = (list: CatalogItem[]) => list.map((it) => (it.id === next.id ? { ...it, ...next } : it));
  homeSnap = {
    ...homeSnap,
    home: {
      ...homeSnap.home,
      rails: {
        trending: { ...homeSnap.home.rails.trending, items: mapRail(homeSnap.home.rails.trending.items) },
        dropped: { ...homeSnap.home.rails.dropped, items: mapRail(homeSnap.home.rails.dropped.items) },
        collections: { ...homeSnap.home.rails.collections, items: mapRail(homeSnap.home.rails.collections.items) },
      },
      sections: homeSnap.home.sections.map((s) => ({
        ...s,
        feed: { ...s.feed, items: s.feed.items.map((it) => (it.id === next.id ? { ...it, ...next } : it)) },
      })),
    },
    section: homeSnap.section
      ? {
          ...homeSnap.section,
          feed: {
            ...homeSnap.section.feed,
            items: homeSnap.section.feed.items.map((it) => (it.id === next.id ? { ...it, ...next } : it)),
          },
        }
      : homeSnap.section,
  };
}

export function once(key: string, run: () => Promise<void>) {
  const hit = inflight.get(key);
  if (hit) return hit;
  const p = run().finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}
