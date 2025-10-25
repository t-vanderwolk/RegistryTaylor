// import React, { useEffect, useRef } from "react";
// import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
// import { useAcademyContext } from "../Academy";
// import { useAuth } from "../../context/AuthContext";
// import Button from "../../design-system/Button";
// import { GraduationCap, LayoutDashboard } from "lucide-react";

// const AcademyLayout = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { role, user } = useAuth();
//   const {
//     modulesState,
//     menteesState,
//     selectedMenteeId,
//     setSelectedMenteeId,
//     loadMentees,
//     buildPath,
//     basePath,
//   } = useAcademyContext();

//   const autoSelectRef = useRef(false);
//   const isMentor = (role || "").toLowerCase() === "mentor";
//   const isAdmin = (role || "").toLowerCase() === "admin";

//   useEffect(() => {
//     if ((isMentor || isAdmin) && menteesState.status === "idle") {
//       loadMentees();
//     }
//   }, [isMentor, isAdmin, loadMentees, menteesState.status]);

//   useEffect(() => {
//     if (
//       (isMentor || isAdmin) &&
//       menteesState.status === "success" &&
//       menteesState.data.length > 0 &&
//       !autoSelectRef.current
//     ) {
//       if (!selectedMenteeId) {
//         setSelectedMenteeId(menteesState.data[0].id);
//         autoSelectRef.current = true;
//       }
//     }
//   }, [isMentor, isAdmin, menteesState, selectedMenteeId, setSelectedMenteeId]);

//   const handleOverviewNav = () => {
//     navigate(buildPath("overview"));
//   };

//   const modules = Array.isArray(modulesState.data) ? modulesState.data : [];
//   const workbookPath = modules.length ? buildPath("workbook", modules[0].id) : buildPath("overview");
//   const registryPath = buildPath("registry");
//   const communityPath = buildPath("community");

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-tmIvory via-white to-tmIvory py-section">
//       <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 sm:px-8 lg:px-0">
//         <header className="rounded-[3rem] border border-mauve/25 bg-white/85 px-6 py-8 shadow-soft backdrop-blur-sm sm:px-10">
//           <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//             <div>
//               <p className="inline-flex items-center gap-2 rounded-full border border-tmMauve/30 bg-tmMauve/10 px-4 py-1 text-[0.7rem] font-heading uppercase tracking-[0.32em] text-tmMauve">
//                 <GraduationCap className="h-3.5 w-3.5 shrink-0" aria-hidden />
//                 Taylor-Made Baby Academy
//               </p>
//               <h1 className="mt-3 font-heading text-3xl text-charcoal sm:text-4xl">
//                 Virtual Workbook &amp; Masterclass Syllabus
//               </h1>
//               <p className="mt-2 max-w-2xl text-sm font-body text-charcoal/70">
//                 Dive into guided modules, reflective journaling, and mentor insights crafted to keep your concierge journey
//                 polished and deeply personal.
//               </p>
//             </div>
//             <Button
//               type="button"
//               variant="secondary"
//               size="sm"
//               onClick={handleOverviewNav}
//               className="hidden md:inline-flex"
//             >
//               Overview
//             </Button>
//           </div>
//           {(isMentor || isAdmin) && (
//             <div className="mt-6 rounded-[2.5rem] border border-gold/30 bg-gold/10 px-4 py-4 shadow-soft">
//               <label className="flex flex-col gap-2 text-xs font-heading uppercase tracking-[0.28em] text-charcoal/60 sm:flex-row sm:items-center sm:gap-4">
//                 <span>Select mentee workspace</span>
//                 <select
//                   value={selectedMenteeId || ""}
//                   onChange={(event) => setSelectedMenteeId(event.target.value || null)}
//                   className="w-full rounded-full border border-gold/30 bg-white px-4 py-2 text-sm font-body text-charcoal shadow-soft transition focus:border-mauve focus:outline-none focus:ring-2 focus:ring-mauve/20 sm:w-auto"
//                 >
//                   <option value="">
//                     {isMentor ? "My mentor notebook" : "All mentees"}
//                   </option>
//                   {menteesState.data?.map((mentee) => (
//                     <option key={mentee.id} value={mentee.id}>
//                       {mentee.name} · {mentee.packageChoice || "Concierge"}
//                     </option>
//                   ))}
//                 </select>
//               </label>
//               {menteesState.status === "loading" && (
//                 <p className="mt-2 text-xs font-heading uppercase tracking-[0.28em] text-charcoal/40">
//                   Loading mentees…
//                 </p>
//               )}
//             </div>
//           )}
//       </header>

