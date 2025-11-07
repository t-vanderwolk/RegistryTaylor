import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import api from "@/lib/apiClient";
import { isAxiosError } from "axios";

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

async function fetchAuthenticatedUser(token: string): Promise<AuthenticatedUser | null> {
  if (!token) return null;

  try {
    const { data } = await api.get<{ id: string; email: string; role: UserRole }>(
      "/api/auth/me",
      {
        headers: {
          Cookie: `token=${token}`,
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
