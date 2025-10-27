import React, { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";

const buildPortalNavItems = (basePath) => [
  { to: basePath, label: "Dashboard", end: true },
  { to: `${basePath}/learn`, label: "Learn" },
  { to: `${basePath}/plan`, label: "Plan" },
  { to: `${basePath}/connect`, label: "Connect" },
  { to: `${basePath}/journey`, label: "Journey" },
  { to: `${basePath}/memories`, label: "Memories" },
  { to: `${basePath}/messages`, label: "Messages" },
  { to: `${basePath}/bio`, label: "Profile" },
];

export const getClientPortalBasePath = (pathname) =>
  pathname.startsWith("/dashboard") ? "/dashboard" : "/client-portal";

const PortalNav = ({ basePath: providedBase }) => {
  const location = useLocation();
  const basePath = providedBase || getClientPortalBasePath(location.pathname);
  const navItems = useMemo(() => buildPortalNavItems(basePath), [basePath]);

  return (
    <nav className="sticky top-[88px] hidden h-[calc(100vh-88px)] w-64 flex-col gap-3 overflow-y-auto border-r border-blush/30 bg-white/70 p-6 backdrop-blur-lg lg:flex">
      <div className="space-y-1">
        {navItems.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `block rounded-2xl px-4 py-3 text-sm font-heading uppercase tracking-[0.25em] transition ${
                isActive
                  ? "bg-mauve/30 text-charcoal shadow-soft"
                  : "text-charcoal/60 hover:bg-blush/20 hover:text-charcoal"
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
export { buildPortalNavItems };
