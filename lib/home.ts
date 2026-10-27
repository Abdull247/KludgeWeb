import { api, TEST_TOKEN } from "./api";

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
};

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
  buildArtwork: string;
  banners?: string[];
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

export function fetchHome() {
  return api<HomeFeed>("/api/v1/home");
}

export function fetchSection(id: string, page = 1, perPage = 12, q = "") {
  const params = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  if (q.trim()) params.set("q", q.trim());
  return api<Section>(`/api/v1/sections/${id}?${params}`);
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
  return { ...item, viewer: res.viewer, stats: res.stats, metric: res.metric };
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
    res = await fetch(`/api/v1/uploads?kind=${kind}`, {
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
