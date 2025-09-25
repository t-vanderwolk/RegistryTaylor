import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  SparklesIcon,
  Squares2X2Icon,
  UserGroupIcon,
  NewspaperIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  QueueListIcon,
  PhoneIcon,
  HomeModernIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import Button from "./UI/Button";
import { useAuth } from "../context/AuthContext";
import logoImage from "../assets/taylor-made-logo.png";

const NAV_LINKS = [
  { to: "/membership", label: "Membership", icon: SparklesIcon },
  {
    label: "Services",
    icon: QueueListIcon,
    children: [
      { to: "/add-ons#gear-shopping", label: "Registry Planning", icon: Squares2X2Icon },
      { to: "/add-ons#nursery-home", label: "Nursery Design", icon: HomeModernIcon },
      { to: "/add-ons#family-lifestyle", label: "Concierge Support", icon: PhoneIcon },
    ],
  },
  { to: "/add-ons", label: "Add-Ons", icon: Squares2X2Icon },
  { to: "/mentors", label: "Mentors", icon: UserGroupIcon },
  { to: "/blog", label: "Blog", icon: NewspaperIcon },
  { to: "/about", label: "About", icon: InformationCircleIcon },
  { to: "/contact", label: "Contact", icon: EnvelopeIcon },
];

const linkClasses = ({ isActive }) =>
  `group relative inline-flex items-center gap-2 rounded-full border-b-2 px-4 py-2 text-xs font-heading uppercase tracking-[0.28em] transition-colors duration-200 ${
    isActive
      ? "border-gold bg-white/90 text-blueberry shadow-soft"
      : "border-transparent text-darkText/70 hover:border-gold hover:text-gold"
  }`;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();
  const { token, role, logout } = useAuth();

  const toggleMenu = () => setOpen((current) => !current);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    setOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mq = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event) => {
      if (!event.matches) {
        setServicesOpen(false);
      }
    };

    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const portalDestinations = {
    admin: "/admin-portal",
    mentor: "/mentor-portal",
    client: "/client-portal",
  };

  const messagesDestinations = {
    admin: "/admin-portal/messages",
    mentor: "/mentor-portal/messages",
    client: "/client-portal/messages",
  };

  const portalHome = portalDestinations[role] || "/portal";
  const messagesHome = messagesDestinations[role] || null;

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-babyPink/40 bg-cream/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link to="/" className="flex items-center gap-4" onClick={closeMenu}>
          <img
            src={logoImage}
            alt="Taylor-Made Baby Co. logo"
            className="h-16 w-auto object-contain drop-shadow-sm md:h-20"
          />
          <div className="flex flex-col leading-tight text-darkText">
            <span className="font-heading text-xl sm:text-2xl">Taylor-Made Baby Co.</span>
            <span className="text-[0.6rem] font-heading uppercase tracking-[0.4em] text-darkText/60">
              Invite-Only Concierge
            </span>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center justify-end gap-4 lg:flex">
          <ul className="flex items-center gap-3">
            {NAV_LINKS.map((item) => {
              if (item.children) {
                return (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button
                      type="button"
                      className="group inline-flex items-center gap-2 rounded-full border-b-2 border-transparent px-4 py-2 text-xs font-heading uppercase tracking-[0.28em] text-darkText/70 transition-colors duration-200 hover:border-gold hover:text-gold"
                      onClick={() => setServicesOpen((prev) => !prev)}
                    >
                      {item.icon && <item.icon className="h-4 w-4 text-gold" aria-hidden="true" />}
                      {item.label}
                      <ChevronDownIcon
                        className={`h-4 w-4 transition duration-200 ${servicesOpen ? "text-gold rotate-180" : "text-darkText/50"}`}
                        aria-hidden="true"
                      />
                    </button>
                    {servicesOpen && (
                      <div className="absolute left-1/2 top-full z-50 mt-3 w-56 -translate-x-1/2 rounded-2xl border border-pastelPurple/40 bg-white/95 p-4 shadow-lg">
                        <ul className="space-y-3">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <Link
                                to={child.to}
                                className="flex items-center gap-3 rounded-xl px-3 py-2 font-body text-sm text-darkText/70 transition hover:bg-pastelPurple/20 hover:text-blueberry"
                              >
                                {child.icon && <child.icon className="h-4 w-4 text-gold" aria-hidden="true" />}
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.label}>
                  <NavLink to={item.to} className={linkClasses}>
                    {item.icon && <item.icon className="h-4 w-4 text-gold" aria-hidden="true" />}
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {token && messagesHome && (
            <Link
              to={messagesHome}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-babyPink/60 bg-white text-blueberry shadow-toy transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-dreamy"
              onClick={closeMenu}
              aria-label="Messages"
            >
              <EnvelopeIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
          )}
          {!token && (
            <Button
              as={Link}
              to="/request-invite"
              variant="pink"
              size="sm"
              className="tracking-[0.25em] uppercase"
              onClick={closeMenu}
            >
              Request Invite
            </Button>
          )}
          <Button
            as={Link}
            to={portalHome}
            variant="blue"
            size="sm"
            className="tracking-[0.25em] uppercase"
            onClick={closeMenu}
          >
            {token ? "Portal Home" : "Member Portal"}
          </Button>
          {token && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-full border border-babyPink/60 bg-transparent px-4 py-2 text-xs font-heading uppercase tracking-[0.25em] text-blueberry shadow-toy transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-dreamy"
            >
              Log Out
            </button>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-babyPink/60 bg-cream/90 px-4 py-2 text-xs font-heading uppercase tracking-[0.28em] text-darkText shadow-toy transition duration-200 lg:hidden"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          Menu
        </button>
      </div>

      {open && (
        <div className="lg:hidden">
          <div className="space-y-3 border-t border-babyPink/40 bg-cream/95 px-4 py-6 shadow-toy">
            {NAV_LINKS.map((item) => {
              if (item.children) {
                return (
                  <div key={item.label} className="rounded-2xl border border-pastelPurple/40 bg-white/90 p-4 shadow-soft">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between font-heading text-xs uppercase tracking-[0.3em] text-darkText/70"
                      onClick={() => setMobileServicesOpen((prev) => !prev)}
                    >
                      <span className="flex items-center gap-2">
                        {item.icon && <item.icon className="h-4 w-4 text-gold" aria-hidden="true" />}
                        {item.label}
                      </span>
                      <ChevronDownIcon
                        className={`h-4 w-4 transition ${mobileServicesOpen ? "rotate-180 text-gold" : "text-darkText/50"}`}
                        aria-hidden="true"
                      />
                    </button>
                    {mobileServicesOpen && (
                      <ul className="mt-3 space-y-2">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              to={child.to}
                              onClick={closeMenu}
                              className="flex items-center gap-2 rounded-xl px-3 py-2 font-body text-sm text-darkText/70 transition hover:bg-pastelPurple/20 hover:text-blueberry"
                            >
                              {child.icon && <child.icon className="h-4 w-4 text-gold" aria-hidden="true" />}
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `block rounded-full px-4 py-3 font-heading text-sm tracking-[0.18em] transition duration-200 shadow-toy ${
                      isActive
                        ? "bg-babyPink text-darkText"
                        : "bg-cream/90 text-darkText/70 hover:bg-babyBlue/80 hover:text-darkText"
                    }`
                  }
                  onClick={closeMenu}
                >
                  <span className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-4 w-4 text-gold" aria-hidden="true" />}
                    {item.label}
                  </span>
                </NavLink>
              );
            })}

            {!token && (
              <Button as={Link} to="/request-invite" variant="pink" size="md" className="w-full" onClick={closeMenu}>
                Request Invite
              </Button>
            )}
            <Button as={Link} to={portalHome} variant="blue" size="md" className="w-full" onClick={closeMenu}>
              {token ? "Portal Home" : "Member Portal"}
            </Button>
            {token && messagesHome && (
              <Link
                to={messagesHome}
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-full border border-babyPink/60 bg-white px-4 py-3 text-sm font-heading uppercase tracking-[0.3em] text-blueberry shadow-toy transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-dreamy"
              >
                <EnvelopeIcon className="h-4 w-4" aria-hidden="true" />
                Messages
              </Link>
            )}
            {token && (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-full border border-babyPink/60 bg-transparent px-6 py-3 text-sm font-heading uppercase tracking-[0.3em] text-blueberry shadow-toy transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-dreamy"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
