import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getClientPortalBasePath } from "./PortalNav";

const Topbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const homePath = getClientPortalBasePath(location.pathname);

  return (
<<<<<<< HEAD
    <header className="sticky top-0 z-30 border-b border-blush/40 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-charcoal/40">Client Portal</p>
          <h1 className="font-playful text-2xl text-charcoal">Taylor-Made Lounge</h1>
=======
    <header className="sticky top-0 z-30 border-b border-babyPink/40 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-darkText/40">Client Portal</p>
          <h1 className="font-playful text-2xl text-blueberry">Taylor-Made Lounge</h1>
>>>>>>> heroku/main
        </div>
        <div className="flex items-center gap-4">
          <Link
            to={homePath}
<<<<<<< HEAD
            className="inline-flex rounded-full border border-mauve/50 bg-mauve/10 px-5 py-2 text-xs font-heading uppercase tracking-[0.3em] text-charcoal shadow-soft transition hover:-translate-y-0.5 hover:bg-mauve/20"
=======
            className="inline-flex rounded-full border border-babyBlue/50 bg-babyBlue/10 px-5 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft transition hover:-translate-y-0.5 hover:bg-babyBlue/20"
>>>>>>> heroku/main
          >
            Portal Home
          </Link>
          <div className="hidden text-right sm:block">
<<<<<<< HEAD
            <p className="text-xs uppercase tracking-[0.3em] text-charcoal/50">Welcome</p>
            <p className="text-sm font-heading text-charcoal">{user?.name || "Valued Client"}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blush/30 text-charcoal font-heading">
=======
            <p className="text-xs uppercase tracking-[0.3em] text-darkText/50">Welcome</p>
            <p className="text-sm font-heading text-blueberry">{user?.name || "Valued Client"}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-babyPink/30 text-blueberry font-heading">
>>>>>>> heroku/main
            {user?.name ? user.name.charAt(0).toUpperCase() : "C"}
          </div>
          <button
            type="button"
            onClick={logout}
<<<<<<< HEAD
            className="rounded-full border border-blush/50 bg-blush/10 px-5 py-2 text-xs font-heading uppercase tracking-[0.3em] text-charcoal shadow-soft transition hover:-translate-y-0.5 hover:bg-blush/20"
=======
            className="rounded-full border border-babyPink/50 bg-babyPink/10 px-5 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft transition hover:-translate-y-0.5 hover:bg-babyPink/20"
>>>>>>> heroku/main
          >
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
