import React from "react";

type MarketingLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children, className = "" }) => {
  return (
    <div className={["min-h-screen bg-ivory text-charcoal", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
};

export default MarketingLayout;
