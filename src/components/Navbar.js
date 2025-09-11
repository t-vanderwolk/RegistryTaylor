import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav style={{ padding: "1rem", background: "#282c34" }}>
      <Link to="/" style={{ color: "white", marginRight: "1rem" }}>
        Home
      </Link>
      <Link to="/about" style={{ color: "white" }}>
        About
      </Link>
    </nav>
  );
};

export default NavBar;