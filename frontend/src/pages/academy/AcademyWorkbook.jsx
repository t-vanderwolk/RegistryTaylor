// import React, { useCallback, useEffect, useMemo } from "react";
// import { useParams } from "react-router-dom";
// import { WorkbookPage } from "../../components/academy";
// import { useAcademyContext } from "../Academy";
// import { useAuth } from "../../context/AuthContext";

// const AcademyWorkbook = () => {
//   const { moduleId } = useParams();
//   const { role } = useAuth();
//   const {
//     moduleState,
//     moduleProgress,
//     loadModule,
//     saveWorkbookEntry,
//     updateMentorNotes,
//     isSaving,
//     menteesState,
//     selectedMenteeId,
//   } = useAcademyContext();

//   const mentorMode = ["mentor", "admin"].includes((role || "").toLowerCase());

//   useEffect(() => {
//     if (moduleId) {
//       loadModule(moduleId);
//     }
//   }, [moduleId, loadModule]);

//   const moduleData = moduleState?.data?.module || null;
//   const entry = moduleState?.data?.entry || null;
//   const progress = moduleState?.data?.progress || moduleProgress;

//   const menteeName = useMemo(() => {
//     if (!mentorMode || !selectedMenteeId) return "";
//     const list = menteesState?.data || [];
//     const match = list.find((item) => item.id === selectedMenteeId);
//     return match?.name || "";
//   }, [mentorMode, menteesState?.data, selectedMenteeId]);

//   const handleSave = useCallback(
//     (payload) => saveWorkbookEntry(payload),
//     [saveWorkbookEntry]
//   );

//   const handleMentorNotes = useCallback(
//     (entryId, mentorNotes) =>
//       updateMentorNotes({ entryId, mentorNotes }),
//     [updateMentorNotes]
//   );

//   if (moduleState.status === "loading" && !moduleData) {
//     return (
//       <div className="flex flex-col items-center justify-center gap-4 py-16 text-center text-sm font-body text-charcoal/60">
//         <span className="text-2xl">⌛</span>
//         Loading workbook…
//       </div>
//     );
//   }

//   if (moduleState.status === "error") {
//     return (
//       <div className="rounded-[2rem] border border-red-200 bg-red-50/80 px-6 py-8 text-center text-sm font-body text-red-500">
//         {moduleState.error || "We’re unable to load this workbook right now."}
//       </div>
//     );
//   }

//   if (!moduleData) {
//     return (
//       <div className="rounded-[2rem] border border-ivory/80 bg-ivory/60 px-4 py-8 text-center text-sm font-body text-charcoal/60">
//         Workbook unavailable. Choose another module from the navigation above.
//       </div>
//     );
//   }

//   return (
//     <WorkbookPage
//       module={moduleData}
//       entry={entry}
//       onSave={handleSave}
//       isSaving={isSaving}
//       mentorMode={mentorMode}
//       onMentorNotes={mentorMode ? handleMentorNotes : undefined}
//       menteeName={mentorMode ? menteeName : ""}
//       progress={progress}
//     />
//   );
// };

// export default AcademyWorkbook;
