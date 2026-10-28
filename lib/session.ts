const SESSION_KEY = "kludge_session";

export function getSessionToken() {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("session");
  if (fromUrl) {
    localStorage.setItem(SESSION_KEY, fromUrl);
    params.delete("session");
    const query = params.toString();
    const next = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", next);
    return fromUrl;
  }
  return localStorage.getItem(SESSION_KEY) ?? "";
}

export function clearSessionToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
