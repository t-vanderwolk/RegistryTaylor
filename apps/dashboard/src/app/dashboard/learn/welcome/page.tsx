import type { Metadata } from "next";
import { requireMember } from "@/lib/auth";
import { getAcademyModules } from "@/lib/academy";
import type { AcademyModule, ModuleProgress } from "@/types/academy";
import { allModules } from "./data";
import type { StaticAcademyModule } from "./data/types";
import AcademyHeader from "./components/AcademyHeader";
import ModuleCarousel from "./components/ModuleCarousel";
import WorkbookSection from "./components/WorkbookSection";
import PDFDownloads from "./components/PDFDownloads";
import ModuleSidebar from "@/components/academy/ModuleSidebar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Taylor-Made Baby Academy · Welcome",
  description:
    "Access the Taylor-Made Baby Academy in one place. Browse Nursery, Gear, and Postpartum journeys, sync workbook reflections, and keep your concierge team aligned.",
};

const DEFAULT_PROGRESS: ModuleProgress = { percentComplete: 0, completed: false };

function fallbackFromStatic(module: StaticAcademyModule, index: number): AcademyModule {
  const journey = module.journey ?? null;
  const apply = Array.isArray(module.content?.apply) ? module.content.apply : [];
  const staticContent = module.content as { resources?: unknown; workbook?: AcademyModule["content"]["workbook"] };
  const resourcesArray = Array.isArray(staticContent?.resources)
    ? (staticContent.resources as string[])
    : [];
  const workbook = staticContent?.workbook;

  return {
    id: module.id,
    slug: module.slug,
    journey: journey as AcademyModule["journey"],
    category: journey,
    title: module.title,
    subtitle: module.subtitle ?? null,
    summary: module.subtitle ?? module.title,
    tagline: module.subtitle ?? null,
    registryFocus: module.registryFocus ?? null,
    estimatedMinutes: module.estimatedMinutes ?? null,
    accentColor: module.accentColor ?? "#C8A1B4",
    heroImage: module.heroImage ?? null,
    accentPalette: {
      background: "#FAF9F7",
      border: "#E8E3E1",
      text: "#3E2F35",
    },
    order: index,
    lecture: module.content?.lecture ?? null,
    workbookPrompt: module.content?.journalPrompt ?? null,
    content: {
      explore: module.content?.explore,
      lecture: module.content?.lecture,
      journalPrompt: module.content?.journalPrompt,
      apply,
      resources: resourcesArray,
      workbook: workbook,
    },
    progress: DEFAULT_PROGRESS,
  };
}

function mergeModules(staticModules: StaticAcademyModule[], dynamicModules: AcademyModule[]): AcademyModule[] {
  const dynamicMap = new Map(dynamicModules.map((module) => [module.slug, module]));

  const ordered = staticModules.map((staticModule, index) => {
    const dynamic = dynamicMap.get(staticModule.slug);
    if (!dynamic) {
      return fallbackFromStatic(staticModule, index);
    }
    return {
      ...dynamic,
      order: dynamic.order ?? index,
      progress: dynamic.progress ?? DEFAULT_PROGRESS,
    };
  });

  const seen = new Set(ordered.map((module) => module.slug));
  const extras = dynamicModules
    .filter((module) => !seen.has(module.slug))
    .map((module, extraIndex) => ({
      ...module,
      order: module.order ?? ordered.length + extraIndex,
      progress: module.progress ?? DEFAULT_PROGRESS,
    }));

  return [...ordered, ...extras];
}

export default async function WelcomePage() {
  await requireMember();

  const dynamicModules = await getAcademyModules();
  const modules = mergeModules(allModules, dynamicModules);

  return (
    <div className="flex flex-col gap-6 text-charcoal-700 md:mx-auto md:max-w-6xl md:flex-row md:items-start md:gap-10 md:py-8">
      <ModuleSidebar modules={modules} title="Your journeys" />
      <div className="flex-1 space-y-6 md:space-y-10">
        <AcademyHeader modules={modules} />
        <ModuleCarousel modules={modules} />
        <WorkbookSection modules={modules} />
        <PDFDownloads modules={modules} />
      </div>
    </div>
  );
}
