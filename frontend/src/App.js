import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { Navbar, Footer } from "./components/ui";

import Home from "./pages/Home";
import About from "./pages/About";
import Membership from "./pages/Membership";
import AddOns from "./pages/AddOns";
import Mentors from "./pages/Mentors";
import Contact from "./pages/Contact";
import Faq from "./pages/Faq";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import CarSeatsSimplified from "./pages/CarSeatsSimplified";
import CommunityForum from "./pages/CommunityForum";
import Portal from "./pages/Portal";
import AdminPortal from "./pages/AdminPortal";
import ClientPortal from "./pages/ClientPortal";
import MentorPortal from "./pages/MentorPortal";
import UserPortal from "./pages/UserPortal";
import CreateProfile from "./pages/CreateProfile";
import RequestInvite from "./pages/RequestInvite";
import Academy from "./pages/Academy";
import { RoleGuard } from "./features";
import HowItWorks from "./pages/HowItWorks";
import "./styles/App.css";

const NotFound = () => (
  <main className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-center text-charcoal">
    <h1 className="mb-4 text-5xl font-heading text-charcoal">Page not found</h1>
    <p className="max-w-xl text-lg font-body text-charcoal/70">
      The page you are looking for does not exist. Use the navigation above to
      return to your concierge dashboard.
    </p>
  </main>
);

const AppRoutes = () => {
  const location = useLocation();

  // Pages that use MarketingLayout (they already include Navbar + Footer)
  const marketingPaths = new Set([
    "/",
    "/about",
    "/membership",
    "/mentors",
    "/contact",
    "/request-invite",
    "/how-it-works",
    "/blog",
  ]);

  const isMarketingPage = Array.from(marketingPaths).some((p) =>
    location.pathname.startsWith(p)
  );

  // Standalone pages (no chrome)
  const standaloneLayoutPaths = new Set(["/portal", "/login"]);
  const hideChrome =
    location.pathname.startsWith("/admin-portal") ||
    location.pathname.startsWith("/admin") ||
    standaloneLayoutPaths.has(location.pathname);

  // Default nav links for non-marketing pages
  const defaultNav = [
    { label: "Home", to: "/" },
    { label: "How It Works", to: "/how-it-works" },
    { label: "Membership", to: "/membership" },
    { label: "Blog", to: "/blog" },
    { label: "Request Invite", to: "/request-invite" },
    { label: "Member Login", to: "/portal" },
  ];

  return (
    <>
      {/* Show Navbar + Footer only for non-marketing, non-hidden pages */}
      {!hideChrome && !isMarketingPage && <Navbar items={defaultNav} />}

      <main
        id="main-content"
        tabIndex="-1"
        className="outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
      >
        <Routes>
          {/* Marketing / Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/add-ons" element={<AddOns />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/request-invite" element={<RequestInvite />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/car-seats-simplified" element={<CarSeatsSimplified />} />

          {/* Community + Portals */}
          <Route path="/community-forum" element={<CommunityForum />} />
          <Route path="/forum" element={<Navigate to="/community-forum" replace />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/login" element={<Portal />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/register" element={<CreateProfile />} />
          <Route path="/invite" element={<RequestInvite />} />

          {/* Role-Restricted Routes */}
          <Route
            path="/academy/*"
            element={
              <RoleGuard allow={["CLIENT", "MENTOR", "ADMIN"]}>
                <Academy />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/*"
            element={
              <RoleGuard allow={["ADMIN"]}>
                <AdminPortal />
              </RoleGuard>
            }
          />
          <Route path="/admin-portal/*" element={<Navigate to="/admin" replace />} />
          <Route
            path="/dashboard/*"
            element={
              <RoleGuard allow={["CLIENT", "ADMIN"]}>
                <ClientPortal />
              </RoleGuard>
            }
          />
          <Route path="/client-portal/*" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/mentor/*"
            element={
              <RoleGuard allow={["MENTOR", "ADMIN"]}>
                <MentorPortal />
              </RoleGuard>
            }
          />
          <Route path="/mentor-portal/*" element={<Navigate to="/mentor" replace />} />
          <Route path="/user-portal" element={<UserPortal />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!hideChrome && !isMarketingPage && <Footer />}
    </>
  );
};

const App = () => (
  <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
    <ScrollToTop />
    <AppRoutes />
  </Router>
);

export default App;