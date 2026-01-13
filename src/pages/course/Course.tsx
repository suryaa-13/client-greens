import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePageContext } from "../../context/usePageContext";

import HeroSection from "../../components/section/HeroSection";
import EnrollSection from "../../components/section/EnrollSection";
import SuccessStoriesSection from "../../components/section/SuccessStoriesSection";
import CareerImpactSection from "../../components/section/CareerImpactSection";
// import TrainerSection from "../../components/section/TrainerSection";
import TechStackSection from "../../components/section/TechStackSection";
import ProjectsSection from "../../components/section/ProjectsSection";
import TrustedCompaniesSection from "../../components/section/TrustedCompaniesSection";
import CertificateSection from "../../components/section/CertificateSection";
import TestimonialsSection from "../../components/section/TestimonialsSection";
import AboutSection from "../../components/section/AboutSection";
import ContactSection from "../../components/section/ContactSection";
import ModulesSection from "../../components/section/ModulesSection";
import YoutubeSection from "../../components/section/YouTubePlaylistSection";

const Course: React.FC = () => {
  const navigate = useNavigate();
  const { domainId: domainIdFromUrl, courseId: courseIdFromUrl } = useParams();

  const {
    domainId,
    courseId,
    setDomainId,
    setCourseId,
  } = usePageContext();

  /* 🔁 SYNC URL → CONTEXT */
  useEffect(() => {
    if (!domainIdFromUrl || !courseIdFromUrl) {
      navigate("/");
      return;
    }

    const parsedDomainId = Number(domainIdFromUrl);
    const parsedCourseId = Number(courseIdFromUrl);

    if (Number.isNaN(parsedDomainId) || Number.isNaN(parsedCourseId)) {
      navigate("/");
      return;
    }

    if (domainId !== parsedDomainId) {
      setDomainId(parsedDomainId);
    }

    if (courseId !== parsedCourseId) {
      setCourseId(parsedCourseId);
    }
  }, [
    domainIdFromUrl,
    courseIdFromUrl,
    domainId,
    courseId,
    navigate,
    setDomainId,
    setCourseId,
  ]);

  if (!domainIdFromUrl || !courseIdFromUrl) return null;

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* COURSE-SPECIFIC HERO */}
        <HeroSection />
        <EnrollSection />
        <SuccessStoriesSection />
        <CareerImpactSection />
        <TechStackSection />
        <ModulesSection/>
        <ProjectsSection />
        <TrustedCompaniesSection />
        <CertificateSection />
        <TestimonialsSection />
         <YoutubeSection />
        <AboutSection />
        <ContactSection />
      </main>
    </div>
  );
};

export default Course;
