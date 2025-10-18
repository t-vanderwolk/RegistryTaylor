import { notFound } from "next/navigation";
import {
  getModuleDetail,
  getModules,
} from "../../../../../lib/api";
import { ModuleExperience } from "../../../../../components/academy/ModuleExperience";

export default async function ModulePage({
  params,
}: {
  params: { code: string };
}) {
  const detail = await getModuleDetail(params.code).catch(() => null);
  if (!detail) {
    notFound();
  }

  const { module, content, progress } = detail;
  const trackModules = await getModules(module.track_slug);

  const slides = content.lecture.slides ??
    (content.lecture.bullets ? content.lecture.bullets.map((text) => ({ text })) : []);

  return (
    <ModuleExperience
      journeyTitle={module.journey_title}
      trackTitle={module.track_title}
      trackSlug={module.track_slug}
      moduleData={module}
      content={content}
      slides={slides}
      trackModules={trackModules}
      checklistInitialState={progress?.checklist_state ?? {}}
    />
  );
}
