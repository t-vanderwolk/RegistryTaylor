import React, { createContext, useContext, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAcademy } from "../features";
import AcademyLayout from "./academy/AcademyLayout";
import AcademyOverview from "./academy/AcademyOverview";
import AcademyModuleDetail from "./academy/AcademyModuleDetail";
import AcademyWorkbook from "./academy/AcademyWorkbook";

const AcademyContext = createContext(null);

export const useAcademyContext = () => {
  const context = useContext(AcademyContext);
  if (!context) {
    throw new Error("useAcademyContext must be used within the Academy provider");
  }
  return context;
};

const Academy = () => {
  const academyState = useAcademy({ autoLoad: true });

  const contextValue = useMemo(
    () => ({
      modulesState: academyState.modulesState,
      moduleState: academyState.moduleState,
      moduleProgress: academyState.moduleProgress,
      menteesState: academyState.menteesState,
      isSaving: academyState.isSaving,
      selectedMenteeId: academyState.selectedMenteeId,
      setSelectedMenteeId: academyState.setSelectedMenteeId,
      loadModules: academyState.loadModules,
      loadModule: academyState.loadModule,
      loadMentees: academyState.loadMentees,
      saveWorkbookEntry: academyState.saveWorkbookEntry,
      updateMentorNotes: academyState.updateMentorNotes,
    }),
    [
      academyState.modulesState,
      academyState.moduleState,
      academyState.moduleProgress,
      academyState.menteesState,
      academyState.isSaving,
      academyState.selectedMenteeId,
      academyState.loadModules,
      academyState.loadModule,
      academyState.loadMentees,
      academyState.saveWorkbookEntry,
      academyState.updateMentorNotes,
    ]
  );

  return (
    <AcademyContext.Provider value={contextValue}>
      <Routes>
        <Route element={<AcademyLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<AcademyOverview />} />
          <Route path="modules" element={<Navigate to="overview" replace />} />
          <Route path="modules/:moduleId" element={<AcademyModuleDetail />} />
          <Route path="workbook" element={<Navigate to="overview" replace />} />
          <Route path="workbook/:moduleId" element={<AcademyWorkbook />} />
        </Route>
      </Routes>
    </AcademyContext.Provider>
  );
};

export default Academy;
