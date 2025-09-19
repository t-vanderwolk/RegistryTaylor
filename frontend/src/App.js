import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import Portal from "./pages/Portal";
import MentorPortal from "./pages/MentorPortal";
import AdminPortal from "./pages/AdminPortal";
import UserPortal from "./pages/UserPortal";
import "./styles/App.css";

const NotFound = () => (
  <main className="min-h-screen flex flex-col items-center justify-center bg-cream px-6 text-center text-darkText">
    <h1 className="text-5xl font-playful mb-4 text-babyBlue">Page not found</h1>
    <p className="text-lg font-body text-darkText/75 max-w-xl">
      The page you are looking for does not exist. Use the navigation above to return to your concierge dashboard.
    </p>
  </main>
);

const App = () => (
  <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
    <ScrollToTop />
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/membership" element={<Membership />} />
      <Route path="/add-ons" element={<AddOns />} />
      <Route path="/mentors" element={<Mentors />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/portal" element={<Portal />} />
      <Route path="/mentor-portal" element={<MentorPortal />} />
      <Route path="/admin-portal/*" element={<AdminPortal />} />
      <Route path="/user-portal" element={<UserPortal />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
  </Router>
);

export default App;

// import React from "react";
// import TestTailwind from "./components/TestTailwind";

// function App() {
//   return <TestTailwind />;
// }

// export default App;
