export type WorkbookSectionState = {
  text?: string;
  reflection?: string;
  checklist?: Record<string, boolean>;
  completed?: boolean;
};

export type WorkbookContent = {
  text?: string | null;
  sections: Record<string, WorkbookSectionState>;
  lastSavedAt?: string;
};

export type WorkbookEntry = {
  id: string;
  memberId: string;
  moduleSlug: string;
  content: WorkbookContent | null;
  shared: boolean;
  createdAt: string;
  updatedAt: string;
};
