import { getInviteCodes, getAffiliateProducts } from "../../../lib/api";
import { InviteManager } from "../../../components/admin/InviteManager";
import { ProductManager } from "../../../components/admin/ProductManager";

export default async function AdminPage() {
  try {
    const [invites, products] = await Promise.all([
      getInviteCodes(),
      getAffiliateProducts(),
    ]);

    return (
      <div className="grid gap-10">
        <section className="rounded-3xl bg-mauve-blush px-6 py-10 shadow-soft md:px-12">
          <h1 className="font-heading text-4xl text-tmCharcoal">
            Admin Command Center
          </h1>
          <p className="mt-4 max-w-3xl text-sm text-tmCharcoal/75 md:text-base">
            Generate invites, manage affiliate offerings, and keep the Taylor-made experience
            feeling concierge-level across every touchpoint.
          </p>
        </section>
        <InviteManager initialInvites={invites} />
        <ProductManager initialProducts={products} />
      </div>
    );
  } catch (error) {
    console.error(error);
    return (
      <div className="rounded-3xl border border-tmBlush/60 bg-white/95 p-8 text-tmCharcoal">
        <h1 className="font-heading text-3xl text-tmCharcoal">Admin Access Only</h1>
        <p className="mt-3 text-sm text-tmCharcoal/70">
          You need elevated permissions to view this page. Please contact the Taylor-made team if
          you believe you should have access.
        </p>
      </div>
    );
  }
}
