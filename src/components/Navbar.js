import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
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
    </nav>
  );
};

export default NavBar;