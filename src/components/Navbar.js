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
        background: "#282c34",
        display: "flex",
        justifyContent: "center",
        gap: "2rem", // evenly spaced
      }}
    >
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>
        Home
      </Link>
      <Link to="/about" style={{ color: "white", textDecoration: "none" }}>
        About
      </Link>
      <Link to="/services" style={{ color: "white", textDecoration: "none" }}>
        Services
      </Link>
      <Link to="/contact" style={{ color: "white", textDecoration: "none" }}>
        Contact
      </Link>
      <Link to="/faq" style={{ color: "white", textDecoration: "none" }}>
        FAQ
      </Link>
      {authorized && (
        <>
          <span style={{ color: "white" }}>
            Welcome, <span className="font-cursive">{memberName}</span>
          </span>
          <button
            onClick={logout}
            style={{
              color: "white",
              background: "transparent",
              border: "1px solid white",
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
