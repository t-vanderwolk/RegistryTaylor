import { redirect } from "next/navigation";
import api, { API_URL } from "@/lib/apiClient";
import { isAxiosError } from "axios";
import {
  LEGACY_STORED_USER_KEY,
  SESSION_CACHE_MAX_AGE_MS,
  STORED_SESSION_CACHE_KEY,
  STORED_SESSION_USER_KEY,
  STORED_TOKEN_KEY,
  STORED_USER_KEY,
  STORED_USER_UPDATED_EVENT,
} from "@/lib/sessionKeys";

export type UserRole = "MEMBER" | "MENTOR" | "ADMIN";

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: UserRole;
  name?: string | null;
  avatarUrl?: string | null;
};

type SessionContext = {
  token: string;
  user: AuthenticatedUser;
};

type SessionCacheEntry = {
  user: AuthenticatedUser;
  cachedAt: number;
};

type PersistStoredUserOptions = {
  refreshCache?: boolean;
  persistSession?: boolean;
};

const API_BASE_URL = API_URL;

const SESSION_ENDPOINT = `${API_BASE_URL}/api/auth/session`;

function broadcastStoredUserUpdate(user: AuthenticatedUser | null) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.dispatchEvent(
      new CustomEvent<AuthenticatedUser | null>(STORED_USER_UPDATED_EVENT, {
        detail: user,
      })
    );
  } catch {
    // Ignore dispatch issues (CustomEvent not supported, etc.)
  }
}

function persistSessionCache(user: AuthenticatedUser) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const payload: SessionCacheEntry = {
      user,
      cachedAt: Date.now(),
    };
    window.localStorage.setItem(STORED_SESSION_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage failures (private mode, etc.)
  }
}

function clearSessionCache() {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(STORED_SESSION_CACHE_KEY);
  } catch {
    // ignore
  }
}

export function setSessionUserCache(user: AuthenticatedUser | null) {
  if (typeof window === "undefined" || typeof window.sessionStorage === "undefined") {
    return;
  }
  try {
    if (!user) {
      window.sessionStorage.removeItem(STORED_SESSION_USER_KEY);
      return;
    }
    window.sessionStorage.setItem(STORED_SESSION_USER_KEY, JSON.stringify(user));
  } catch {
    window.sessionStorage.removeItem(STORED_SESSION_USER_KEY);
  }
}

export function getSessionUserCache(): AuthenticatedUser | null {
  if (typeof window === "undefined" || typeof window.sessionStorage === "undefined") {
    return null;
  }
  try {
    const sessionValue = window.sessionStorage.getItem(STORED_SESSION_USER_KEY);
    return sessionValue ? (JSON.parse(sessionValue) as AuthenticatedUser) : null;
  } catch {
    window.sessionStorage.removeItem(STORED_SESSION_USER_KEY);
    return null;
  }
}

export function persistStoredUser(
  user: AuthenticatedUser,
  options: PersistStoredUserOptions = {},
) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(STORED_USER_KEY, JSON.stringify(user));
    window.localStorage.removeItem(LEGACY_STORED_USER_KEY);
    if (options.refreshCache ?? true) {
      persistSessionCache(user);
    }
    if (options.persistSession ?? true) {
      setSessionUserCache(user);
    }
    broadcastStoredUserUpdate(user);
  } catch {
    // Ignore storage failures (private mode, etc.)
  }
}

export function getCachedSession(): AuthenticatedUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORED_SESSION_CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as SessionCacheEntry;
    if (!parsed?.user || typeof parsed.cachedAt !== "number") {
      window.localStorage.removeItem(STORED_SESSION_CACHE_KEY);
      return null;
    }

    const isExpired = Date.now() - parsed.cachedAt > SESSION_CACHE_MAX_AGE_MS;
    if (isExpired) {
      window.localStorage.removeItem(STORED_SESSION_CACHE_KEY);
      return null;
    }

    return parsed.user;
  } catch {
    window.localStorage.removeItem(STORED_SESSION_CACHE_KEY);
    return null;
  }
}

export function getStoredUser(): AuthenticatedUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(STORED_USER_KEY);
    return stored ? (JSON.parse(stored) as AuthenticatedUser) : null;
  } catch {
    window.localStorage.removeItem(STORED_USER_KEY);
    broadcastStoredUserUpdate(null);
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage.getItem(STORED_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function clearStoredToken() {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(STORED_TOKEN_KEY);
  } catch {
    // ignore
  }
}

export function clearStoredUser() {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(STORED_USER_KEY);
    clearSessionCache();
    setSessionUserCache(null);
    broadcastStoredUserUpdate(null);
  } catch {
    // ignore
  }
}

export function getDashboardPath(role?: UserRole | null): string {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "MENTOR":
      return "/dashboard/mentor";
    case "MEMBER":
      return "/dashboard/member";
    default:
      return "/dashboard";
  }
}

