import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Faq from "./pages/Faq";              // ✅ lowercase aq matches filename
import "./styles/App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateHome from "./pages/PrivateHome";
import CreateProfile from "./pages/CreateProfile";
import EditProfile from "./pages/EditProfile";
import Blog from "./pages/Blog";

const ProtectedRoute = ({ children }) => {
  const { authorized } = useAuth();
  return authorized ? children : <Navigate to="/" replace />;
};
const TopActions = () => {
  const { authorized, memberName, setAuthorized, setMemberName, setDueDate, setMonthsPregnant, setOriginalDueDate } = useAuth();
  const navigate = useLocation(); // just to keep hook parity; navigate not needed here
  if (!authorized) return null;
  const logout = () => {
    setAuthorized(false);
    setMemberName("");
    setDueDate("");
    setMonthsPregnant(null);
    setOriginalDueDate("");
    // route back to landing handled by ProtectedRoute redirect
  };
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 30, background: '#fff',
      borderBottom: '1px solid #D4AF37', padding: '0.5rem 1rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <a href="/blog" style={{ color: '#000', textDecoration: 'none' }}>Blog</a>
        <a href="/editprofile" style={{ color: '#000', textDecoration: 'none' }}>Edit Profile</a>
        <button onClick={logout} style={{
          border: '1px solid #D4AF37', background: 'transparent', color: '#000',
          padding: '0.25rem 0.75rem', borderRadius: '9999px', cursor: 'pointer'
        }}>Log out</button>
      </div>
    </div>
  );
};

const AppContent = () => {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      <TopActions />
      <Routes>
          <Route
            path="/"
            element={
              useAuth().authorized ? <Navigate to="/welcome" replace /> : <Home />
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <Services />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faq"
            element={
              <ProtectedRoute>
                <Faq />
              </ProtectedRoute>
            }
          />
          <Route
            path="/welcome"
            element={
              <ProtectedRoute>
                <PrivateHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-profile"
            element={
              <ProtectedRoute>
                <CreateProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editprofile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog"
            element={
              <ProtectedRoute>
                <Blog />
              </ProtectedRoute>
            }
          />
        </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;

// import React from "react";
// import TestTailwind from "./components/TestTailwind";

// function App() {
//   return <TestTailwind />;
// }

// export default App;
