import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBlogPostBySlug,
  getBlogPostSummaries,
} from "@/data/blogPosts";

type BlogArticlePageProps = {
  params: {
    slug: string;
  };
};

function formatPublishedDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateStaticParams() {
  return getBlogPostSummaries().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);
  if (!post) {
    return {
      title: "Taylor Journal",
      description: "Concierge inspiration and stories from Taylor-Made Baby Co.",
    };
  }

  return {
    title: `${post.title} · Taylor Journal`,
    description: post.excerpt,
  };
}

export default function BlogArticlePage({ params }: BlogArticlePageProps) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const published = formatPublishedDate(post.publishedAt);

  return (
    <article className="space-y-10">
      <header className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-mauve-500/80">
          Taylor Journal
        </p>
        <h1 className="font-serif text-4xl text-charcoal-700">{post.title}</h1>
        <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold uppercase tracking-[0.35em] text-charcoal-300">
          <span>{post.author}</span>
          <span>{published}</span>
          <span>{post.readTime}</span>
        </div>
        <p className="mx-auto max-w-3xl text-sm text-charcoal-500/80">{post.excerpt}</p>
      </header>

      {post.heroImage ? (
        <div className="relative overflow-hidden rounded-[3rem] border border-mauve-500/20 shadow-[0_30px_70px_rgba(200,161,180,0.2)]">
          <Image
            src={post.heroImage}
            alt={post.heroAlt}
            width={1600}
            height={900}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      ) : null}

      <div className="mx-auto flex max-w-4xl flex-col gap-8 text-base leading-relaxed text-charcoal-500/90">
        {post.body.map((block, blockIndex) => (
          <section key={blockIndex} className="space-y-4 text-left">
            {block.heading ? (
              <h2 className="font-serif text-2xl text-charcoal-700">{block.heading}</h2>
            ) : null}
            {block.paragraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>

      <div className="pt-4 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full border border-mauve-500 px-5 py-2 text-sm font-semibold text-mauve-500 transition hover:-translate-y-0.5 hover:bg-mauve-500 hover:text-white"
        >
          ← Back to journal
        </Link>
      </div>
    </article>
  );
}
