import { redirect } from "next/navigation";
import api from "@/lib/apiClient";
import { isAxiosError } from "axios";
import {
  LEGACY_STORED_USER_KEY,
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

function persistStoredUser(user: AuthenticatedUser) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(STORED_USER_KEY, JSON.stringify(user));
    window.localStorage.removeItem(LEGACY_STORED_USER_KEY);
    broadcastStoredUserUpdate(user);
  } catch {
    // Ignore storage failures (private mode, etc.)
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

async function fetchAuthenticatedUser(token: string): Promise<AuthenticatedUser | null> {
  if (!token) return null;

  try {
    const { data } = await api.get<{ id: string; email: string; role: UserRole }>(
      "/api/auth/me",
      {
        headers: {
          Cookie: `token=${token}`,
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        withCredentials: true,
      }
    );

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
    throw new Error(
      `Failed to verify authentication (${isAxiosError(error) ? error.message : "unknown error"})`
    );
  }
}

export async function verifyUserFromToken(token: string): Promise<AuthenticatedUser | null> {
  return fetchAuthenticatedUser(token);
}

export async function getSession(): Promise<SessionContext | null> {
  const cookieStore = await getCookieStore();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie?.value) {
    return null;
  }

  const user = await fetchAuthenticatedUser(tokenCookie.value);
  if (!user) {
    return null;
  }

  return {
    token: tokenCookie.value,
    user,
  };
}

export async function requireUser(): Promise<AuthenticatedUser> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return session.user;
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
      redirect("/dashboard/mentor");
    case "ADMIN":
      redirect("/dashboard/admin");
    default:
      redirect("/dashboard/member");
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

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  try {
    const { data } = await api.post<LoginPayload>("/api/auth/login", { email, password });

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
