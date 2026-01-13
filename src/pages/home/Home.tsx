import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePageContext } from "../../context/usePageContext";

import HeroSection from "../../components/section/HeroSection";
import AboutSection from "../../components/section/AboutSection";
import TrainnerAbout from "../../components/section/TrainnerAbout";
import TestimonialsSection from "../../components/section/TestimonialsSection";
import CareerImpactSection from "../../components/section/CareerImpactSection";
import MaterialDownloadSection from "../../components/section/MaterialDownloadSection";
import TrustedCompaniesSection from "../../components/section/TrustedCompaniesSection";
import ContactSection from "../../components/section/ContactSection";
import CertificateSection from "../../components/section/CertificateSection";
import YoutubeSection from "../../components/section/YouTubePlaylistSection";
import DomainSlider from "../../components/section/DomainSlider";
import YoutubeShortSection from "../../components/section/YoutubeShortSection";

const Home: React.FC = () => {
  const { setDomainId, setCourseId } = usePageContext();
  const location = useLocation();

  /* 🔁 CONTEXT CLEANUP WHEN ROUTE IS "/" */
  useEffect(() => {
    if (location.pathname === "/") {
      setDomainId(null);
      setCourseId(null);
    }
  }, [location.pathname, setDomainId, setCourseId]);

  return (
    <div className="min-h-screen bg-white">
      <main>
        <HeroSection />
        <AboutSection />
        <TrainnerAbout />
        <DomainSlider />
        <TestimonialsSection />
        <CareerImpactSection />
        <MaterialDownloadSection />
        <TrustedCompaniesSection />
        <YoutubeSection />
        <YoutubeShortSection/>
        <CertificateSection />
        <ContactSection />
      </main>
    </div>
  );
};

export default Home;
