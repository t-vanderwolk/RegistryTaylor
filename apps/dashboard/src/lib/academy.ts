import { addModuleFocusToRegistry } from "@/lib/registry";
import { apiFetch } from "@/lib/apiClient";
import { getMemberToken, getSession } from "@/lib/auth";
import type {
  AcademyModule,
  ModuleContentBlock,
  ModuleProgress,
  MentorNote,
} from "@/types/academy";

type BackendModule = {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  subtitle?: string | null;
  category?: string | null;
  journey?: string | null;
  accentColor?: string | null;
  heroImage?: string | null;
  estimatedMinutes?: number | null;
  registryFocus?: string | null;
  progress?: number | null;
  content: unknown;
};

type BackendModulesResponse = {
  modules: BackendModule[];
};

type ModuleMeta = {
  subtitle?: string | null;
  tagline?: string | null;
  category?: string | null;
  journey?: string | null;
  registryFocus?: string | null;
  estimatedMinutes?: number | null;
  accentColor?: string | null;
  heroImage?: string | null;
  background?: string | null;
  border?: string | null;
  text?: string | null;
  insight?: string | null;
  mentorNote?: MentorNote | string | null;
  apply?: string[];
  workbook?: unknown;
};

type ParsedContent = {
  meta: ModuleMeta;
  blocks: AcademyModule["content"];
};

const BRAND_BACKGROUND = "#FAF9F7";
const BRAND_TEXT = "#3E2F35";
const BRAND_BORDER = "#E8E3E1";
const BRAND_ACCENT = "#D6C1C7";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseImage(value: unknown): ModuleContentBlock["image"] | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const src = typeof value.src === "string" ? value.src : typeof value.url === "string" ? value.url : undefined;
  if (!src) {
    return undefined;
  }

  return {
    src,
    alt: typeof value.alt === "string" ? value.alt : typeof value.caption === "string" ? value.caption : undefined,
    caption: typeof value.caption === "string" ? value.caption : undefined,
  };
}

function parseContentBlock(value: unknown): ModuleContentBlock | null {
  if (typeof value === "string") {
    return { body: value };
  }

  if (!isRecord(value)) {
    return null;
  }

  const body =
    typeof value.body === "string"
      ? value.body
      : typeof value.text === "string"
        ? value.text
        : typeof value.content === "string"
          ? value.content
          : null;

  if (!body) {
    return null;
  }

  return {
    heading: typeof value.heading === "string" ? value.heading : typeof value.title === "string" ? value.title : undefined,
    subheading: typeof value.subheading === "string" ? value.subheading : undefined,
    body,
    image: parseImage(value.image ?? value.media),
    type: typeof value.type === "string" ? (value.type as ModuleContentBlock["type"]) : undefined,
    items: Array.isArray(value.items)
      ? value.items
          .map((item) => (typeof item === "string" ? item.trim() : null))
          .filter((item): item is string => Boolean(item))
      : undefined,
    prompt: typeof value.prompt === "string" ? value.prompt : undefined,
    ctaLabel: typeof value.ctaLabel === "string" ? value.ctaLabel : undefined,
    productId: typeof value.productId === "string" ? value.productId : undefined,
    externalId: typeof value.externalId === "string" ? value.externalId : undefined,
    percent:
      typeof value.percent === "number"
        ? value.percent
        : Number.isFinite(Number(value.percent))
          ? Number(value.percent)
          : null,
    metadata: isRecord(value.metadata) ? (value.metadata as Record<string, unknown>) : undefined,
  };
}

function parseContentBlocks(value: unknown): ModuleContentBlock[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(parseContentBlock)
    .filter((block): block is ModuleContentBlock => Boolean(block));
}

function parseApplyList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }
      if (isRecord(item)) {
        if (typeof item.body === "string") return item.body.trim();
        if (typeof item.text === "string") return item.text.trim();
      }
      return null;
    })
    .filter((task): task is string => Boolean(task && task.length > 0));
}

function parseMentorNote(value: unknown): MentorNote | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return { text: value };
  }

  if (!isRecord(value)) {
    return null;
  }

  const text =
    typeof value.text === "string"
      ? value.text
      : typeof value.body === "string"
        ? value.body
        : typeof value.content === "string"
          ? value.content
          : null;

  if (!text) {
    return null;
  }

  return {
    text,
    author: typeof value.author === "string" ? value.author : undefined,
    role: typeof value.role === "string" ? value.role : undefined,
  };
}

