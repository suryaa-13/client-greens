/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { usePageContext } from "../../context/usePageContext";

/* -------------------- CONFIG -------------------- */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ---------------- COLORS ---------------- */
const COLORS = {
  darkGreen: "#01311F",
  gold: "#B99A49",
  cream: "#F0ECE3",
};

/* -------------------- TYPES -------------------- */
interface DomainSlide {
  id: number;
  domainId: number;
  courseId: number;
  domain: string;
  title: string;
  subtitle: string;
  price: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
}

/* -------------------- COMPONENT -------------------- */
const DomainSection: React.FC = () => {
  const { setDomainId, setCourseId } = usePageContext();
  const navigate = useNavigate();

  const [domainSlides, setDomainSlides] = useState<DomainSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInlineVideo, setShowInlineVideo] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const TRANSITION_DURATION = 0.8;
  const VIDEO_DELAY = 3000; // ⏱️ 3 seconds

  /* ---------------- FETCH DOMAINS ---------------- */
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/domain`);

        const slides: DomainSlide[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        setDomainSlides(slides.filter((d) => d.isActive));
        setCurrentIndex(0);
      } catch (error) {
        console.error("Failed to load domains", error);
        setDomainSlides([]);
      }
    };

    fetchDomains();
  }, []);

  /* ---------------- AUTO PLAY VIDEO AFTER DELAY ---------------- */
  useEffect(() => {
    setShowInlineVideo(false);

    const timer = setTimeout(() => {
      setShowInlineVideo(true);
    }, VIDEO_DELAY);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  /* ---------------- GUARD ---------------- */
  if (!domainSlides.length) return null;

  const currentSlide = domainSlides[currentIndex];

  /* ---------------- HELPERS ---------------- */
  const getImageUrl = (path: string) => `${API_BASE_URL}${path}`;

  const getYoutubeEmbed = (url: string) => {
    const id =
      url?.split("v=")[1]?.split("&")[0] ||
      url?.split("youtu.be/")[1];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
  };

  /* ---------------- HANDLERS ---------------- */
  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % domainSlides.length);

  const prevSlide = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? domainSlides.length - 1 : prev - 1
    );

  const handleDomainSelect = () => {
    setDomainId(currentSlide.domainId);
    setCourseId(currentSlide.courseId ?? 0);
    navigate(`/domain/${currentSlide.domainId}`);
   
    
    
  };
  /* ---------------- TOUCH SWIPE ---------------- */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    touchStartX.current = null;
  };

  /* ---------------- ANIMATIONS ---------------- */
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
  };

  const imageVariants: Variants = {
    initial: { opacity: 0, scale: 1.05 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: TRANSITION_DURATION },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: TRANSITION_DURATION },
    },
  };

  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  /* ---------------- UI ---------------- */
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full bg-[#F9F7F2] py-24 px-4 md:px-20"
    >
      <motion.div
        variants={containerVariants}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
      >
        {/* LEFT - IMAGE / VIDEO */}
        <div
          className="relative flex justify-center md:justify-start"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="rounded-2xl overflow-hidden shadow-2xl w-full h-[450px] md:h-[550px] relative bg-black cursor-pointer"
            onClick={handleDomainSelect}
          >
            <AnimatePresence mode="wait">
              {!showInlineVideo ? (
                <motion.img
                  key="thumbnail"
                  src={getImageUrl(currentSlide.thumbnailUrl)}
                  alt={currentSlide.domain}
                  loading="lazy"
                  className="w-full h-full object-cover absolute"
                  variants={imageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                />
              ) : (
                <motion.iframe
                  key="video"
                  src={getYoutubeEmbed(currentSlide.videoUrl)}
                  className="w-full h-full absolute"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  variants={imageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                />
              )}
            </AnimatePresence>

            {/* Pagination */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
              {domainSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-white w-8"
                      : "bg-white/50 w-2"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT - CONTENT */}
        <motion.div variants={contentVariants}>
          <h2 className="text-3xl md:text-5xl font-bold text-[#01311F] mb-4">
            {currentSlide.title}
          </h2>

          <p className="text-[#B99A49] mb-6">
            {currentSlide.subtitle}
          </p>

          <p className="text-gray-600 mb-8">
            {currentSlide.description}
          </p>

          <div className="flex items-center gap-8 mb-10">
            <span className="text-2xl font-bold text-[#01311F]">
              peoples:{" "}
              <span style={{ color: COLORS.gold }}>
                {currentSlide.price}
              </span>{" "}
              have chosen this Domain
            </span>

            <button
              onClick={handleDomainSelect}
              className="px-8 py-3 bg-[#01311F] text-white rounded-md hover:bg-[#B99A49] transition-all"
            >
              View Courses
            </button>
          </div>

          {/* NAV */}
          <div className="flex space-x-4">
            <button onClick={prevSlide}>
              <ChevronLeft />
            </button>
            <button onClick={nextSlide}>
              <ChevronRight />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default DomainSection;
