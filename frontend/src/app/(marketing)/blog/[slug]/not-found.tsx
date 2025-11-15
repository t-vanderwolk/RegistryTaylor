import Link from "next/link";

export default function BlogArticleNotFound() {
  return (
    <div className="space-y-6 text-center">
      <h1 className="font-serif text-3xl text-charcoal-700">We couldn&apos;t find that story</h1>
      <p className="mx-auto max-w-xl text-sm text-charcoal-500/80">
        The article may have been moved or is no longer available. Explore the latest concierge notes
        inside the Taylor Journal.
      </p>
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 rounded-full bg-mauve-500 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_16px_36px_rgba(200,161,180,0.35)] transition hover:-translate-y-0.5 hover:bg-mauve-700"
      >
        View all posts
      </Link>
    </div>
  );
}
