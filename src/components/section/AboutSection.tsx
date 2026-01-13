/* eslint-disable no-irregular-whitespace */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { usePageContext } from "../../context/usePageContext";
import { safeGet } from "../../util/safeGet";

/* ---------------- CONFIG ---------------- */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ---------------- TYPES ---------------- */
interface AboutData {
  label: string;
  heading: string;
  description1: string;
  description2?: string;
  mainImages: string[];
  smallImages: string[];
}

/* ---------------- COMPONENT ---------------- */
const AboutSection: React.FC = () => {
  const { domainId, courseId } = usePageContext();

  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const SLIDESHOW_INTERVAL = 4000;

  /* ---------------- FETCH ABOUT ---------------- */
  useEffect(() => {
    let mounted = true;

    const fetchAbout = async () => {
      let data = await safeGet<AboutData>(`${API_BASE_URL}/api/about`, {
        domainId: domainId ?? undefined,
        courseId: courseId ?? undefined,
      });

      if (!data) {
        data = await safeGet<AboutData>(`${API_BASE_URL}/api/about`, {
          domainId: 0,
          courseId: 0,
        });
      }

      if (mounted && data) {
        setAboutData({
          ...data,
          mainImages: Array.isArray(data.mainImages) ? data.mainImages : [],
        });
        setCurrentImageIndex(0);
      }
    };

    fetchAbout();
    return () => {
      mounted = false;
    };
  }, [domainId, courseId]);

  /* ---------------- SLIDESHOW ---------------- */
  useEffect(() => {
    if (!aboutData?.mainImages?.length) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(
        prev => (prev + 1) % aboutData.mainImages.length
      );
    }, SLIDESHOW_INTERVAL);

    return () => clearInterval(interval);
  }, [aboutData?.mainImages?.length]);

  /* ---------------- GUARD ---------------- */
  if (!aboutData) {
    return (
      <div className="py-24 text-center text-gray-400">
        About section coming soon
      </div>
    );
  }

  const { label, heading, description1, description2, mainImages } = aboutData;

  /* ---------------- ANIMATION VARIANTS ---------------- */

  const contentVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.9, ease: "easeOut" },
    },
  };

  /* Floating parallax motion */
  const floatVariants: Variants = {
    animate: (custom: number) => ({
      y: [0, -18, 0],
      x: [0, custom, 0],
      transition: {
        duration: 7 + Math.abs(custom),
        repeat: Infinity,
        ease: "easeInOut",
      },
    }),
  };

  /* Rotating glow ring */
  const rotateVariants: Variants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 40,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  /* Image cross-fade */
  const imageVariants: Variants = {
    initial: { opacity: 0, scale: 1.1 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.4, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 1.2, ease: "easeInOut" },
    },
  };

  /* ---------------- UI ---------------- */
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="relative w-full bg-white py-24 px-6 md:px-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <motion.div variants={contentVariants}>
          <div className="flex items-center gap-3 mb-6">
            <span className="h-[2px] w-12 bg-[#1BA97B]" />
            <span className="uppercase tracking-widest text-sm font-medium text-gray-500">
              {label}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl xl:text-5xl font-extrabold leading-tight text-[#0E2F25] mb-6">
            {heading}
          </h2>

          <p className="text-gray-600 text-base leading-relaxed mb-4">
            {description1}
          </p>

          {description2 && (
            <p className="text-gray-600 text-base leading-relaxed">
              {description2}
            </p>
          )}
        </motion.div>

        {/* RIGHT IMAGE COMPOSITION */}
        <div className="relative flex justify-center items-center">

          {/* Glow Aura */}
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[360px] h-[360px] md:w-[560px] md:h-[560px] bg-gradient-to-tr from-[#1BA97B] to-[#CFEDE4] rounded-full blur-3xl opacity-60"
          />

          {/* Rotating Ring */}
          <motion.div
            variants={rotateVariants}
            animate="animate"
            className="absolute w-[420px] h-[420px] md:w-[620px] md:h-[620px] border border-[#1BA97B]/30 rounded-full"
          />

          {/* Outer Circle */}
          <motion.div
            variants={floatVariants}
            custom={14}
            animate="animate"
            className="absolute w-[320px] h-[320px] md:w-[500px] md:h-[500px] bg-[#CFEDE4] rounded-full -translate-x-10"
          />

          {/* Inner Circle */}
          <motion.div
            variants={floatVariants}
            custom={-8}
            animate="animate"
            className="absolute w-[300px] h-[300px] md:w-[480px] md:h-[480px] bg-[#0E2F25] rounded-full translate-x-4 shadow-2xl"
          />

          {/* Main Image */}
          <motion.div
            variants={floatVariants}
            custom={0}
            animate="animate"
            className="relative w-[280px] h-[280px] md:w-[440px] md:h-[440px] rounded-full overflow-hidden z-10"
          >
            <AnimatePresence mode="wait">
              {mainImages.length > 0 && (
                <motion.img
                  key={currentImageIndex}
                  src={`${API_BASE_URL}${mainImages[currentImageIndex]}`}
                  alt="Greens Technologies"
                  className="absolute inset-0 w-full h-full object-cover"
                  variants={imageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                />
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
