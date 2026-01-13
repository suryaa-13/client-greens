import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePageContext } from "../../context/usePageContext";

import HeroSection from "../../components/section/HeroSection";
import EnrollSection from "../../components/section/EnrollSection";
import SuccessStoriesSection from "../../components/section/SuccessStoriesSection";
import CareerImpactSection from "../../components/section/CareerImpactSection";
import TechStackSection from "../../components/section/TechStackSection";
import ProjectsSection from "../../components/section/ProjectsSection";
import TrustedCompaniesSection from "../../components/section/TrustedCompaniesSection";
import CertificateSection from "../../components/section/CertificateSection";
import TestimonialsSection from "../../components/section/TestimonialsSection";
import AboutSection from "../../components/section/AboutSection";
import ContactSection from "../../components/section/ContactSection";
import CourseSection from "../../components/section/CourseSection";
import MaterialDownloadSection from "../../components/section/MaterialDownloadSection";
import YoutubeSection from "../../components/section/YouTubePlaylistSection";

const Domain: React.FC = () => {
  const { domainId: domainIdFromUrl } = useParams();
  const navigate = useNavigate();
  const { domainId, setDomainId, setCourseId } = usePageContext();

  /* 🔁 SYNC URL → CONTEXT */
  useEffect(() => {
    if (!domainIdFromUrl) {
      navigate("/");
      return;
    }

    const parsedId = Number(domainIdFromUrl);

    if (Number.isNaN(parsedId)) {
      navigate("/");
      return;
    }

    if (domainId !== parsedId) {
      setDomainId(parsedId);
      setCourseId(0);
    }
  }, [domainIdFromUrl, domainId, navigate, setDomainId, setCourseId]);

  if (!domainIdFromUrl) return null;

  return (
    <div className="min-h-screen bg-white">
      <main>
        <HeroSection />
        <AboutSection />
        <SuccessStoriesSection />
        <CareerImpactSection />
        <CourseSection />
        <TechStackSection />
        <ProjectsSection />
        <TrustedCompaniesSection />
        <CertificateSection />
        <TestimonialsSection />
        <MaterialDownloadSection />  
        <YoutubeSection/>  
        <EnrollSection />
        <ContactSection />
      </main>
    </div>
  );
};

export default Domain;
