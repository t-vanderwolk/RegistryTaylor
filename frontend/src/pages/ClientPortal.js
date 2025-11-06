import React, { useMemo } from "react";
import { Routes, Route, Navigate, NavLink, useLocation } from "react-router-dom";
import Topbar from "../components/Layout/Topbar";
import PortalNav, { buildPortalNavItems, getClientPortalBasePath } from "../components/Layout/PortalNav";
import Dashboard from "./client/Dashboard";
import Bio from "./client/Bio";
import MyJourney from "./client/MyJourney";
import CommunityForum from "./CommunityForum";
import ClientMessages from "./client/Messages";
<<<<<<< HEAD
import Memories from "./client/Memories";
import Learn from "./client/Learn";
import LearnModule from "./client/LearnModule";
import Plan from "./client/Plan";
import Connect from "./client/Connect";
=======
import Services from "./client/Services";
import Memories from "./client/Memories";
import Registry from "./client/Registry";
>>>>>>> heroku/main

const ClientPortal = () => {
  const location = useLocation();
  const basePath = getClientPortalBasePath(location.pathname);
  const navItems = useMemo(() => buildPortalNavItems(basePath), [basePath]);

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-ivory/40 text-charcoal">
=======
    <div className="min-h-screen bg-cream/40 text-darkText">
>>>>>>> heroku/main
      <Topbar />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col lg:flex-row">
        <PortalNav basePath={basePath} />
        <main className="flex-1 space-y-8 px-4 py-8 lg:px-10">
<<<<<<< HEAD
          <div className="sticky top-[72px] z-20 mb-6 border-b border-blush/30 bg-ivory/80 backdrop-blur lg:hidden">
=======
          <div className="sticky top-[72px] z-20 mb-6 border-b border-babyPink/30 bg-cream/80 backdrop-blur lg:hidden">
>>>>>>> heroku/main
            <div className="flex gap-3 overflow-x-auto px-1 pb-3 pt-4">
              {navItems.map(({ to, label, end }) => (
                <NavLink
                  key={`mobile-${to}`}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `whitespace-nowrap rounded-full px-4 py-2 text-xs font-heading uppercase tracking-[0.25em] transition ${
                      isActive
<<<<<<< HEAD
                        ? "bg-mauve/30 text-charcoal shadow-soft"
                        : "bg-white/80 text-charcoal/60"
=======
                        ? "bg-babyBlue/30 text-blueberry shadow-soft"
                        : "bg-white/80 text-darkText/60"
>>>>>>> heroku/main
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
<<<<<<< HEAD
            <Route path="learn" element={<Learn />} />
            <Route path="learn/:moduleId" element={<LearnModule />} />
            <Route path="plan" element={<Plan />} />
            <Route path="connect" element={<Connect />} />
            <Route path="bio" element={<Bio />} />
            <Route path="journey" element={<MyJourney />} />
            <Route path="memories" element={<Memories />} />
            <Route path="messages" element={<ClientMessages />} />
            <Route path="bio/*" element={<Navigate to={`${basePath}/bio`} replace />} />
            <Route path="journey/*" element={<Navigate to={`${basePath}/journey`} replace />} />
            <Route path="learn/*" element={<Navigate to={`${basePath}/learn`} replace />} />
            <Route path="plan/*" element={<Navigate to={`${basePath}/plan`} replace />} />
            <Route path="connect/*" element={<Navigate to={`${basePath}/connect`} replace />} />
            <Route path="memories/*" element={<Navigate to={`${basePath}/memories`} replace />} />
            <Route path="registry/*" element={<Navigate to={`${basePath}/plan`} replace />} />
            <Route path="services/*" element={<Navigate to={`${basePath}/connect`} replace />} />
=======
            <Route path="bio" element={<Bio />} />
            <Route path="journey" element={<MyJourney />} />
            <Route path="registry" element={<Registry />} />
            <Route path="memories" element={<Memories />} />
            <Route path="bio/*" element={<Navigate to={`${basePath}/bio`} replace />} />
            <Route path="journey/*" element={<Navigate to={`${basePath}/journey`} replace />} />
            <Route path="registry/*" element={<Navigate to={`${basePath}/registry`} replace />} />
            <Route path="memories/*" element={<Navigate to={`${basePath}/memories`} replace />} />
            <Route path="messages" element={<ClientMessages />} />
>>>>>>> heroku/main
            <Route path="blog" element={<Navigate to="community-forum" replace />} />
            <Route path="forum" element={<Navigate to="community-forum" replace />} />
            <Route path="community-forum" element={<CommunityForum />} />
            <Route
              path="guides/stroller-styles-demystified"
              element={<Navigate to="/blog/stroller-styles-demystified" replace />}
            />
<<<<<<< HEAD
=======
            <Route path="services" element={<Services />} />
>>>>>>> heroku/main
            <Route path="*" element={<Navigate to="." replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default ClientPortal;
