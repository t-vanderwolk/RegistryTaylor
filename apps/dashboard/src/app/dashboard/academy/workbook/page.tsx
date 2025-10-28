import { requireMember } from "@/lib/auth";
import { getAcademyModules } from "@/lib/academy";
import WorkbookSection from "./WorkbookSection";
import { fetchWorkbookEntries } from "./workbookApi";

export const metadata = {
  title: "Academy Workbook · Taylor-Made Baby Co.",
  description: "Capture reflections, inspiration, and share updates with your mentor inside the Taylor workbook.",
};

type WorkbookPageProps = {
  searchParams?: {
    module?: string;
  };
};

export default async function WorkbookPage({ searchParams }: WorkbookPageProps) {
  const member = await requireMember();
  const [modules, entries] = await Promise.all([
    getAcademyModules(),
    fetchWorkbookEntries(member.id),
  ]);

  const initialModuleSlug =
    searchParams?.module && modules.some((module) => module.slug === searchParams.module)
      ? searchParams.module
      : undefined;

  return (
    <WorkbookSection
      memberId={member.id}
      modules={modules}
      initialEntries={entries}
      initialModuleSlug={initialModuleSlug}
    />
  );
}
