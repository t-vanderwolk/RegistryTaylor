import React from "react";
import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/faq", label: "FAQ" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

const NavBar = () => {
  return (
    <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gold/40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-black">
        <Link to="/" className="flex items-center gap-2 text-lg font-serif">
          <span className="font-cursive text-2xl text-gold">Taylor-Made</span>
          <span className="hidden sm:inline">Baby Planning</span>
        </Link>
        <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `transition-colors ${isActive ? "text-gold" : "text-black hover:text-gold"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
