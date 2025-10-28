import InviteRequestForm from "./InviteRequestForm";

export const metadata = {
  title: "Request an Invite",
  description:
    "Request an invitation to Taylor-Made Baby Co. and begin your concierge-guided Learn · Plan · Connect journey.",
};

export default function RequestInvitePage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Request Invite</p>
        <h1 className="font-[var(--font-playfair)] text-4xl text-[#3E2F35]">We’ll prepare a bespoke welcome</h1>
        <p className="mx-auto max-w-3xl text-sm text-[#3E2F35]/70">
          Share a little about your family, and our concierge team will reach out with next steps. Invitations are limited
          to ensure every member receives white-glove support.
        </p>
      </header>

      <section className="rounded-[3rem] border border-[#C8A1B4]/35 bg-white/90 p-10 shadow-[0_28px_62px_rgba(200,161,180,0.22)] backdrop-blur-sm">
        <InviteRequestForm />
      </section>
    </div>
  );
}
