import { api, apiUrl, TEST_TOKEN } from "./api";
import { cachedItem, cachedRecs, once, patchCachedItem, rememberItem, rememberRecs, seedItems } from "./cache";

export type StatTab = "builds" | "creators" | "apis";

export type Pagination = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage: number | null;
  prevPage: number | null;
};

export type Metric = {
  key: string;
  label: string;
  value: number;
  display: string;
};

export type ItemStats = {
  saves: number;
  likes: number;
  forks: number;
  pulls: number;
  runs: number;
  followers: number;
  builds: number;
};

export type ViewerState = {
  saved: boolean;
  liked: boolean;
  owner?: boolean;
  admin?: boolean;
};

export type VerificationStatus = "pending" | "verified" | "rejected";

export type CreatorRef = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  verified: boolean;
};

export type Publisher = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  kind: "user" | "automation";
  verified: boolean;
};

export type CategoryRef = {
  id: string;
  slug: string;
  name: string;
};

export type SubItem = {
  id: string;
  name: string;
  type: string;
  mark?: string;
};

export type CatalogItem = {
  id: string;
  slug: string;
  name: string;
  type: string;
  kind: string;
  mark: string;
  tone: string;
  blurb: string;
  description: string;
  version?: string;
  sizeBytes?: number;
  sizeDisplay?: string;
  downloads?: number;
  typeLabel?: string;
  buildArtwork: string;
  banners?: string[];
  galleryKind?: "banners" | "screenshots";
  categoryId: string;
  sectionId: string;
  category: CategoryRef;
  stats: ItemStats;
  metric: Metric;
  viewer: ViewerState;
  creator?: CreatorRef;
  publisher?: Publisher;
  sourceUrl?: string;
  tags: string[];
  subItems?: SubItem[];
  publishedAt: string;
  updatedAt: string;
  trendingScore: number;
  verificationStatus?: VerificationStatus;
  rejectionReason?: string;
  verifiedAt?: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  sectionId: string;
  itemCount: number;
  href: string;
};

export type ItemPage = {
  items: CatalogItem[];
  pagination: Pagination;
};

export type Section = {
  id: string;
  slug: string;
  kind: string;
  title: string;
  subtitle: string;
  itemCount: number;
  href: string;
  categories?: Category[];
  feed: ItemPage;
  trending?: ItemPage;
};

export type Rail = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  algorithm?: string;
  href: string;
  items: CatalogItem[];
  pagination: Pagination;
};

export type HomeFeed = {
  generatedAt: string;
  viewer: {
    id: string;
    username: string;
    greetingName: string;
    fullName: string;
    avatarUrl: string;
  };
  search: {
    placeholder: string;
    chips: CategoryRef[];
  };
  sections: Section[];
  rails: {
    trending: Rail;
    dropped: Rail;
    collections: Rail;
  };
};

export type ToggleResult = {
  id: string;
  viewer: ViewerState;
  stats: ItemStats;
  metric: Metric;
};

export type ItemTypeDef = {
  slug: string;
  label: string;
  kind: string;
  categoryId: string;
  sectionId: string;
  galleryKind?: "banners" | "screenshots";
};

export type CreateItemInput = {
  name: string;
  description: string;
  type: string;
  version?: string;
  artworkUrl: string;
  bannerUrls?: string[];
  tags?: string[];
  sourceUrl?: string;
  publishedAt?: string;
};

export type RecommendResult = {
  seedId: string;
  items: CatalogItem[];
};

export function fetchItem(id: string) {
  return api<CatalogItem>(`/api/v1/items/${encodeURIComponent(id)}`).then((res) => {
    if (res.data) rememberItem(res.data);
    return res;
  });
}

export function fetchRecommends(id: string) {
  return api<RecommendResult>(`/api/v1/items/${encodeURIComponent(id)}/recommends`).then((res) => {
    if (res.data) rememberRecs(id, res.data.items);
    return res;
  });
}

export function prefetchItem(id: string) {
  if (!id) return;
  const hit = cachedItem(id);
  const full = Boolean(hit && (hit.sizeDisplay || hit.typeLabel));
  const related = cachedRecs(id);
  if (full && related) return;
  void once(`item:${id}`, async () => {
    await Promise.all([
      full ? Promise.resolve() : fetchItem(id).then(() => undefined),
      related ? Promise.resolve() : fetchRecommends(id).then(() => undefined),
    ]);
  });
}

export function fetchHome() {
  return api<HomeFeed>("/api/v1/home").then((res) => {
    if (res.data) {
      seedItems(res.data.rails.trending.items);
      seedItems(res.data.rails.dropped.items);
      seedItems(res.data.rails.collections.items);
      for (const s of res.data.sections) seedItems(s.feed.items);
    }
    return res;
  });
}

export function fetchSection(id: string, page = 1, perPage = 12, q = "") {
  const params = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  if (q.trim()) params.set("q", q.trim());
  return api<Section>(`/api/v1/sections/${id}?${params}`).then((res) => {
    if (res.data) seedItems(res.data.feed.items);
    return res;
  });
}

export function fetchCategory(id: string, page = 1, perPage = 12) {
  const params = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  return api<{ category: Category; items: CatalogItem[]; pagination: Pagination }>(
    `/api/v1/categories/${id}?${params}`,
  );
}

export function toggleSave(id: string) {
  return api<ToggleResult>(`/api/v1/items/${id}/save`, { method: "POST" });
}

