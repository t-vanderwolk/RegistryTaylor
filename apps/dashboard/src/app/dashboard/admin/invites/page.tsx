import { requireAdmin } from "@/lib/auth";

const INVITES = [
  {
    id: "ivy-green",
    email: "ivy.green@email.com",
    role: "MEMBER",
    status: "Pending",
    sentAt: "Oct 12 · 8:32 AM",
    code: "TMB-IA72",
  },
  {
    id: "mentor-jules",
    email: "jules.campbell@email.com",
    role: "MENTOR",
    status: "Accepted",
    sentAt: "Oct 10 · 1:20 PM",
    code: "TMB-ME21",
  },
  {
    id: "ops-maya",
    email: "maya.ops@email.com",
    role: "ADMIN",
    status: "Pending",
    sentAt: "Oct 9 · 5:04 PM",
    code: "TMB-AD11",
  },
];

export const metadata = {
  title: "Admin · Invites",
  description: "Manage member, mentor, and admin invitations.",
};

export default async function AdminInvitesPage() {
  await requireAdmin();

  return (
    <div className="space-y-8">
      <header className="rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Invites</p>
            <h1 className="mt-2 font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Track onboarding codes</h1>
            <p className="mt-2 text-sm text-[#3E2F35]/70">
              Monitor every concierge invite, resend codes, and confirm mentor/admin onboarding flows.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_10px_25px_rgba(200,161,180,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(200,161,180,0.4)]"
          >
            Create invite
          </button>
        </div>
      </header>

      <div className="overflow-hidden rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <table className="min-w-full divide-y divide-[#C8A1B4]/30 text-sm text-[#3E2F35]">
          <thead className="bg-[#FFFAF8] text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/65">
            <tr>
              <th scope="col" className="px-6 py-4 text-left">
                Email
              </th>
              <th scope="col" className="px-6 py-4 text-left">
                Role
              </th>
              <th scope="col" className="px-6 py-4 text-left">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-left">
                Sent
              </th>
              <th scope="col" className="px-6 py-4 text-left">
                Invite code
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#C8A1B4]/20">
            {INVITES.map((invite) => (
              <tr key={invite.id} className="transition hover:bg-[#FFFAF8]">
                <td className="whitespace-nowrap px-6 py-4">{invite.email}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="rounded-full bg-gradient-to-r from-[#C8A1B4]/15 via-[#EAC9D1]/20 to-[#FFFAF8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70">
                    {invite.role.toLowerCase()}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">{invite.status}</td>
                <td className="whitespace-nowrap px-6 py-4">{invite.sentAt}</td>
                <td className="whitespace-nowrap px-6 py-4 font-mono text-sm text-[#3E2F35]/70">{invite.code}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="inline-flex items-center gap-3">
                    <button className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4] underline underline-offset-4 transition hover:text-[#D9C48E]">
                      Copy
                    </button>
                    <button className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4] underline underline-offset-4 transition hover:text-[#D9C48E]">
                      Resend
                    </button>
                    <button className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4] underline underline-offset-4 transition hover:text-[#D9C48E]">
                      Revoke
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
