// import React, { Suspense, lazy } from "react";
// import { useAuth } from "../../context/AuthContext";

// const RegistryTab = lazy(() => import("../../components/RegistryTab"));

// const AcademyRegistry = () => {
//   const { user } = useAuth();
//   const userId = user?.id || "user_demo";

//   return (
//     <Suspense
//       fallback={
//         <p className="rounded-[2rem] border border-tmMauve/20 bg-white/80 px-5 py-4 text-sm font-body text-charcoal/60">
//           Loading your registry...
//         </p>
//       }
//     >
//       <RegistryTab userId={userId} />
//     </Suspense>
//   );
// };

// export default AcademyRegistry;
