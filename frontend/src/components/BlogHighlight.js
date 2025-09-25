import React from "react";
import { Link } from "react-router-dom";

const BlogHighlight = () => {
  return (
    <section
      id="blog"
      className="mx-auto mt-16 max-w-5xl rounded-[3rem] border border-babyBlue/20 bg-white px-6 py-10 shadow-soft"
    >
      <div className="flex flex-col gap-6 text-center md:flex-row md:items-center md:text-left">
        <div className="md:w-2/3">
          <p className="text-xs font-heading uppercase tracking-[0.45em] text-blueberry/60">Pastel Perspectives</p>
          <h2 className="mt-3 text-3xl font-heading text-blueberry">Visit the Taylor-Made Blog</h2>
          <p className="mt-3 text-sm text-midnight/75">
            Explore registry roundups, nursery inspiration, and concierge-approved prep tips designed to ease your planning journey. Fresh posts drop every month to keep your baby prep joyful and calm.
          </p>
        </div>
        <div className="md:w-1/3">
          <div className="rounded-[2rem] border border-babyBlue/25 bg-softBeige/70 p-6 text-left shadow-soft">
            <p className="text-xs font-heading uppercase tracking-[0.35em] text-blueberry/60">Featured Story</p>
            <h3 className="mt-2 text-xl font-heading text-blueberry">The Soft-Launch Registry Checklist</h3>
            <p className="mt-3 text-sm text-midnight/80">
              Peek at Taylor’s go-to essentials for busy parents balancing style, support, and sanity.
            </p>
            <Link
              to="/blog"
              className="mt-5 inline-flex items-center justify-center rounded-full border border-babyBlue/30 bg-white px-5 py-3 text-xs font-heading uppercase tracking-[0.35em] text-blueberry shadow-soft transition hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-babyPink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60"
            >
              Read the blog
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogHighlight;
