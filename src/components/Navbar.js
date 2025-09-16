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

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-softGold/30 shadow-soft">
      <div className="flex w-full max-w-6xl items-center justify-start gap-8 px-4 py-4 text-deepSlate">
        <Link to="/" className="flex items-center gap-3 text-base sm:text-lg font-serif">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-softGold/60 bg-white text-sm font-semibold tracking-[0.3em] text-deepSlate">
            TM
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-cursive text-2xl sm:text-3xl">Taylor-Made</span>
            <span className="text-[0.7rem] uppercase tracking-[0.4em] text-cozyGray">
              Baby Planning
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4 text-[0.85rem] sm:text-sm font-medium tracking-[0.2em] uppercase">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `pb-1 transition-colors duration-200 ${
                  isActive
                    ? "text-deepSlate border-b-2 border-softGold"
                    : "text-cozyGray hover:text-deepSlate"
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

export default Navbar;
