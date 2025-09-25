import React from "react";
import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import Topbar from "../components/Layout/Topbar";
import PortalNav, { portalNavItems } from "../components/Layout/PortalNav";
import Dashboard from "./client/Dashboard";
import Bio from "./client/Bio";
import MyJourney from "./client/MyJourney";
import PrivateBlog from "./PrivateBlog";
import ClientMessages from "./client/Messages";

const Placeholder = ({ title }) => (
  <section className="rounded-[2.5rem] border border-babyPink/30 bg-white/90 p-8 text-center shadow-soft backdrop-blur-sm">
    <h2 className="font-heading text-2xl text-blueberry">{title}</h2>
    <p className="mt-4 text-sm font-body text-darkText/70">
      This section is coming soon. Your concierge data will appear here once it is connected.
    </p>
  </section>
);

const ClientPortal = () => {
  return (
    <div className="min-h-screen bg-cream/40 text-darkText">
      <Topbar />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col lg:flex-row">
        <PortalNav />
        <main className="flex-1 space-y-8 px-4 py-8 lg:px-10">
          <div className="sticky top-[72px] z-20 mb-6 border-b border-babyPink/30 bg-cream/80 backdrop-blur lg:hidden">
            <div className="flex gap-3 overflow-x-auto px-1 pb-3 pt-4">
              {portalNavItems.map(({ to, label, end }) => (
                <NavLink
                  key={`mobile-${to}`}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `whitespace-nowrap rounded-full px-4 py-2 text-xs font-heading uppercase tracking-[0.25em] transition ${
                      isActive
                        ? "bg-babyBlue/30 text-blueberry shadow-soft"
                        : "bg-white/80 text-darkText/60"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="bio" element={<Bio />} />
            <Route path="journey" element={<MyJourney />} />
            <Route path="bio/*" element={<Navigate to="/client-portal/bio" replace />} />
            <Route path="journey/*" element={<Navigate to="/client-portal/journey" replace />} />
            <Route path="belly-pics" element={<Placeholder title="Belly Pics" />} />
            <Route path="messages" element={<ClientMessages />} />
            <Route path="blog" element={<Navigate to="private-blog" replace />} />
            <Route path="private-blog" element={<PrivateBlog />} />
            <Route path="services" element={<Placeholder title="Services" />} />
            <Route path="resources" element={<Placeholder title="Resources" />} />
            <Route path="progress" element={<Placeholder title="Progress" />} />
            <Route path="*" element={<Navigate to="." replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default ClientPortal;
