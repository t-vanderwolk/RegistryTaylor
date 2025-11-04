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
  type?: "text" | "quote" | "image";
};

export type MentorNote = {
  text: string;
  author?: string;
  role?: string;
};

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
