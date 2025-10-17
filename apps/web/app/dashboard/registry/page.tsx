import {
  getAffiliateProducts,
  getRegistry,
} from "../../../lib/api";
import { RegistryDashboard } from "../../../components/RegistryDashboard";

export default async function RegistryPage() {
  const [products, registryItems] = await Promise.all([
    getAffiliateProducts(),
    getRegistry(),
  ]);

  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl text-tmCharcoal">Registry</h1>
        <p className="text-sm text-tmCharcoal/70">
          Curate, track, and share your Taylor-made registry. Add favorites with one click, keep
          affiliate attribution intact, and prep for mentor reviews with real-time status updates.
        </p>
      </div>
      <RegistryDashboard
        initialProducts={products}
        initialRegistry={registryItems}
      />
    </div>
  );
}
