import type { AcademyModule, ModuleProgress } from "@/types/academy";
import { getMemberToken, getSession } from "@/lib/auth";
import { apiFetch } from "@/lib/apiClient";
import modules from "@/data/academyModules.json";
import { addModuleFocusToRegistry } from "@/lib/registry";

const typedModules: AcademyModule[] = modules as AcademyModule[];
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
    const data = await apiFetch<ModuleProgress>(`/api/academy/modules/${slug}/progress`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
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

  await apiFetch(`/api/academy/modules/${slug}/progress`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ completed: true }),
  });
}

export async function addModuleToRegistry(slug: string): Promise<void> {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const moduleEntry = typedModules.find((module) => module.slug === slug);
  if (!moduleEntry?.registryFocus) {
    return;
  }

  await addModuleFocusToRegistry(session.user.id, moduleEntry.registryFocus);
}
