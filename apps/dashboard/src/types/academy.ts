export type AcademyJourney =
  | "Nursery"
  | "Gear"
  | "Postpartum"
  | "Community"
  | "Concierge";

export type ModuleContentImage = {
  src: string;
  alt?: string;
  caption?: string;
};

export type ModuleContentBlock = {
  heading?: string;
  subheading?: string;
  body: string;
  image?: ModuleContentImage;
  type?:
    | "section"
    | "text"
    | "quote"
    | "image"
    | "insight"
    | "tip"
    | "reflect"
    | "mentor"
    | "registry"
    | "milestone";
  items?: string[];
  prompt?: string;
  ctaLabel?: string;
  productId?: string;
  externalId?: string;
  percent?: number | null;
  metadata?: Record<string, unknown>;
  fallback?: {
    title?: string;
    description?: string | null;
    image?: string | null;
    url?: string | null;
  };
};

export type MentorNote = {
  text: string;
  author?: string;
  role?: string;
};

export type WorkbookItemType =
  | "checklist"
  | "text"
  | "tip"
  | "reflection"
  | "submit"
  | "registry"
  | "milestone";

export interface WorkbookSection {
  id?: string;
  title: string;
  type: WorkbookItemType;
  items?: string[];
  prompt?: string;
  content?: string;
  description?: string | null;
  placeholder?: string | null;
  productId?: string | null;
  externalId?: string | null;
  percent?: number | null;
  headline?: string | null;
  message?: string | null;
  ctaLabel?: string | null;
  ctaDescription?: string | null;
  fallback?: {
    title?: string;
    description?: string | null;
    image?: string | null;
    url?: string | null;
  };
  metadata?: Record<string, unknown>;
}

export type AcademyModuleContent = {
  learn?: ModuleContentBlock[];
  apply?: string[];
  insight?: string | null;
  mentorNote?: MentorNote | null;
  explore?: string;
  lecture?: string;
  journalPrompt?: string;
  sections?: ModuleContentBlock[];
  resources?: string[];
  workbook?: WorkbookSection[];
};

export type ModuleProgress = {
  percentComplete: number;
  completed: boolean;
  updatedAt?: string | null;
  completedAt?: string | null;
};

export type AcademyModule = {
  id: string;
  slug: string;
  journey?: AcademyJourney | null;
  category?: string | null;
  title: string;
  subtitle?: string | null;
  summary?: string | null;
  tagline?: string | null;
  registryFocus?: string | null;
  estimatedMinutes?: number | null;
  accentColor?: string | null;
  heroImage?: string | null;
  accentPalette?: {
    background?: string;
    border?: string;
    text?: string;
  } | null;
  content: AcademyModuleContent;
  progress?: ModuleProgress;
};

export type DashboardTab =
  | "academy"
  | "learn"
  | "plan"
  | "registry"
  | "community"
  | "connect"
  | "journal"
  | "concierge";
