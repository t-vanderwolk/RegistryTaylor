import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Membership from "./pages/Membership";
import AddOns from "./pages/AddOns";
import Mentors from "./pages/Mentors";
import Contact from "./pages/Contact";
import Faq from "./pages/Faq";
import Blog from "./pages/Blog";
import PrivateBlog from "./pages/PrivateBlog";
import Portal from "./pages/Portal";
import AdminPortal from "./pages/AdminPortal";
import ClientPortal from "./pages/ClientPortal";
import MentorPortal from "./pages/MentorPortal";
import UserPortal from "./pages/UserPortal";
import CreateProfile from "./pages/CreateProfile";
import RequestInvite from "./pages/RequestInvite";
import "./styles/App.css";
import ProtectedRoute from "./components/Layout/ProtectedRoute";

const NotFound = () => (
  <main className="min-h-screen flex flex-col items-center justify-center bg-cream px-6 text-center text-darkText">
    <h1 className="mb-4 text-5xl font-heading text-babyBlue">Page not found</h1>
    <p className="max-w-xl text-lg font-body text-darkText/75">
      The page you are looking for does not exist. Use the navigation above to return to your concierge dashboard.
    </p>
  </main>
);

const AppRoutes = () => {
  const location = useLocation();
  const hideChrome = location.pathname.startsWith("/admin-portal");

  return (
    <>
      {!hideChrome && (
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
      )}
      {!hideChrome && <Navbar />}
      <main id="main-content" tabIndex="-1" className="outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/70">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/add-ons" element={<AddOns />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/request-invite" element={<RequestInvite />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/private-blog" element={<PrivateBlog />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/admin-portal/*" element={<AdminPortal />} />
          <Route
            path="/client-portal/*"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <ClientPortal />
              </ProtectedRoute>
            }
          />
          <Route path="/mentor-portal/*" element={<MentorPortal />} />
          <Route path="/user-portal" element={<UserPortal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideChrome && <Footer />}
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

// import React from "react";
// import TestTailwind from "./components/TestTailwind";

// function App() {
//   return <TestTailwind />;
// }

// export default App;
