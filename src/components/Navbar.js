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
    <nav className="sticky top-0 z-30 bg-cloudWhite/80 backdrop-blur-lg border-b border-softLavender/40 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-cozyGray">
        <Link to="/" className="flex items-center gap-3 text-base sm:text-lg font-serif">
          <span className="font-cursive text-2xl sm:text-3xl text-babyPink drop-shadow">Taylor-Made</span>
          <span className="hidden sm:inline text-sm tracking-[0.35em] uppercase text-cozyGray/70">
            Baby Planning
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 transition-colors duration-200 ${
                  isActive
                    ? "bg-babyPink/40 text-cozyGray shadow-sm"
                    : "text-cozyGray/70 hover:text-babyPink"
                }`
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
