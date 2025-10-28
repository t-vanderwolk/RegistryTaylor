import LoginForm from "./LoginForm";

export const metadata = {
  title: "Login",
  description: "Sign in to access your Taylor-Made Baby Co. dashboard and concierge journey.",
};

export default function LoginPage() {
  return (
    <div className="grid gap-10 rounded-[3rem] border border-[#C8A1B4]/35 bg-white/90 px-8 py-12 shadow-[0_30px_70px_rgba(200,161,180,0.18)] backdrop-blur-sm lg:grid-cols-[0.55fr,0.45fr] lg:px-12 lg:py-16">
      <div className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Welcome back</p>
        <h1 className="font-[var(--font-playfair)] text-3xl text-[#3E2F35] sm:text-4xl">
          Continue your Taylor-Made journey
        </h1>
        <p className="text-sm text-[#3E2F35]/70">
          Sign in to pick up a module, adjust your registry, or join the latest mentor salon. Reach out to concierge if you
          need assistance with your invitation or login credentials.
        </p>
      </div>

      <div className="rounded-[2.5rem] border border-[#E8C9D1]/40 bg-[#FFFAF8]/95 p-8 shadow-inner">
        <LoginForm />
      </div>
    </div>
  );
}
