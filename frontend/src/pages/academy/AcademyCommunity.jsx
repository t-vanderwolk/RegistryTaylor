// import React, { Suspense, lazy, useMemo } from "react";
// import { useAcademyContext } from "../Academy";
// import { useAuth } from "../../context/AuthContext";

// const CommunityThread = lazy(() => import("../../components/CommunityThread"));

// const AcademyCommunity = () => {
//   const { modulesState } = useAcademyContext();
//   const { user } = useAuth();
//   const moduleOptions = useMemo(() => {
//     if (!Array.isArray(modulesState.data)) return [];
//     return modulesState.data
//       .map((module) => ({
//         slug: module.slug || module.id,
//         title: module.title,
//       }))
//       .filter((option) => option.slug);
//   }, [modulesState.data]);

//   const initialSlug = moduleOptions[0]?.slug || "nursery-vision-foundations";

//   return (
//     <div className="space-y-6 rounded-[2.5rem] border border-charcoal/10 bg-white/90 p-6 shadow-soft backdrop-blur-sm">
//       <Suspense
//         fallback={
//           <p className="rounded-[2rem] border border-tmMauve/20 bg-white/80 px-5 py-4 text-sm font-body text-charcoal/60">
//             Gathering community threads...
//           </p>
//         }
//       >
//         <CommunityThread
//           moduleSlug={initialSlug}
//           moduleOptions={moduleOptions}
//           allowModuleFilter
//           userId={user?.id}
//         />
//       </Suspense>
//     </div>
//   );
// };

// export default AcademyCommunity;
