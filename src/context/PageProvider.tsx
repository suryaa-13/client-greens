import React, { useState } from "react";
import { PageContext } from "./PageContext";

export const PageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [domainId, setDomainId] = useState<number | null>(null);
  const [courseId, setCourseId] = useState<number | null>(null);

  return (
    <PageContext.Provider
      value={{ domainId, courseId, setDomainId, setCourseId }}
    >
      {children}
    </PageContext.Provider>
  );
};
