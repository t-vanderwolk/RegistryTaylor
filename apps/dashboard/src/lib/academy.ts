import axios from "axios";
import { addModuleFocusToRegistry } from "@/lib/registry";
import { API_URL, apiFetch } from "@/lib/apiClient";
import { getMemberToken, getSession } from "@/lib/auth";
import type {
  AcademyModule,
  ModuleContentBlock,
  ModuleProgress,
  MentorNote,
  WorkbookSection,
} from "@/types/academy";

type BackendModule = {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  category?: string | null;
  lecture?: string | null;
  workbookPrompt?: string | null;
  order?: number | null;
  subtitle?: string | null;
  journey?: string | null;
  accentColor?: string | null;
  heroImage?: string | null;
  estimatedMinutes?: number | null;
  registryFocus?: string | null;
  progress?: number | null;
  progressCompleted?: boolean | null;
  progressQuizScore?: number | null;
  progressReflection?: string | null;
  progressUpdatedAt?: Date | string | null;
  content?: unknown;
};

type ModuleRecord = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  lecture: string;
  workbookPrompt: string;
  order: number;
  content: unknown;
  progress?: Array<{
    percent: number | null;
    completed: boolean;
    quizScore: number | null;
    reflection: string | null;
    updatedAt?: Date | string | null;
  }>;
};

type GetModulesOptions = {
  userId?: string | null;
  includeProgress?: boolean;
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

async function fetchAcademyApi<T>(endpoint: string): Promise<T> {
  const session = await getSession();
  if (!session?.token) {
    throw new Error("Not authenticated");
  }

const response = await axios.get<T>(`${API_URL}/api/academy${endpoint}`, {    headers: {
      Authorization: `Bearer ${session.token}`,
    },
    withCredentials: true,
  });

  return response.data;
}

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
              : undefined,
        placeholder: typeof value.placeholder === "string" ? value.placeholder : undefined,
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
    : undefined,
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

function toIsoString(value: Date | string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const date = typeof value === "string" ? new Date(value) : value;
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
}

function normalizeProgress(
  value: number | null | undefined,
  updatedAt?: Date | string | null,
  extras?: {
    completed?: boolean | null;
    quizScore?: number | null;
    reflection?: string | null;
  }
): ModuleProgress {
  const percent = Number.isFinite(value) ? Number(value) : 0;
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const progress: ModuleProgress = {
    percentComplete: clamped,
    completed: extras?.completed ?? clamped >= 100,
  };
  if (extras?.quizScore !== undefined) {
    progress.quizScore = extras.quizScore ?? null;
  }
  if (extras?.reflection !== undefined) {
    progress.reflection = extras.reflection ?? null;
  }
  const isoUpdatedAt = toIsoString(updatedAt);
  if (isoUpdatedAt) {
    progress.updatedAt = isoUpdatedAt;
    if (progress.completed && !progress.completedAt) {
      progress.completedAt = isoUpdatedAt;
    }
  }
  return progress;
}

function normalizeModule(raw: BackendModule): AcademyModule {
  const parsed = parseModuleContent(raw.content);
  const meta = parsed.meta ?? {};
  const accentColor = meta.accentColor ?? raw.accentColor ?? BRAND_ACCENT;
  const summary =
    (typeof raw.summary === "string" && raw.summary.length > 0 ? raw.summary : null) ??
    (typeof meta.tagline === "string" && meta.tagline.length > 0 ? meta.tagline : null);
  const category =
    raw.category ??
    (typeof meta.category === "string" ? meta.category : null) ??
    (typeof meta.journey === "string" ? meta.journey : null) ??
    (typeof raw.journey === "string" ? raw.journey : null);

  const content: AcademyModule["content"] = { ...parsed.blocks };

  if (typeof raw.lecture === "string") {
    content.lecture = raw.lecture;
  }
  if (typeof raw.workbookPrompt === "string") {
    content.journalPrompt = raw.workbookPrompt;
  }
  if (!content.workbook && typeof raw.workbookPrompt === "string") {
    content.workbook = [
      {
        id: `${raw.slug}-reflection`,
        type: "reflection",
        title: "Reflection",
        prompt: raw.workbookPrompt,
      },
    ];
  }

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    subtitle: meta.subtitle ?? raw.subtitle ?? raw.summary ?? null,
    summary: summary ?? "",
    tagline: meta.tagline ?? raw.summary ?? null,
    journey: (meta.journey ?? raw.journey ?? meta.category ?? category ?? null) as AcademyModule["journey"],
    category: category,
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
    order: typeof raw.order === "number" ? raw.order : null,
    lecture: typeof raw.lecture === "string" ? raw.lecture : content.lecture ?? null,
    workbookPrompt:
      typeof raw.workbookPrompt === "string"
        ? raw.workbookPrompt
        : content.journalPrompt ?? null,
    content,
    progress: normalizeProgress(raw.progress, raw.progressUpdatedAt ?? null, {
      completed: raw.progressCompleted,
      quizScore: raw.progressQuizScore,
      reflection: raw.progressReflection,
    }),
  };
}