//         <nav className="flex flex-col gap-4 rounded-[2.5rem] border border-ivory/80 bg-white/90 p-4 shadow-soft backdrop-blur-sm md:flex-row md:items-center md:justify-between">
//           <div className="flex flex-wrap items-center gap-2">
//             <NavLink
//               to={buildPath("overview")}
//               className={({ isActive }) =>
//                 [
//                   "rounded-2xl px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] transition duration-150",
//                   isActive
//                     ? "bg-mauve/90 text-white shadow-soft"
//                     : "bg-ivory text-charcoal/70 hover:bg-ivory/80",
//                 ].join(" ")
//               }
//             >
//               Overview
//             </NavLink>
//             <NavLink
//               to={workbookPath}
//               className={({ isActive }) =>
//                 [
//                   "rounded-2xl px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] transition duration-150",
//                   location.pathname.startsWith(`${basePath}/workbook`)
//                     ? "bg-mauve/90 text-white shadow-soft"
//                     : "bg-ivory text-charcoal/70 hover:bg-ivory/80",
//                 ].join(" ")
//               }
//             >
//               Workbook
//             </NavLink>
//             <NavLink
//               to={registryPath}
//               className={({ isActive }) =>
//                 [
//                   "rounded-2xl px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] transition duration-150",
//                   location.pathname.startsWith(`${basePath}/registry`)
//                     ? "bg-mauve/90 text-white shadow-soft"
//                     : "bg-ivory text-charcoal/70 hover:bg-ivory/80",
//                 ].join(" ")
//               }
//             >
//               Registry
//             </NavLink>
//             <NavLink
//               to={communityPath}
//               className={({ isActive }) =>
//                 [
//                   "rounded-2xl px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] transition duration-150",
//                   location.pathname.startsWith(`${basePath}/community`)
//                     ? "bg-mauve/90 text-white shadow-soft"
//                     : "bg-ivory text-charcoal/70 hover:bg-ivory/80",
//                 ].join(" ")
//               }
//             >
//               Community
//             </NavLink>
//           </div>
//           <div className="flex flex-wrap items-center gap-2 text-[0.6rem] font-heading uppercase tracking-[0.32em] text-charcoal/50">
//             <LayoutDashboard className="h-3.5 w-3.5 shrink-0" aria-hidden />
//             <span>{user?.name ? `Logged in as ${user.name}` : "Welcome back"}</span>
//             <span aria-hidden>•</span>
//             <span>{modules.length} modules</span>
//           </div>
//         </nav>

//         <div className="flex flex-col gap-6 rounded-[3rem] border border-charcoal/10 bg-white/85 p-6 shadow-soft backdrop-blur-sm">
//           <div className="flex flex-wrap gap-3 overflow-x-auto">
//             {modules.map((module) => (
//               <NavLink
//                 key={module.id}
//                 to={buildPath("modules", module.id)}
//                 className={({ isActive }) =>
//                   [
//                     "flex items-center gap-3 rounded-2xl border px-4 py-2 text-sm font-body transition duration-150",
//                     isActive
//                       ? "border-mauve/60 bg-mauve/20 text-mauve"
//                       : "border-charcoal/10 bg-ivory/80 text-charcoal/70 hover:border-mauve/40 hover:bg-mauve/10 hover:text-mauve",
//                   ].join(" ")
//                 }
//               >
//                 <span className="text-xs font-heading uppercase tracking-[0.28em] text-mauve/80">
//                   {module.section}
//                 </span>
//                 <span>{module.title}</span>
//                 <span className="text-xs font-heading uppercase tracking-[0.28em] text-charcoal/40">
//                   {module.progress ?? 0}%
//                 </span>
//               </NavLink>
//             ))}
//             {!modules.length && modulesState.status === "loading" && (
//               <span className="rounded-full bg-ivory px-4 py-2 text-xs font-heading uppercase tracking-[0.28em] text-charcoal/40">
//                 Loading modules…
//               </span>
//             )}
//           </div>
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AcademyLayout;
