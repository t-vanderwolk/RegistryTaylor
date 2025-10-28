export type AcademyJourney =
  | "Nursery"
  | "Gear"
  | "Postpartum"
  | "Community"
  | "Concierge";

export type AcademyModuleSection = {
  explore: string;
  lecture: string;
  journalPrompt: string;
  apply: string[];
};

export type AcademyModule = {
  id: string;
  slug: string;
  journey: AcademyJourney;
  title: string;
  subtitle?: string;
  registryFocus?: string;
  estimatedMinutes?: number;
  accentColor?: string;
  heroImage?: string;
  content: AcademyModuleSection;
};

export type ModuleProgress = {
  completed: boolean;
  percentComplete: number;
  completedAt?: string;
  journalUpdatedAt?: string;
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
