import LoginForm from "./LoginForm";
import PageSection from "@/components/PageSection";

export const metadata = {
  title: "Login",
  description: "Sign in to access your Taylor-Made Baby Co. dashboard and concierge journey.",
};

export default function LoginPage() {
  return (
    <PageSection>
      <div className="mx-auto grid max-w-screen-lg gap-10 rounded-[2.5rem] border border-[#C8A1B4]/30 bg-white p-8 shadow-[0_8px_30px_rgba(200,161,180,0.12)] md:grid-cols-[0.55fr,0.45fr] md:p-12">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Welcome back</p>
          <h1 className="font-serif text-3xl text-[#3E2F35] sm:text-4xl">Continue your Taylor-Made journey</h1>
          <p className="text-sm leading-relaxed text-[#3E2F35]/75">
            Sign in to pick up a module, adjust your registry, or join the latest mentor salon. Our concierge team is on
            hand if you need assistance with credentials or invitation status.
          </p>
        </div>

        <div className="rounded-[2rem] border border-[#D9C48E]/30 bg-[#FFFAF8] p-6 shadow-inner">
          <LoginForm />
        </div>
      </div>
    </PageSection>
  );
}
