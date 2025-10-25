// import React, { Suspense, useEffect, useMemo, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useAcademyContext } from "../Academy";
// import { ProgressTracker } from "../../components/academy";
// import { useAuth } from "../../context/AuthContext";
// import Button from "../../design-system/Button";
// import { motion } from "framer-motion";
// import { ArrowLeft, NotebookPen } from "lucide-react";

// const LectureCarousel = React.lazy(() => import("../../components/academy/LectureCarousel"));
// const CommunityThread = React.lazy(() => import("../../components/CommunityThread"));

// const AcademyModuleDetail = () => {
//   const { moduleId } = useParams();
//   const navigate = useNavigate();
//   const { moduleState, moduleProgress, loadModule, buildPath } = useAcademyContext();
//   const { user } = useAuth();
//   const [communityOpen, setCommunityOpen] = useState(false);

//   useEffect(() => {
//     if (moduleId) {
//       loadModule(moduleId);
//     }
//   }, [moduleId, loadModule]);

//   const moduleData = moduleState?.data?.module || null;
//   const moduleSlug = moduleData?.slug || moduleData?.module_slug || (moduleData?.id ? String(moduleData.id) : "");
//   const lectureSlides = useMemo(() => {
//     const lectureContent = moduleData?.lecture || "";
//     return lectureContent.split(/\n\s*\n/).map((chunk) => chunk.trim()).filter(Boolean);
//   }, [moduleData?.lecture]);

//   const progress = moduleProgress || {
//     percent: moduleData?.progress ?? 0,
//     completedPrompts: moduleData?.completedPrompts ?? 0,
//     totalPrompts:
//       moduleData?.totalPrompts ??
//       ((Array.isArray(moduleData?.content?.reflect) ? moduleData.content.reflect.length : 0) +
//         (moduleData?.content?.journal_prompt ? 1 : 0)),
//   };

//   if (moduleState.status === "loading" && !moduleData) {
//     return (
//       <div className="flex flex-col items-center justify-center gap-4 py-16 text-center text-sm font-body text-charcoal/60">
//         <span className="text-2xl">⌛</span>
//         Loading module…
//       </div>
//     );
//   }

//   if (moduleState.status === "error") {
//     return (
//       <div className="rounded-[2rem] border border-red-200 bg-red-50/80 px-6 py-8 text-center text-sm font-body text-red-500">
//         {moduleState.error || "Unable to load this module right now."}
//       </div>
//     );
//   }

//   if (!moduleData) {
//     return (
//       <div className="rounded-[2rem] border border-ivory/80 bg-ivory/60 px-4 py-8 text-center text-sm font-body text-charcoal/60">
//         Module not found or unavailable for your current role.
//       </div>
//     );
//   }

//   const introductionCopy = moduleData.introduction || moduleData.content?.explore || "";
//   const segments = Array.isArray(moduleData.content?.segments) ? moduleData.content.segments : [];

//   return (
//     <article className="space-y-8">
//       <div className="flex items-center gap-3">
//         <Button
//           variant="secondary"
//           size="sm"
//           onClick={() => navigate(buildPath("overview"))}
//           aria-label="Back to academy overview"
//         >
//           <ArrowLeft className="mr-2 h-4 w-4 shrink-0" aria-hidden />
//           Back
//         </Button>
//         <span className="text-xs font-heading uppercase tracking-[0.32em] text-mauve/70">
//           {moduleData.section}
//         </span>
//       </div>

//       <header className="flex flex-col gap-6 rounded-2xl border border-tmIvory/70 bg-white/85 px-6 py-6 shadow-soft md:flex-row md:items-center md:justify-between">
//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4 }}
//         >
//           <h2 className="font-heading text-2xl text-charcoal sm:text-3xl">{moduleData.title}</h2>
//           {moduleData.content?.overview && (
//             <p className="mt-3 max-w-3xl text-sm font-body text-charcoal/70">{moduleData.content.overview}</p>
//           )}
//           {moduleData.content?.hero && (
//             <div className="mt-3 flex flex-wrap gap-3 text-[0.7rem] font-heading uppercase tracking-[0.28em] text-charcoal/50">
//               {moduleData.content.hero.duration && <span>Duration · {moduleData.content.hero.duration}</span>}
//               {moduleData.content.hero.format && <span>Format · {moduleData.content.hero.format}</span>}
//               {moduleData.content.hero.tone && <span>Tone · {moduleData.content.hero.tone}</span>}
//             </div>
//           )}
//         </motion.div>
//         <motion.div
//           className="flex flex-col items-center gap-3"
//           initial={{ opacity: 0, y: 24 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: 0.1 }}
//         >
//           <ProgressTracker value={progress.percent} label="Complete" />
//           <Button
//             type="button"
//             variant="primary"
//             size="sm"
//             onClick={() => navigate(buildPath("workbook", moduleData.id))}
//           >
//             Open Workbook
//             <NotebookPen className="ml-2 h-4 w-4 shrink-0" aria-hidden />
//           </Button>
//           <span className="text-[0.65rem] font-heading uppercase tracking-[0.28em] text-charcoal/50">
//             {progress.completedPrompts}/{progress.totalPrompts} prompts
//           </span>
//         </motion.div>
//       </header>

