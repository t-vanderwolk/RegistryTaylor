import InviteRequestForm from "./InviteRequestForm";
import PageSection from "@/components/PageSection";

export const metadata = {
  title: "Request an Invite",
  description:
    "Request an invitation to Taylor-Made Baby Co. and begin your concierge-guided Learn · Plan · Connect journey.",
};

export default function RequestInvitePage() {
  return (
    <div className="bg-[#FFFAF8]">
      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Request invite</p>
          <h1 className="font-serif text-4xl text-[#3E2F35]">We’ll prepare a bespoke welcome</h1>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#3E2F35]/75">
            Share a few details about your family and timeline. Invitations are intentionally limited so every member
            receives white-glove support from our concierge and mentor team.
          </p>
        </div>
      </PageSection>

      <PageSection>
        <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-[#C8A1B4]/30 bg-white p-8 shadow-[0_8px_30px_rgba(200,161,180,0.12)] md:p-12">
          <InviteRequestForm />
        </div>
      </PageSection>
    </div>
  );
}
