import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

function resolveApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:5050"
  );
}

async function fetchAuthenticatedUser(token: string): Promise<AuthenticatedUser | null> {
  if (!token) return null;

  const response = await fetch(`${resolveApiBaseUrl()}/api/auth/me`, {
    headers: {
      Cookie: `token=${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to verify authentication (${response.status})`);
  }

  const data = (await response.json()) as { id: string; email: string; role: UserRole };

  return {
    id: data.id,
    email: data.email,
    role: data.role,
    name: null,
  };
}

export async function getSession(): Promise<SessionContext | null> {
  const cookieStore = await cookies();
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
