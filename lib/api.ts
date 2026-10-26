export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "https://kludgeserver.onrender.com").replace(/\/$/, "");

export type Profile = {
  id: string;
  userId: string;
  fullName: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string;
  websiteUrl: string | null;
  location: string | null;
  role: string;
  accountStatus: string;
  emailVerified: boolean;
  hasCodingBackground: boolean | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

type Envelope<T> = {
  data?: T;
  error?: string;
  status: number;
};

export function apiUrl(path: string) {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${API_URL}${path}`;
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<Envelope<T>> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let res: Response;
  try {
    res = await fetch(apiUrl(path), {
      ...init,
      headers,
      credentials: "include",
    });
  } catch {
    return { status: 0, error: "could not reach the server" };
  }

  const json = (await res.json().catch(() => ({}))) as { data?: T; error?: string };
  return { data: json.data, error: json.error, status: res.status };
}

export function authStartUrl(provider: "github" | "google") {
  return apiUrl(`/api/auth/${provider}`);
}
