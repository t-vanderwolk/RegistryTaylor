import Link from "next/link";
import { notFound } from "next/navigation";
import { getModuleDetail, getCommunityPosts } from "../../../../lib/api";
import { TMCard } from "../../../../components/TMCard";
import { LectureCarousel } from "../../../../components/LectureCarousel";
import { ApplyChecklist } from "../../../../components/ApplyChecklist";
import { RegistryCard } from "../../../../components/RegistryCard";
import { JournalPrompt } from "../../../../components/JournalPrompt";
import { CommunityPost } from "../../../../components/CommunityPost";

export default async function ModulePage({
  params,
}: {
  params: { code: string };
}) {
  const detail = await getModuleDetail(params.code).catch(() => null);
  if (!detail) {
    notFound();
  }

  const communityPosts = await getCommunityPosts();

  const { module, content, progress, suggestions } = detail;

  return (
    <div className="grid gap-10">
      <div className="space-y-3">
        <Link
          href={`/dashboard/tracks/${module.track_slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-tmMauve transition hover:text-tmGold"
        >
          ← Back to {module.track_title}
        </Link>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-tmMauve/70">
          {module.journey_title}
        </p>
        <h1 className="font-heading text-4xl text-tmCharcoal">{module.title}</h1>
        {module.subtitle && (
          <p className="max-w-2xl text-sm text-tmCharcoal/70">{module.subtitle}</p>
        )}
      </div>

      <TMCard
        title="Explore"
        subtitle="Ground yourself in the why before you jump into tasks."
        className="bg-white/95 px-6 py-7"
      >
        <p className="text-base leading-relaxed text-tmCharcoal/85">{content.explore}</p>
      </TMCard>

      <LectureCarousel bullets={content.lecture.bullets} />

      <JournalPrompt moduleCode={module.code} prompt={content.journal_prompt} />

      <ApplyChecklist
        moduleId={module.id}
        items={content.apply.items}
        initialState={progress?.checklist_state ?? {}}
      />

      <section className="space-y-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-tmMauve/70">
            Registry Suggestions
          </p>
          <p className="text-sm text-tmCharcoal/70">
            Curated gear to support this module—add favorites directly to your Taylor-made registry.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {suggestions.slice(0, 4).map((product) => (
            <RegistryCard key={product.id} product={product} moduleId={module.id} />
          ))}
        </div>
      </section>

      <TMCard
        title="Community Thread"
        subtitle="Share wins, ask for feedback, and learn from other Taylor-made families."
        className="bg-white/95 px-6 py-7"
      >
        <div className="grid gap-6">
          {communityPosts.slice(0, 3).map((post) => (
            <CommunityPost key={post.id} post={post} />
          ))}
        </div>
        <Link
          href="/dashboard/community"
          className="inline-flex items-center gap-2 text-sm font-semibold text-tmMauve transition hover:text-tmGold"
        >
          Open full community →
        </Link>
      </TMCard>
    </div>
  );
}
