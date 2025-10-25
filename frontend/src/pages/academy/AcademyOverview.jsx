// import React, { useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAcademyContext } from "../Academy";
// import { motion } from "framer-motion";
// import Button from "../../design-system/Button";
// import { ArrowRight, BookOpen } from "lucide-react";

// const AcademyOverview = () => {
//   const navigate = useNavigate();
//   const { modulesState, buildPath } = useAcademyContext();

//   const modules = useMemo(() => (Array.isArray(modulesState.data) ? modulesState.data : []), [modulesState.data]);

//   if (modulesState.status === "loading" && !modules.length) {
//     return (
//       <div
//         className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-tmMauve/20 bg-white/70 px-6 py-16 text-center text-sm font-body text-charcoal/60 shadow-soft"
//         role="status"
//       >
//         <span className="h-12 w-12 animate-spin rounded-full border-2 border-tmMauve/10 border-t-transparent" />
//         Loading academy modules…
//       </div>
//     );
//   }

//   if (modulesState.status === "error") {
//     return (
//       <div className="rounded-[2rem] border border-red-200 bg-red-50/80 px-6 py-8 text-center text-sm font-body text-red-500">
//         {modulesState.error || "We were unable to load the academy at this time. Please try again shortly."}
//       </div>
//     );
//   }

//   return (
//     <section className="space-y-10" aria-label="Academy overview">
//       <header className="space-y-3">
//         <p className="inline-flex items-center gap-2 rounded-full border border-tmMauve/25 bg-tmMauve/10 px-4 py-1 text-[0.7rem] font-heading uppercase tracking-[0.32em] text-tmMauve">
//           <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden />
//           Taylor-Made Academy
//         </p>
//         <h2 className="max-w-2xl font-heading text-2xl text-tmCharcoal sm:text-3xl">
//           Choose your next Taylor-Made experience
//         </h2>
//         <p className="max-w-3xl text-sm font-body text-charcoal/70">
//           Each module includes an immersive masterclass paired with a concierge workbook. Track your reflections, share
//           entries with your mentor, and revisit anytime for refreshed guidance.
//         </p>
//       </header>

//       <section className="space-y-6" aria-label="Available modules">
//         {modules.map((module, index) => (
//           <motion.article
//             key={module.id}
//             initial={{ opacity: 0, y: 24 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
//             className="space-y-4 rounded-2xl border border-tmIvory/70 bg-white/85 p-6 shadow-soft backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-dreamy focus-within:ring-2 focus-within:ring-tmMauve/40"
//           >
//             <header className="space-y-1">
//               <p className="text-[0.7rem] font-heading uppercase tracking-[0.32em] text-mauve/70">
//                 {module.section}
//               </p>
//               <h2 className="text-xl font-serif text-mauve">{module.title}</h2>
//               {module.introduction && (
//                 <p className="text-sm font-body italic text-charcoal/70">{module.introduction}</p>
//               )}
//             </header>
//             <footer className="flex flex-wrap items-center justify-between gap-3">
//               <Button
//                 type="button"
//                 variant="primary"
//                 size="sm"
//                 onClick={() => navigate(buildPath("modules", module.id))}
//                 className="w-full sm:w-auto"
//               >
//                 Open Module
//                 <ArrowRight className="ml-2 h-3 w-3 shrink-0" aria-hidden />
//               </Button>
//               <span className="text-[0.65rem] font-heading uppercase tracking-[0.32em] text-charcoal/50">
//                 {module.completedPrompts ?? 0}/{module.totalPrompts ?? 0} reflections · {module.progress ?? 0}%
//               </span>
//             </footer>
//           </motion.article>
//         ))}
//       </section>

//       {!modules.length && (
//         <p className="rounded-[2rem] border border-ivory/80 bg-ivory/60 px-4 py-8 text-center text-sm font-body text-charcoal/60">
//           No modules available yet. Check back soon for new masterclasses tailored to your family.
//         </p>
//       )}
//     </section>
//   );
// };

// export default AcademyOverview;
