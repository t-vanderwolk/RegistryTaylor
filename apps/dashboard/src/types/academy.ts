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
    | "milestone";
  items?: string[];
  prompt?: string;
  ctaLabel?: string;
  percent?: number | null;
  metadata?: Record<string, unknown>;
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
  percent?: number | null;
  headline?: string | null;
  message?: string | null;
  ctaLabel?: string | null;
  ctaDescription?: string | null;
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
  quizScore?: number | null;
  reflection?: string | null;
};

export type AcademyModule = {
  id: string;
  slug: string;
  journey?: AcademyJourney | null;
  category?: string | null;
  title: string;
  subtitle?: string | null;
  summary: string;
  tagline?: string | null;
  estimatedMinutes?: number | null;
  accentColor?: string | null;
  heroImage?: string | null;
  accentPalette?: {
    background?: string;
    border?: string;
    text?: string;
  } | null;
  order?: number | null;
  lecture?: string | null;
  workbookPrompt?: string | null;
  content: AcademyModuleContent;
  progress?: ModuleProgress;
};

export type DashboardTab =
  | "academy"
  | "learn"
  | "community"
  | "connect"
  | "journal"
  | "concierge";
