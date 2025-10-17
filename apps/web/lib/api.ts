import {
  Journey,
  Track,
  Module,
  ModuleDetailResponse,
  RegistryItem,
  CommunityPost,
  AffiliateProduct,
  InviteRecord,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:4000";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: string;
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const target = `${API_BASE_URL}${path}`;
  const headers = new Headers(init?.headers ?? {});

  if (
    !headers.has("Content-Type") &&
    init?.method &&
    init.method.toUpperCase() !== "GET"
  ) {
    headers.set("Content-Type", "application/json");
  }

  const requestInit: RequestInit = {
    ...init,
    headers,
    cache: "no-store",
  };

  if (typeof window === "undefined") {
    const serverCookieHeader = getServerCookieHeader();
    if (serverCookieHeader) {
      headers.set("Cookie", serverCookieHeader);
    }
  } else {
    requestInit.credentials = "include";
  }

  const response = await fetch(target, requestInit);

  if (!response.ok) {
    throw new Error(`API request failed for ${path}: ${response.status}`);
  }

  const json = (await response.json()) as ApiResponse<T>;
  if (!json.success) {
    throw new Error(json.error ?? `API returned an error for ${path}`);
  }

  return json.data;
}

export async function getJourneys(): Promise<Journey[]> {
  return apiFetch<Journey[]>("/api/journeys");
}

export async function getTracks(journeySlug: string): Promise<Track[]> {
  return apiFetch<Track[]>(`/api/tracks?journey=${journeySlug}`);
}

export async function getModules(trackSlug: string): Promise<Module[]> {
  return apiFetch<Module[]>(`/api/modules?track=${trackSlug}`);
}

export async function getModuleDetail(code: string): Promise<ModuleDetailResponse> {
  return apiFetch<ModuleDetailResponse>(`/api/modules/${code}`);
}

export async function getRegistry(userId?: string): Promise<RegistryItem[]> {
  const search = userId ? `?user=${encodeURIComponent(userId)}` : "";
  return apiFetch<RegistryItem[]>(`/api/registry/list${search}`);
}

export async function getCommunityPosts(): Promise<CommunityPost[]> {
  return apiFetch<CommunityPost[]>("/api/community/posts");
}

export const API_BASE = API_BASE_URL;

export async function getAffiliateProducts(
  category?: string
): Promise<AffiliateProduct[]> {
  const search = category ? `?category=${encodeURIComponent(category)}` : "";
  return apiFetch(`/api/affiliate/products${search}`);
}

export async function getInviteCodes(): Promise<InviteRecord[]> {
  return apiFetch("/api/invite/list");
}

function getServerCookieHeader(): string | null {
  if (typeof window !== "undefined") {
    return null;
  }

  try {
    // Dynamically require to avoid bundling in client builds.
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const { cookies } = require("next/headers") as typeof import("next/headers");
    const cookieStore = cookies();
    const serialized = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");
    return serialized.length > 0 ? serialized : null;
  } catch (error) {
    console.warn("Unable to read server cookies:", error);
    return null;
  }
}
