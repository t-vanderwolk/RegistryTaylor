import modules from "@/data/academyModules.json";
import type { AcademyModule, ModuleProgress } from "@/types/academy";
import { getMemberToken } from "@/lib/auth";

const typedModules: AcademyModule[] = modules as AcademyModule[];
const apiBase = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";

export async function getAcademyModules(): Promise<AcademyModule[]> {
  return typedModules;
}

export async function getAcademyModule(slug: string): Promise<AcademyModule | undefined> {
  return typedModules.find((module) => module.slug === slug);
}

export async function getModuleProgress(slug: string): Promise<ModuleProgress> {
  const token = await getMemberToken();
  if (!token) {
    return {
      completed: false,
      percentComplete: 0,
    };
  }

  try {
    const res = await fetch(`${apiBase}/api/academy/modules/${slug}/progress`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to load progress for ${slug}`);
    }

    const data = (await res.json()) as ModuleProgress;
    return data;
  } catch {
    return {
      completed: false,
      percentComplete: 0,
    };
  }
}

export async function markModuleComplete(slug: string): Promise<void> {
  const token = await getMemberToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${apiBase}/api/academy/modules/${slug}/progress`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed: true }),
  });

  if (!res.ok) {
    throw new Error("Unable to update module progress");
  }
}

export async function addModuleToRegistry(slug: string): Promise<void> {
  const token = await getMemberToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${apiBase}/api/registry/add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ source: "academy", module: slug }),
  });

  if (!res.ok) {
    throw new Error("Unable to add item to registry");
  }
}