export function toggleLike(id: string) {
  return api<ToggleResult>(`/api/v1/items/${id}/like`, { method: "POST" });
}

export function patchItem(item: CatalogItem, res: ToggleResult): CatalogItem {
  const next = { ...item, viewer: res.viewer, stats: res.stats, metric: res.metric };
  patchCachedItem(next);
  return next;
}

export function fetchItemTypes() {
  return api<ItemTypeDef[]>("/api/v1/types");
}

export function createItem(input: CreateItemInput) {
  return api<CatalogItem>("/api/v1/items", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function recordItem(input: CreateItemInput) {
  return api<CatalogItem>("/api/v1/items/record", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export type TagDef = {
  slug: string;
  label: string;
};

export function fetchTags() {
  return api<TagDef[]>("/api/v1/tags");
}

export type UploadObject = {
  key: string;
  url: string;
  contentType: string;
  size: number;
  kind: string;
};

export type UploadLimits = {
  maxBytes: number;
  maxDisplay: string;
  imageTypes: string[];
  sourceTypes: string[];
  zipForMultiple: boolean;
};

export function fetchUploadLimits() {
  return api<UploadLimits>("/api/v1/uploads/limits");
}

export async function uploadAsset(file: File, kind: "artwork" | "banner" | "source") {
  const headers = new Headers();
  headers.set("Accept", "application/json");
  if (TEST_TOKEN) headers.set("Authorization", `Bearer ${TEST_TOKEN}`);

  const body = new FormData();
  body.append("file", file);

  let res: Response;
  try {
    res = await fetch(apiUrl(`/api/v1/uploads?kind=${kind}`), {
      method: "POST",
      headers,
      body,
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    return { status: 0, error: "could not reach the server" as string, data: undefined as UploadObject | undefined };
  }

  const json = (await res.json().catch(() => ({}))) as { data?: UploadObject; error?: string };
  return { data: json.data, error: json.error, status: res.status };
}

export type AdminTab = "builds" | "users" | "apis";

export type AdminUser = {
  id: string;
  email: string;
  fullName: string;
  username: string;
  avatarUrl: string;
  role: string;
  onboardingCompleted: boolean;
  projectCount: number;
  createdAt: string;
};

export type AdminStats = {
  users: number;
  projects: number;
  builds: number;
  apis: number;
};

export type AdminHome = {
  generatedAt: string;
  admin: boolean;
  viewer: {
    id: string;
    username: string;
    greetingName: string;
    fullName: string;
    avatarUrl: string;
  };
  stats: AdminStats;
  projects: CatalogItem[];
  apis: CatalogItem[];
  users: AdminUser[];
};

export type AdminUserList = {
  users: AdminUser[];
  total: number;
};

export type AdminProjectList = {
  projects: CatalogItem[];
  total: number;
};

export function fetchAdminHome() {
  return api<AdminHome>("/api/v1/admin/home");
}

export function fetchAdminUsers() {
  return api<AdminUserList>("/api/v1/admin/users");
}

export function fetchAdminProjects() {
  return api<AdminProjectList>("/api/v1/admin/projects");
}

export type RequestList = {
  items: CatalogItem[];
  pagination: Pagination;
  total: number;
};

export function fetchAdminRequests(q = "", type = "") {
  const params = new URLSearchParams();
  if (q.trim()) params.set("q", q.trim());
  if (type && type !== "all") params.set("type", type);
  const qs = params.toString();
  return api<RequestList>(`/api/v1/admin/requests${qs ? `?${qs}` : ""}`).then((res) => {
    if (res.data) seedItems(res.data.items);
    return res;
  });
}

export function verifyItem(id: string) {
  return api<CatalogItem>(`/api/v1/admin/items/${encodeURIComponent(id)}/verify`, { method: "POST" }).then((res) => {
    if (res.data) rememberItem(res.data);
    return res;
  });
}

export function rejectItem(id: string, reason: string) {
  return api<CatalogItem>(`/api/v1/admin/items/${encodeURIComponent(id)}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  }).then((res) => {
    if (res.data) rememberItem(res.data);
    return res;
  });
}

export type ProfileStats = {
  projects: number;
  downloads: number;
  likes: number;
  saves: number;
  pending: number;
  rejected: number;
};

export type ProfileFeed = {
  viewer: {
    id: string;
    username: string;
    greetingName: string;
    fullName: string;
    avatarUrl: string;
  };
  stats: ProfileStats;
  pending: CatalogItem[];
  rejected: CatalogItem[];
  published: CatalogItem[];
  saved: CatalogItem[];
  liked: CatalogItem[];
};

export type ItemList = {
  items: CatalogItem[];
  total: number;
};

export function fetchMyProfile() {
  return api<ProfileFeed>("/api/v1/me").then((res) => {
    if (res.data) {
      seedItems(res.data.pending);
      seedItems(res.data.rejected);
      seedItems(res.data.published);
      seedItems(res.data.saved);
      seedItems(res.data.liked);
    }
    return res;
  });
}

export function fetchMyPending() {
  return api<ItemList>("/api/v1/me/pending").then((res) => {
    if (res.data) seedItems(res.data.items);
    return res;
  });
}

export function fetchMyRejected() {
  return api<ItemList>("/api/v1/me/rejected").then((res) => {
    if (res.data) seedItems(res.data.items);
    return res;
  });
}
