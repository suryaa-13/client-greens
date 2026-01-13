import { createContext } from "react";

/* ---------------- TYPES ---------------- */
export type PageContextType = {
  domainId: number | null;
  courseId: number | null;
  setDomainId: (id: number | null) => void;
  setCourseId: (id: number | null) => void;
};

/* ---------------- CONTEXT ---------------- */
export const PageContext = createContext<PageContextType | undefined>(
  undefined
);
