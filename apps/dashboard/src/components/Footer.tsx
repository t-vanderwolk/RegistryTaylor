export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gold/50 bg-taupe">
      <div className="section-padding text-center">
        <h2 className="font-serif text-2xl text-charcoal-700 mb-4">Stay Connected</h2>
        <p className="font-sans text-[17px] text-charcoal-500 leading-[1.7] mb-6">
          Learn. Plan. Connect. Join the Taylor-Made community today.
        </p>
        <a
          href="/request-invite"
          className="inline-flex items-center rounded-full bg-mauve-500 px-6 py-3 font-sans text-sm font-semibold text-white transition hover:bg-mauve-700"
        >
          Request an Invite
        </a>
        <div className="mt-8 flex justify-center gap-6">
          <a href="#" className="font-sans text-mauve-700 transition hover:text-mauve-500">
            Instagram
          </a>
          <a href="#" className="font-sans text-mauve-700 transition hover:text-mauve-500">
            Pinterest
          </a>
          <a href="#" className="font-sans text-mauve-700 transition hover:text-mauve-500">
            Contact
          </a>
        </div>
        <div className="mt-10 text-sm font-sans text-charcoal-500">
          © {year} Taylor-Made Baby Co. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
