import type { AuthUser } from "@/types";

const STORAGE_KEY = "task-app-auth";

export type StoredAuthState = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

const isBrowser = () => typeof window !== "undefined";

export const tokenStorage = {
  load(): StoredAuthState | null {
    if (!isBrowser()) return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as StoredAuthState;
    } catch {
      return null;
    }
  },
  save(payload: StoredAuthState) {
    if (!isBrowser()) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  },
  clear() {
    if (!isBrowser()) return;
    window.localStorage.removeItem(STORAGE_KEY);
  },
};