//       {moduleData.content?.objectives?.length > 0 && (
//         <motion.section
//           className="rounded-2xl border border-ivory/80 bg-ivory/60 px-6 py-5 shadow-soft"
//           initial={{ opacity: 0, y: 32 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: 0.08 }}
//         >
//           <h3 className="text-sm font-heading uppercase tracking-[0.32em] text-charcoal/70">Objectives</h3>
//           <ul className="mt-3 grid gap-3 sm:grid-cols-2">
//             {moduleData.content.objectives.map((objective) => (
//               <li key={objective} className="flex items-start gap-3 text-sm font-body text-charcoal/70">
//                 <span className="mt-1 h-1.5 w-1.5 rounded-full bg-mauve" aria-hidden />
//                 <span>{objective}</span>
//               </li>
//             ))}
//           </ul>
//         </motion.section>
//       )}

//       {introductionCopy && (
//         <motion.section
//           className="space-y-5 rounded-2xl border border-ivory/80 bg-ivory/60 px-6 py-5 shadow-soft"
//           initial={{ opacity: 0, y: 32 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: 0.12 }}
//         >
//           <div>
//             <h3 className="text-sm font-heading uppercase tracking-[0.32em] text-charcoal/70">Explore</h3>
//             <p className="mt-3 whitespace-pre-line text-sm font-body text-charcoal/70">{introductionCopy}</p>
//           </div>
//           {lectureSlides.length > 0 && (
//             <div className="space-y-3">
//               <h4 className="text-xs font-heading uppercase tracking-[0.32em] text-mauve/70">Lecture Highlights</h4>
//               <Suspense
//                 fallback={
//                   <div className="rounded-2xl border border-tmMauve/20 bg-white/60 p-6 shadow-soft">
//                     <div className="h-4 w-1/3 animate-pulse rounded-full bg-tmMauve/20" />
//                     <div className="mt-4 space-y-2">
//                       <div className="h-3 w-full animate-pulse rounded-full bg-tmMauve/10" />
//                       <div className="h-3 w-3/4 animate-pulse rounded-full bg-tmMauve/10" />
//                     </div>
//                   </div>
//                 }
//               >
//                 <LectureCarousel slides={lectureSlides} />
//               </Suspense>
//             </div>
//           )}
//         </motion.section>
//       )}

//       {segments.length > 0 && (
//         <motion.section
//           className="space-y-4"
//           initial={{ opacity: 0, y: 32 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: 0.16 }}
//         >
//           <h3 className="text-sm font-heading uppercase tracking-[0.32em] text-charcoal/70">Syllabus</h3>
//           <div className="grid gap-4 md:grid-cols-2">
//             {segments.map((segment) => (
//               <article
//                 key={segment.title}
//                 className="rounded-2xl border border-mauve/20 bg-white/80 px-5 py-4 shadow-soft transition hover:-translate-y-1 hover:shadow-dreamy"
//               >
//                 <p className="text-xs font-heading uppercase tracking-[0.3em] text-mauve/70">{segment.label}</p>
//                 <h4 className="mt-1 text-lg font-heading text-charcoal">{segment.title}</h4>
//                 <ul className="mt-3 space-y-2 text-sm font-body text-charcoal/70">
//                   {(segment.topics || []).map((topic) => (
//                     <li key={topic} className="flex items-start gap-2">
//                       <span className="mt-1 h-1 w-1 rounded-full bg-mauve" aria-hidden />
//                       <span>{topic}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </article>
//             ))}
//           </div>
//         </motion.section>
//       )}

//       {moduleSlug && (
//         <motion.section
//           className="rounded-2xl border border-ivory/80 bg-ivory/60 px-6 py-5 shadow-soft"
//           initial={{ opacity: 0, y: 32 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: 0.2 }}
//         >
//           <button
//             type="button"
//             onClick={() => setCommunityOpen((open) => !open)}
//             className="flex w-full items-center justify-between gap-3 rounded-2xl border border-tmMauve/25 bg-white/90 px-4 py-3 text-left text-sm font-heading uppercase tracking-[0.3em] text-tmMauve transition hover:border-tmMauve focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
//             aria-expanded={communityOpen}
//             aria-controls="community-thread-panel"
//           >
//             Ask the Community
//             <span className="text-xs font-body text-charcoal/50">{communityOpen ? "Hide" : "Show"}</span>
//           </button>
//           {communityOpen && (
//             <div id="community-thread-panel" className="mt-4">
//               <Suspense
//                 fallback={
//                   <p className="rounded-[2rem] border border-tmMauve/20 bg-white/80 px-5 py-4 text-sm font-body text-charcoal/60">
//                     Loading community insights…
//                   </p>
//                 }
//               >
//                 <CommunityThread moduleSlug={moduleSlug} userId={user?.id} />
//               </Suspense>
//             </div>
//           )}
//         </motion.section>
//       )}

//       <footer className="rounded-2xl border border-gold/20 bg-gold/10 px-6 py-5 text-sm font-body text-charcoal/70 shadow-soft">
//         Keep your concierge notebook active: reflections save automatically and your mentor can leave notes in-line to help
//         translate insights into action.
//       </footer>
//     </article>
//   );
// };

// export default AcademyModuleDetail;
