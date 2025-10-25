import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
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
import "./styles/App.css";
import { RoleGuard } from "./features";
import Layout from "./layouts/Layout";

const NotFound = () => (
  <section className="section-padding bg-ivory text-center">
    <h1 className="mb-4 font-heading text-4xl text-charcoal sm:text-5xl">Page not found</h1>
    <p className="max-w-xl text-lg font-body text-charcoal/75">
      The page you are looking for does not exist. Use the navigation above to return to your concierge dashboard.
    </p>
  </section>
);

const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
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
      <Route path="/community-forum" element={<CommunityForum />} />
      <Route path="/forum" element={<Navigate to="/community-forum" replace />} />
      <Route path="/portal" element={<Portal />} />
      <Route path="/login" element={<Portal />} />
      <Route path="/create-profile" element={<CreateProfile />} />
      <Route path="/register" element={<CreateProfile />} />
      <Route path="/invite" element={<RequestInvite />} />
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
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

const App = () => (
  <>
    <ScrollToTop />
    <AppRoutes />
  </>
);

export default App;

// import React from "react";
// import TestTailwind from "./components/TestTailwind";

// function App() {
//   return <TestTailwind />;
// }

// export default App;