function toWorkbookId(title: string | undefined, index: number): string {
  if (title && title.trim().length > 0) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  return `section-${index}`;
}

function parseWorkbookSection(value: unknown, index: number): WorkbookSection | null {
  if (!isRecord(value)) {
    return null;
  }

  const typeValue = typeof value.type === "string" ? value.type.toLowerCase() : "text";
  const title = typeof value.title === "string" ? value.title : undefined;
  const description = typeof value.description === "string" ? value.description : null;
  const id = typeof value.id === "string" ? value.id : toWorkbookId(title, index);

  switch (typeValue) {
    case "checklist": {
      const items = Array.isArray(value.items)
        ? value.items
            .map((item) => (typeof item === "string" ? item.trim() : null))
            .filter((item): item is string => Boolean(item))
        : [];
      if (items.length === 0) {
        return null;
      }
      return {
        id,
        type: "checklist",
        title: title ?? "Checklist",
        description,
        items,
      };
    }
    case "tip": {
      const content =
        typeof value.content === "string"
          ? value.content
          : typeof value.body === "string"
            ? value.body
            : null;
      if (!content) {
        return null;
      }
      return {
        id,
        type: "tip",
        title: title ?? "Taylor-Made Insight",
        description,
        content,
      };
    }
    case "reflection":
    case "reflect": {
      return {
        id,
        type: "reflection",
        title: title ?? "Reflection",
        description,
        prompt:
          typeof value.prompt === "string"
            ? value.prompt
            : typeof value.body === "string"
              ? value.body
              : null,
        placeholder: typeof value.placeholder === "string" ? value.placeholder : null,
      };
    }
    case "registry": {
      return {
        id,
        type: "registry",
        title: title ?? "Registry highlight",
        description,
        productId: typeof value.productId === "string" ? value.productId : undefined,
        externalId: typeof value.externalId === "string" ? value.externalId : undefined,
        fallback: isRecord(value.fallback)
          ? {
              title: typeof value.fallback.title === "string" ? value.fallback.title : undefined,
              description:
                typeof value.fallback.description === "string" ? value.fallback.description : null,
              image: typeof value.fallback.image === "string" ? value.fallback.image : undefined,
              url: typeof value.fallback.url === "string" ? value.fallback.url : undefined,
            }
          : undefined,
      };
    }
    case "milestone": {
      return {
        id,
        type: "milestone",
        title: title ?? "Milestone unlocked",
        description,
        headline: typeof value.headline === "string" ? value.headline : null,
        percent:
          typeof value.percent === "number"
            ? value.percent
            : Number.isFinite(Number(value.percent))
              ? Number(value.percent)
              : null,
        message:
          typeof value.message === "string"
            ? value.message
            : typeof value.body === "string"
              ? value.body
              : null,
      };
    }
    case "submit": {
      return {
        id,
        type: "submit",
        title: title ?? "Save workbook",
        description,
        ctaLabel: typeof value.ctaLabel === "string" ? value.ctaLabel : null,
        ctaDescription:
          typeof value.ctaDescription === "string" ? value.ctaDescription : null,
      };
    }
    case "text":
    default: {
      return {
        id,
        type: "text",
        title: title ?? "Workbook note",
        description,
        prompt:
          typeof value.prompt === "string"
            ? value.prompt
            : typeof value.body === "string"
              ? value.body
              : null,
        placeholder: typeof value.placeholder === "string" ? value.placeholder : null,
      };
    }
  }
}

function parseWorkbookSections(value: unknown): WorkbookSection[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((rawSection, index) => parseWorkbookSection(rawSection, index))
    .filter((section): section is WorkbookSection => section !== null);
}

