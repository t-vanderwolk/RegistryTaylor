export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFAF8] px-6 text-center text-[#3E2F35]">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Not found</p>
      <h1 className="mt-4 font-serif text-3xl text-[#3E2F35]">We couldn’t find that page.</h1>
      <p className="mt-2 text-sm text-[#3E2F35]/70">Please check the URL or return to the home page.</p>
      <a href="/" className="mt-6 rounded-full border border-[#C8A1B4] px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:bg-[#EAC9D1]/30">
        Return home
      </a>
    </div>
  );
}
