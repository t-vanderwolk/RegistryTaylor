import React from "react";
import { FaceSmileIcon } from "@heroicons/react/24/outline";

const EmptyState = ({
  title = "Nothing here yet",
  description,
  icon: Icon = FaceSmileIcon,
  action,
  className = "",
}) => {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-charcoal/12 bg-shell/60 px-6 py-10 text-center shadow-elevated-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blush/40 text-charcoal shadow-elevated-sm">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h3 className="font-heading text-xl font-semibold text-charcoal">{title}</h3>
      {description && <p className="max-w-sm font-body text-sm text-charcoal/70">{description}</p>}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;
