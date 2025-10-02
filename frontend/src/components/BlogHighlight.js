import React from "react";
import { Link } from "react-router-dom";
import profileMom from "../assets/profile-mom.jpeg";

const BlogHighlight = () => {
  return (
    <section
      id="blog"
      className="relative mx-auto mt-20 max-w-6xl overflow-hidden rounded-[3.5rem] border border-babyPink/40 bg-softPink/45 px-6 py-16 shadow-soft backdrop-blur-sm motion-safe:animate-fade-in-up sm:px-10 md:px-16"
    >
      <div className="pointer-events-none absolute -right-28 top-10 h-72 w-72 rounded-full bg-babyPink/30 blur-3xl" aria-hidden="true" />

      <div className="relative grid gap-10 md:grid-cols-[1.1fr,0.9fr] md:items-center">
        <div className="space-y-6 text-center md:text-left">
          <p className="text-xs font-heading uppercase tracking-[0.32em] text-primary/80">Pastel Perspectives</p>
          <h2 className="text-4xl font-serif font-heading text-blueberry">
            Visit the <span className="font-cursive text-primary">Taylor-Made</span> Journal
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-600 md:mx-0">
            Swing by the journal for real registry picks, nursery ideas, and planning tips. It’s our way of keeping baby prep fun, calm, and on your terms.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center justify-center rounded-full border border-babyBlue/35 bg-white px-9 py-3 text-xs font-heading uppercase tracking-[0.4em] text-blueberry shadow-soft transition hover:-translate-y-1 hover:scale-105 hover:bg-softBeige focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Explore the Journal
          </Link>
        </div>

        <div className="relative">
          <div className="absolute -left-10 top-6 h-32 w-32 rounded-full bg-babyPink/35 blur-3xl" aria-hidden="true" />
          <article className="relative overflow-hidden rounded-[3rem] border border-babyPink/35 bg-white/88 shadow-dreamy backdrop-blur transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-md">
            <img src={profileMom} alt="Expectant parent journaling baby prep ideas" className="h-60 w-full object-cover" loading="lazy" />
            <div className="space-y-3 px-7 py-6 text-left">
              <p className="text-xs font-heading uppercase tracking-[0.4em] text-primary/80">Featured story</p>
              <h3 className="text-2xl font-serif font-heading text-blueberry">The Soft-Launch Registry Checklist</h3>
              <p className="text-sm leading-relaxed text-neutral-600">
                Taylor’s go-to plan for sharing your registry without awkward moments—plus reminders for thank-yous and gift tracking.
              </p>
              <Link
                to="/blog"
                className="inline-flex items-center justify-center rounded-full border border-babyBlue/35 bg-white px-6 py-2 text-xs font-heading uppercase tracking-[0.35em] text-blueberry shadow-soft transition hover:-translate-y-0.5 hover:scale-105 hover:bg-softBeige focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60"
              >
                Read more
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default BlogHighlight;
