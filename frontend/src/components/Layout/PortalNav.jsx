import React from "react";
import { NavLink } from "react-router-dom";

export const portalNavItems = [
  { to: ".", label: "Dashboard", end: true },
  { to: "bio", label: "Bio" },
  { to: "journey", label: "My Journey" },
  { to: "belly-pics", label: "Belly Pics" },
  { to: "private-blog", label: "Private Blog" },
  { to: "services", label: "Services" },
  { to: "resources", label: "Resources" },
  { to: "progress", label: "Progress" },
];

const PortalNav = () => {
  return (
    <nav className="sticky top-[88px] hidden h-[calc(100vh-88px)] w-64 flex-col gap-3 overflow-y-auto border-r border-babyPink/30 bg-white/70 p-6 backdrop-blur-lg lg:flex">
      <div className="space-y-1">
        {portalNavItems.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `block rounded-2xl px-4 py-3 text-sm font-heading uppercase tracking-[0.25em] transition ${
                isActive
                  ? "bg-babyBlue/30 text-blueberry shadow-soft"
                  : "text-darkText/60 hover:bg-babyPink/20 hover:text-blueberry"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default PortalNav;
