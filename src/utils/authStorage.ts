import { AuthUser } from '../Types';

const STORAGE_KEY = "rewear_auth";

export function getStoredAuth(): AuthUser | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredAuth(user: AuthUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getStoredToken(): string | null {
  return getStoredAuth()?.token ?? null;
}