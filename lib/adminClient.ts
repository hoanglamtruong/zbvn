"use client";

const KEY = "zbvn_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY);
}

export function setToken(token: string) {
  localStorage.setItem(KEY, token);
}

export function clearToken() {
  localStorage.removeItem(KEY);
}

/** Authenticated fetch for admin APIs. Throws "unauthorized" on 401 so callers can redirect. */
export async function adminFetch(url: string, opts: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(url, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  if (res.status === 401) throw new Error("unauthorized");
  return res;
}
