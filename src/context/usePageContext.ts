import { useContext } from "react";
import { PageContext } from "./PageContext";

export const usePageContext = () => {
  const context = useContext(PageContext);

  if (!context) {
    throw new Error("usePageContext must be used inside PageProvider");
  }

  return context;
};
