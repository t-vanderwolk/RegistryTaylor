import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type UserRole = "MEMBER" | "MENTOR" | "ADMIN";

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
};

type SessionCookie = {
  token: string;
  user: AuthenticatedUser;
};

const SESSION_COOKIE_KEY = "tmbc.session";

function parseSessionCookie(value: string | undefined): SessionCookie | null {
  if (!value) return null;
  try {
    const decoded = Buffer.from(value, "base64").toString("utf-8");
    return JSON.parse(decoded) as SessionCookie;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionCookie | null> {
  const cookieStore = await cookies();
  return parseSessionCookie(cookieStore.get(SESSION_COOKIE_KEY)?.value);
}

export async function requireUser(): Promise<AuthenticatedUser> {
  const session = await getSession();
  if (!session?.user) {
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
      redirect("/dashboard");
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