function mapRecordToBackend(record: ModuleRecord): BackendModule {
  const progressEntry = Array.isArray(record.progress) ? record.progress[0] : undefined;
  const percent =
    typeof progressEntry?.percent === "number"
      ? progressEntry.percent
      : Number.isFinite(Number(progressEntry?.percent))
        ? Number(progressEntry?.percent)
        : null;

  const completed =
    typeof progressEntry?.completed === "boolean"
      ? progressEntry.completed
      : (percent ?? 0) >= 100;
  const quizScore =
    typeof progressEntry?.quizScore === "number" ? progressEntry.quizScore : null;
  const reflection =
    typeof progressEntry?.reflection === "string" ? progressEntry.reflection : null;

  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    category: record.category,
    summary: record.summary,
    lecture: record.lecture,
    workbookPrompt: record.workbookPrompt,
    order: record.order,
    content: record.content ?? undefined,
    progress: percent,
    progressCompleted: completed,
    progressQuizScore: quizScore,
    progressReflection: reflection,
    progressUpdatedAt: progressEntry?.updatedAt ?? null,
  };
}

async function fetchModuleRecords(): Promise<BackendModule[]> {
  const data = await fetchAcademyApi<{ modules: ModuleRecord[] }>("/modules");
  return data.modules.map((record) => mapRecordToBackend(record));
}

async function fetchModuleRecordBySlug(slug: string): Promise<BackendModule | undefined> {
  try {
    const data = await fetchAcademyApi<{ module: ModuleRecord }>(`/modules/${slug}`);
    return mapRecordToBackend(data.module);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return undefined;
    }
    throw error;
  }
}

export async function getDetailedModules(options: GetModulesOptions = {}): Promise<AcademyModule[]> {
  const records = await fetchModuleRecords();
  const modules = records.map(normalizeModule);

  if (options.includeProgress === false) {
    return modules.map((module) => ({ ...module, progress: undefined }));
  }

  return modules;
}

export async function getDetailedModuleBySlug(
  slug: string,
  options: GetModulesOptions = {}
): Promise<AcademyModule | undefined> {
  const record = await fetchModuleRecordBySlug(slug);
  if (!record) {
    return undefined;
  }
  const normalized = normalizeModule(record);
  if (options.includeProgress === false) {
    return { ...normalized, progress: undefined };
  }
  return normalized;
}

export async function getModules() {
  const data = await fetchAcademyApi<{ modules: ModuleRecord[] }>("/modules");
  return data.modules;
}

export async function getModuleBySlug(slug: string) {
  try {
    const data = await fetchAcademyApi<{ module: ModuleRecord }>(`/modules/${slug}`);
    return data.module;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return undefined;
    }
    throw error;
  }
}

export async function getAcademyModules(): Promise<AcademyModule[]> {
  return getDetailedModules();
}

export async function getAcademyModule(slug: string): Promise<AcademyModule | undefined> {
  return getDetailedModuleBySlug(slug);
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
