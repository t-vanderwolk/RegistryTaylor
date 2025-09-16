import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Faq from "./pages/Faq";
import Blog from "./pages/Blog";
import "./styles/App.css";

const NotFound = () => (
  <main className="min-h-screen flex flex-col items-center justify-center bg-cloudWhite px-6 text-center text-deepSlate">
    <h1 className="text-5xl font-serif mb-4">Page not found</h1>
    <p className="text-lg text-cozyGray/75 max-w-xl">
      The page you are looking for does not exist. Use the navigation above to get back on track.
    </p>
  </main>
);

const App = () => (
  <Router>
    <ScrollToTop />
    <Navbar />
    <Routes future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default App;

// import React from "react";
// import TestTailwind from "./components/TestTailwind";

// function App() {
//   return <TestTailwind />;
// }

// export default App;
