const FOOTER_LINKS = [
  { label: "About", href: "/how-it-works" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "/request-invite" },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-[#D9C48E]/25 bg-[#FFFAF8]">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-5 px-6 py-12 text-center md:px-10">
        <div className="flex items-center gap-2">
          <span className="font-script text-3xl leading-none text-[#3E2F35]">Taylor-Made</span>
          <span className="inline-block h-4 w-px bg-[#D9C48E]/25" />
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]">
            Baby Co.
          </span>
        </div>
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap justify-center gap-4 font-serif text-xs uppercase tracking-[0.25em] text-[#3E2F35]/70">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-colors hover:text-[#3E2F35]">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="font-serif text-xs uppercase tracking-[0.25em] text-[#3E2F35]/50">
          © 2025 Taylor-Made Baby Co.
        </p>
      </div>
    </footer>
  );
}
