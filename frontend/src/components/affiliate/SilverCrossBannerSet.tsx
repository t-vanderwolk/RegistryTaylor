import Image from "next/image";

const BANNERS = [
  {
    id: "silvercross-portrait",
    src: "https://silvercrossus.com/wp-content/uploads/2022/12/affiliate-banner.jpg",
    width: 298,
    height: 304,
    alt: "Silver Cross London Black Collection",
    caption: "London Black Collection · Concierge Exclusive",
  },
  {
    id: "silvercross-landscape",
    src: "https://silvercrossus.com/wp-content/uploads/2023/01/silvercross-affiliate-hero.jpg",
    width: 720,
    height: 300,
    alt: "Silver Cross Heritage Craftsmanship",
    caption: "Signature Heritage Craftsmanship",
  },
];

export default function SilverCrossBannerSet() {
  return (
    <section className="rounded-3xl border border-[#C8A1B4]/30 bg-[#FFFAF8] p-5 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Silver Cross</p>
          <h2 className="mt-1 font-[var(--font-playfair)] text-xl text-[#3E2F35]">
            Heritage strollers with concierge gifting perks
          </h2>
        </div>
        <a
          href="https://silvercrossus.com/affiliate/taylormadebaby"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-[#3E2F35] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#C8A1B4]"
        >
          View Collection
        </a>
      </header>

      <div className="mt-4 grid gap-4 lg:grid-cols-[298px,1fr]">
        {BANNERS.map((banner) => (
          <figure
            key={banner.id}
            className="overflow-hidden rounded-[2rem] border border-[#C8A1B4]/30 bg-white shadow-[0_10px_28px_rgba(200,161,180,0.18)]"
          >
            <Image
              src={banner.src}
              alt={banner.alt}
              width={banner.width}
              height={banner.height}
              className="h-full w-full object-cover"
            />
            <figcaption className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70">
              {banner.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
