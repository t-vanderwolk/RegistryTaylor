import React, { useMemo } from "react";
import { Routes, Route, Navigate, NavLink, useLocation } from "react-router-dom";
import Topbar from "../components/Layout/Topbar";
import PortalNav, { buildPortalNavItems, getClientPortalBasePath } from "../components/Layout/PortalNav";
import Dashboard from "./client/Dashboard";
import Bio from "./client/Bio";
import MyJourney from "./client/MyJourney";
import CommunityForum from "./CommunityForum";
import ClientMessages from "./client/Messages";
import Services from "./client/Services";
import Memories from "./client/Memories";
import Registry from "./client/Registry";

const ClientPortal = () => {
  const location = useLocation();
  const basePath = getClientPortalBasePath(location.pathname);
  const navItems = useMemo(() => buildPortalNavItems(basePath), [basePath]);

  return (
    <div className="min-h-screen bg-ivory/40 text-charcoal">
      <Topbar />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col lg:flex-row">
        <PortalNav basePath={basePath} />
        <main className="flex-1 space-y-8 px-4 py-8 lg:px-10">
          <div className="sticky top-[72px] z-20 mb-6 border-b border-blush/30 bg-ivory/80 backdrop-blur lg:hidden">
            <div className="flex gap-3 overflow-x-auto px-1 pb-3 pt-4">
              {navItems.map(({ to, label, end }) => (
                <NavLink
                  key={`mobile-${to}`}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `whitespace-nowrap rounded-full px-4 py-2 text-xs font-heading uppercase tracking-[0.25em] transition ${
                      isActive
                        ? "bg-mauve/30 text-charcoal shadow-soft"
                        : "bg-white/80 text-charcoal/60"
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
            <Route path="registry" element={<Registry />} />
            <Route path="memories" element={<Memories />} />
            <Route path="bio/*" element={<Navigate to={`${basePath}/bio`} replace />} />
            <Route path="journey/*" element={<Navigate to={`${basePath}/journey`} replace />} />
            <Route path="registry/*" element={<Navigate to={`${basePath}/registry`} replace />} />
            <Route path="memories/*" element={<Navigate to={`${basePath}/memories`} replace />} />
            <Route path="messages" element={<ClientMessages />} />
            <Route path="blog" element={<Navigate to="community-forum" replace />} />
            <Route path="forum" element={<Navigate to="community-forum" replace />} />
            <Route path="community-forum" element={<CommunityForum />} />
            <Route
              path="guides/stroller-styles-demystified"
              element={<Navigate to="/blog/stroller-styles-demystified" replace />}
            />
            <Route path="services" element={<Services />} />
            <Route path="*" element={<Navigate to="." replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default ClientPortal;
