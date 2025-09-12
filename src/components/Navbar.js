import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const navigate = useNavigate();
  const { authorized, memberName, setAuthorized, setMemberName, setDueDate, setMonthsPregnant, setOriginalDueDate } = useAuth();
  const logout = () => {
    setAuthorized(false);
    setMemberName("");
    setDueDate("");
    setMonthsPregnant(null);
    setOriginalDueDate("");
    navigate("/");
  };
  return (
    <nav
      style={{
        padding: "1rem",
        background: "#ffffff",
        display: "flex",
        justifyContent: "center",
        gap: "2rem", // evenly spaced
        borderBottom: "1px solid #D4AF37",
      }}
    >
      <Link to="/" style={{ color: "#000", textDecoration: "none" }}>
        Home
      </Link>
      <Link to="/about" style={{ color: "#000", textDecoration: "none" }}>
        About
      </Link>
      <Link to="/services" style={{ color: "#000", textDecoration: "none" }}>
        Services
      </Link>
      <Link to="/contact" style={{ color: "#000", textDecoration: "none" }}>
        Contact
      </Link>
      <Link to="/faq" style={{ color: "#000", textDecoration: "none" }}>
        FAQ
      </Link>
      {authorized && (
        <>
          <Link to="/blog" style={{ color: "#000", textDecoration: "none" }}>
            Blog
          </Link>
          <Link to="/editprofile" style={{ color: "#000", textDecoration: "none" }}>
            Edit Profile
          </Link>
          <span style={{ color: "#000" }}>
            Welcome, <span className="font-cursive">{memberName}</span>
          </span>
          <button
            onClick={logout}
            style={{
              color: "#000",
              background: "transparent",
              border: "1px solid #D4AF37",
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              cursor: "pointer",
            }}
          >
            Log out
          </button>
        </>
      )}
    </nav>
  );
};

export default NavBar;
