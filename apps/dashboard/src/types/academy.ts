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
};

export type MentorNote = {
  text: string;
  author?: string;
  role?: string;
};

export type WorkbookBaseSection = {
  id?: string;
  title: string;
  description?: string | null;
};

export type WorkbookChecklistSection = WorkbookBaseSection & {
  type: "checklist";
  items: string[];
};

export type WorkbookTextSection = WorkbookBaseSection & {
  type: "text";
  prompt?: string | null;
  placeholder?: string | null;
};

export type WorkbookTipSection = WorkbookBaseSection & {
  type: "tip";
  content: string;
};

export type WorkbookReflectionSection = WorkbookBaseSection & {
  type: "reflection";
  prompt?: string | null;
  placeholder?: string | null;
};

export type WorkbookRegistrySection = WorkbookBaseSection & {
  type: "registry";
  productId?: string | null;
  externalId?: string | null;
  fallback?: {
    title?: string;
    description?: string | null;
    image?: string | null;
    url?: string | null;
  };
};

export type WorkbookMilestoneSection = WorkbookBaseSection & {
  type: "milestone";
  headline?: string | null;
  percent?: number | null;
  message?: string | null;
};

export type WorkbookSubmitSection = WorkbookBaseSection & {
  type: "submit";
  ctaLabel?: string | null;
  ctaDescription?: string | null;
};

export type WorkbookSection =
  | WorkbookChecklistSection
  | WorkbookTextSection
  | WorkbookTipSection
  | WorkbookReflectionSection
  | WorkbookRegistrySection
  | WorkbookMilestoneSection
  | WorkbookSubmitSection;

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
