import { NextResponse } from "next/server";
import { getAcademyModules } from "@/lib/academy";
import { getMemberToken } from "@/lib/auth";

export async function GET() {
  const token = await getMemberToken();
  if (!token) {
    return NextResponse.json({ modules: [] }, { status: 401 });
  }

  const modules = await getAcademyModules();
  return NextResponse.json({
    modules: modules.map((module) => ({
      id: module.id,
      slug: module.slug,
      title: module.title,
      subtitle: module.subtitle,
      summary: module.summary,
      tagline: module.tagline,
      category: module.category,
      journey: module.journey,
      order: module.order,
      lecture: module.lecture,
      workbookPrompt: module.workbookPrompt,
      registryFocus: module.registryFocus,
      estimatedMinutes: module.estimatedMinutes,
      accentColor: module.accentColor,
      heroImage: module.heroImage,
      accentPalette: module.accentPalette,
      progress: module.progress,
      content: module.content,
    })),
  });
}
