import React from "react";
import { Navbar, Footer } from "../components/ui";
import type { NavItem } from "../components/ui";

type MarketingLayoutProps = {
  children: React.ReactNode;
};

const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  const navLinks: NavItem[] = [
    { label: "Home", to: "/", target: "home" },
    { label: "How It Works", to: "/#how-it-works", target: "how-it-works" },
    { label: "Membership", to: "/membership" },
    { label: "Blog", to: "/blog" },
    { label: "Request Invite", to: "/request-invite" },
    { label: "Member Login", to: "/portal" },
  ];

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:shadow-elevated-sm"
      >
        Skip to content
      </a>
      <Navbar items={navLinks} />

      <div id="content" role="main">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default MarketingLayout;
