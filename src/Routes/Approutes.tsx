import { Routes, Route } from "react-router-dom";

import { MainLayout } from "../layout/MainLayout";

import Home from "../pages/home/Home";
import Domain from "../pages/Domain/Domain";
import Course from "../pages/course/Course";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ✅ LAYOUT ROUTE */}
      <Route element={<MainLayout />}>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* DOMAIN */}
        <Route path="/domain/:domainId" element={<Domain />} />

        {/* COURSE */}
        <Route
          path="/domain/:domainId/course/:courseId"
          element={<Course />}
        />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