function parseModuleContent(raw: unknown): ParsedContent {
  if (!isRecord(raw)) {
    return {
      meta: {},
      blocks: {},
    };
  }

  const meta = isRecord(raw.meta) ? (raw.meta as ModuleMeta) : {};
  const sections = parseContentBlocks(raw.sections);
  const learnBlocks = parseContentBlocks(raw.learn);
  const workbookSections = parseWorkbookSections(raw.workbook ?? meta.workbook);

  const learn =
    learnBlocks.length > 0
      ? learnBlocks
      : sections.filter((block) => (block.type ?? "text").toLowerCase() !== "apply");

  const applyFromContent = parseApplyList(raw.apply);
  const applyFromMeta = parseApplyList(meta.apply);
  const apply =
    applyFromContent.length > 0
      ? applyFromContent
      : sections
          .filter((block) => (block.type ?? "").toLowerCase() === "apply" || (block.heading ?? "").toLowerCase().includes("apply"))
          .map((block) => block.body)
          .filter((body) => body.length > 0);

  return {
    meta,
    blocks: {
      learn,
      apply: apply.length > 0 ? apply : applyFromMeta,
      insight:
        typeof raw.insight === "string"
          ? raw.insight
          : typeof meta.insight === "string"
            ? meta.insight
            : null,
      mentorNote: parseMentorNote(raw.mentorNote ?? meta.mentorNote ?? null),
      explore: typeof raw.explore === "string" ? raw.explore : undefined,
      lecture: typeof raw.lecture === "string" ? raw.lecture : undefined,
      journalPrompt: typeof raw.journalPrompt === "string" ? raw.journalPrompt : undefined,
      sections,
      resources: parseApplyList(raw.resources),
      workbook: workbookSections.length > 0 ? workbookSections : undefined,
    },
  };
}

function normalizeProgress(value: number | null | undefined): ModuleProgress {
  const percent = Number.isFinite(value) ? Number(value) : 0;
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  return {
    percentComplete: clamped,
    completed: clamped >= 100,
  };
}

function normalizeModule(raw: BackendModule): AcademyModule {
  const parsed = parseModuleContent(raw.content);
  const meta = parsed.meta ?? {};
  const accentColor = meta.accentColor ?? raw.accentColor ?? BRAND_ACCENT;

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    subtitle: meta.subtitle ?? raw.subtitle ?? raw.summary ?? null,
    summary: raw.summary ?? null,
    tagline: meta.tagline ?? raw.summary ?? null,
    journey: (meta.journey ?? raw.journey ?? meta.category ?? null) as AcademyModule["journey"],
    category: meta.category ?? raw.category ?? meta.journey ?? null,
    registryFocus: meta.registryFocus ?? raw.registryFocus ?? null,
    estimatedMinutes:
      typeof meta.estimatedMinutes === "number"
        ? meta.estimatedMinutes
        : typeof raw.estimatedMinutes === "number"
          ? raw.estimatedMinutes
          : null,
    accentColor,
    heroImage: meta.heroImage ?? raw.heroImage ?? null,
    accentPalette: {
      background: meta.background ?? BRAND_BACKGROUND,
      border: meta.border ?? BRAND_BORDER,
      text: meta.text ?? BRAND_TEXT,
    },
    content: parsed.blocks,
    progress: normalizeProgress(raw.progress),
  };
}

async function fetchModulesFromApi(token: string | null): Promise<BackendModule[]> {
  try {
    const data = await apiFetch<BackendModulesResponse>("/api/academy/modules", {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });
    return Array.isArray(data.modules) ? data.modules : [];
  } catch (error) {
    if (error instanceof Error && /unauthorized/i.test(error.message)) {
      return [];
    }
    throw error;
  }
}

export async function getAcademyModules(): Promise<AcademyModule[]> {
  const token = await getMemberToken();
  const modules = await fetchModulesFromApi(token);
  return modules.map(normalizeModule);
}

export async function getAcademyModule(slug: string): Promise<AcademyModule | undefined> {
  const modules = await getAcademyModules();
  return modules.find((module) => module.slug === slug);
}

export async function getModuleProgress(slug: string): Promise<ModuleProgress> {
  const moduleEntry = await getAcademyModule(slug);
  return moduleEntry?.progress ?? { percentComplete: 0, completed: false };
}

export async function markModuleComplete(slug: string, percent: number = 100): Promise<void> {
  const token = await getMemberToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  await apiFetch("/api/academy/progress", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ moduleSlug: slug, percent }),
  });
}

export async function addModuleToRegistry(slug: string): Promise<void> {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const moduleEntry = await getAcademyModule(slug);
  if (!moduleEntry?.registryFocus) {
    return;
  }

  await addModuleFocusToRegistry(session.user.id, moduleEntry.registryFocus);
}
