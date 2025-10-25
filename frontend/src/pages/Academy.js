// import React, { createContext, useContext, useMemo, useCallback } from "react";
// import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// import { useAcademy } from "../features";
// import AcademyLayout from "./academy/AcademyLayout";
// import AcademyOverview from "./academy/AcademyOverview";
// import AcademyModuleDetail from "./academy/AcademyModuleDetail";
// import AcademyWorkbook from "./academy/AcademyWorkbook";
// import AcademyRegistry from "./academy/AcademyRegistry";
// import AcademyCommunity from "./academy/AcademyCommunity";

// const AcademyContext = createContext(null);

// export const useAcademyContext = () => {
//   const context = useContext(AcademyContext);
//   if (!context) {
//     throw new Error("useAcademyContext must be used within the Academy provider");
//   }
//   return context;
// };

// const Academy = () => {
//   const location = useLocation();

//   const basePath = useMemo(() => {
//     const pathname = location.pathname || "/academy";
//     const normalized = pathname.toLowerCase();
//     const marker = "/academy";
//     const index = normalized.indexOf(marker);
//     if (index === -1) {
//       return "/academy";
//     }
//     const prefix = pathname.slice(0, index);
//     const candidate = `${prefix}${marker}`.replace(/\/+$/, "");
//     return candidate || "/academy";
//   }, [location.pathname]);

//   const buildPath = useCallback(
//     (...segments) => {
//       const cleanedSegments = segments
//         .filter((segment) => segment !== undefined && segment !== null)
//         .map((segment) => String(segment).replace(/^\/+|\/+$/g, ""))
//         .filter((segment) => segment.length > 0);
//       const base = basePath.replace(/\/+$/, "") || "/academy";
//       if (!cleanedSegments.length) {
//         return base;
//       }
//       return `${base}/${cleanedSegments.join("/")}`;
//     },
//     [basePath]
//   );

//   const academyState = useAcademy({ autoLoad: true });

//   const contextValue = useMemo(
//     () => ({
//       basePath,
//       buildPath,
//       modulesState: academyState.modulesState,
//       moduleState: academyState.moduleState,
//       moduleProgress: academyState.moduleProgress,
//       menteesState: academyState.menteesState,
//       isSaving: academyState.isSaving,
//       selectedMenteeId: academyState.selectedMenteeId,
//       setSelectedMenteeId: academyState.setSelectedMenteeId,
//       loadModules: academyState.loadModules,
//       loadModule: academyState.loadModule,
//       loadMentees: academyState.loadMentees,
//       saveWorkbookEntry: academyState.saveWorkbookEntry,
//       updateMentorNotes: academyState.updateMentorNotes,
//     }),
//     [
//       basePath,
//       buildPath,
//       academyState.modulesState,
//       academyState.moduleState,
//       academyState.moduleProgress,
//       academyState.menteesState,
//       academyState.isSaving,
//       academyState.selectedMenteeId,
//       academyState.loadModules,
//       academyState.loadModule,
//       academyState.loadMentees,
//       academyState.saveWorkbookEntry,
//       academyState.updateMentorNotes,
//     ]
//   );

//   return (
//     <AcademyContext.Provider value={contextValue}>
//       <Routes>
//         <Route element={<AcademyLayout />}>
//           <Route index element={<Navigate to="overview" replace />} />
//           <Route path="overview" element={<AcademyOverview />} />
//           <Route path="modules" element={<Navigate to="overview" replace />} />
//           <Route path="modules/:moduleId" element={<AcademyModuleDetail />} />
//           <Route path="workbook" element={<Navigate to="overview" replace />} />
//           <Route path="workbook/:moduleId" element={<AcademyWorkbook />} />
//           <Route path="registry" element={<AcademyRegistry />} />
//           <Route path="community" element={<AcademyCommunity />} />
//         </Route>
//       </Routes>
//     </AcademyContext.Provider>
//   );
// };

// export default Academy;
