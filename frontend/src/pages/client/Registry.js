import React from "react";
import RegistryBoard from "../../components/registry/RegistryBoard";
import { RegistryManager } from "../../features/clients";

const Registry = () => {
  return (
    <div className="space-y-8">
      <section className="rounded-[2.5rem] border border-babyPink/40 bg-white/90 p-6 shadow-soft">
        <h2 className="text-2xl font-serif text-blueberry">Your registries</h2>
        <p className="mt-1 text-sm text-darkText/70">
          View registrar links curated by Taylor and your concierge team.
        </p>
        <div className="mt-4">
          <RegistryManager />
        </div>
      </section>
      <RegistryBoard role="client" />
    </div>
  );
};

export default Registry;