async function getCookieStore() {
  const { cookies } = await import("next/headers");
  return cookies();
}

async function fetchUserByToken(token: string | null): Promise<AuthenticatedUser | null> {
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(SESSION_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      cache: "no-store",
    });

    const payload = await response.json().catch(() => null);

    if (response.status === 401 || response.status === 404) {
      if (typeof window === "undefined") {
        redirect("/login");
      }
      return null;
    }

    if (!response.ok) {
      const message =
        (payload && typeof payload === "object" && "message" in payload
          ? (payload as Record<string, unknown>).message
          : null) ?? `Failed to verify authentication (${response.status})`;
      throw new Error(String(message));
    }

    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid session response.");
    }

    const data = payload as { id: string; email: string; role: UserRole };

    return {
      id: data.id,
      email: data.email,
      role: data.role,
      name: null,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error instanceof Error
      ? error
      : new Error("Failed to verify authentication (unexpected error).");
  }
}

export async function verifyUserFromToken(token: string): Promise<AuthenticatedUser | null> {
  try {
    return await fetchUserByToken(token);
  } catch (error) {
    console.error("verifyUserFromToken failed", error);
    return null;
  }
}

async function resolveToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    return getStoredToken();
  }
  const cookieStore = await getCookieStore();
  return cookieStore.get("token")?.value ?? null;
}

export async function fetchAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const token = await resolveToken();
  if (!token) {
    return null;
  }
  return fetchUserByToken(token);
}

export async function getSession(): Promise<SessionContext | null> {
  try {
    const cookieStore = await getCookieStore();
    const tokenCookie = cookieStore.get("token");

    if (!tokenCookie?.value) {
      return null;
    }

    const user = await fetchUserByToken(tokenCookie.value);
    if (!user) {
      return null;
    }

    return {
      token: tokenCookie.value,
      user,
    };
  } catch (error) {
    console.error("getSession failed", error);
    return null;
  }
}

export async function requireUser(): Promise<AuthenticatedUser> {
  try {
    const user = await fetchAuthenticatedUser();
    if (!user) {
      redirect("/login");
    }

    return user;
  } catch (error) {
    console.error("requireUser failed", error);
    redirect("/login");
  }
}

export async function getMemberToken(): Promise<string | null> {
  const session = await getSession();
  if (!session || session.user.role !== "MEMBER") {
    return null;
  }

  return session.token;
}

function redirectForRole(role: UserRole): never {
  switch (role) {
    case "MENTOR":
      return redirect("/dashboard/mentor");
    case "ADMIN":
      return redirect("/dashboard/admin");
    case "MEMBER":
      return redirect("/dashboard/member");
    default:
      return redirect("/dashboard");
  }
}

export async function requireMember(): Promise<AuthenticatedUser> {
  const user = await requireUser();
  if (user.role !== "MEMBER") {
    redirectForRole(user.role);
  }
  return user;
}

export async function requireMentor(): Promise<AuthenticatedUser> {
  const user = await requireUser();
  if (user.role !== "MENTOR") {
    redirectForRole(user.role);
  }
  return user;
}

export async function requireAdmin(): Promise<AuthenticatedUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    redirectForRole(user.role);
  }
  return user;
}

type FlattenedLoginPayload = {
  id: string;
  email: string;
  role: UserRole;
  redirectTo?: string | null;
  token?: string | null;
};

type NestedLoginPayload = {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
  redirectTo?: string | null;
  token?: string | null;
};

type LoginPayload = FlattenedLoginPayload | NestedLoginPayload;

export type LoginResult = {
  user: AuthenticatedUser;
  token: string | null;
  redirectTo?: string | null;
};

const AUTH_LOGIN_PATH = "/api/auth/login";

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  try {
    const { data } = await api.post<LoginPayload>(AUTH_LOGIN_PATH, { email, password });

    let payload: FlattenedLoginPayload;
    let redirectTo: string | null | undefined;
    let token: string | null | undefined;

    if ("user" in data) {
      payload = data.user;
      redirectTo = data.redirectTo;
      token = data.token;
    } else {
      payload = data;
      redirectTo = data.redirectTo;
      token = data.token;
    }

    const user: AuthenticatedUser = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      name: null,
    };

    persistStoredUser(user);
    const fallbackRedirect = `/dashboard/${user.role.toLowerCase()}`;

    return {
      user,
      token: token ?? null,
      redirectTo: redirectTo ?? fallbackRedirect,
    };
  } catch (error) {
    console.error("❗ auth.ts:203 loginUser failed", error);
    if (isAxiosError(error) && (error.response?.status ?? 0) >= 400) {
      throw new Error("Unable to login. Please try again.");
    }

    throw new Error("Unable to login. Please try again.");
  }
}

export const login = async (credentials: { email: string; password: string }) => {
  const response = await api.post(AUTH_LOGIN_PATH, credentials);
  return response.data;
};
