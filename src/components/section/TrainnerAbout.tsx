/* eslint-disable no-irregular-whitespace */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { usePageContext } from "../../context/usePageContext";
import { safeGet } from "../../util/safeGet";

/* ---------------- CONFIG ---------------- */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ---------------- TYPES ---------------- */
interface TrainerAboutData {
  label: string;
  heading: string;
  description1: string;
  description2?: string;
  mainImages: string[];
  smallImages: string[];
}

/* ---------------- COMPONENT ---------------- */
const TrainnerAbout: React.FC = () => {
  const { domainId, courseId } = usePageContext();

  const [data, setData] = useState<TrainerAboutData | null>(null);
  const [currentMainImageIndex, setCurrentMainImageIndex] = useState(0);
  const [currentSmallImageIndex, setCurrentSmallImageIndex] = useState(0);

  const SLIDESHOW_INTERVAL = 4000;
  const TRANSITION_DURATION = 0.8;

  /* ---------------- FETCH TRAINER ABOUT (SAFE) ---------------- */
  useEffect(() => {
    let mounted = true;

    const fetchTrainerAbout = async () => {
      let result = await safeGet<TrainerAboutData>(
        `${API_BASE_URL}/api/trainer-about`,
        {
          domainId: domainId ?? undefined,
          courseId: courseId ?? undefined,
        }
      );

      if (!result) {
        result = await safeGet<TrainerAboutData>(
          `${API_BASE_URL}/api/trainer-about`,
          { domainId: 0, courseId: 0 }
        );
      }

      if (mounted && result) {
        setData({
          ...result,
          mainImages: Array.isArray(result.mainImages)
            ? result.mainImages
            : [],
          smallImages: Array.isArray(result.smallImages)
            ? result.smallImages
            : [],
        });
        setCurrentMainImageIndex(0);
        setCurrentSmallImageIndex(0);
      }
    };

    fetchTrainerAbout();
    return () => {
      mounted = false;
    };
  }, [domainId, courseId]);

  /* ---------------- SAFE FLAGS ---------------- */
  const hasMainImages =
    Array.isArray(data?.mainImages) && data.mainImages.length > 0;

  const hasSmallImages =
    Array.isArray(data?.smallImages) && data.smallImages.length > 0;

  /* ---------------- SLIDESHOW EFFECTS ---------------- */
  useEffect(() => {
    if (!hasMainImages || !data) return;

    const interval = setInterval(() => {
      setCurrentMainImageIndex(
        (prev) => (prev + 1) % data.mainImages.length
      );
    }, SLIDESHOW_INTERVAL);

    return () => clearInterval(interval);
  }, [hasMainImages, data?.mainImages.length]);

  useEffect(() => {
    if (!hasSmallImages || !data) return;

    const interval = setInterval(() => {
      setCurrentSmallImageIndex(
        (prev) => (prev + 1) % data.smallImages.length
      );
    }, SLIDESHOW_INTERVAL + 1000);

    return () => clearInterval(interval);
  }, [hasSmallImages, data?.smallImages.length]);

  /* ---------------- GUARD ---------------- */
  if (!data) return null;

  const {
    label,
    heading,
    description1,
    description2,
    mainImages,
    smallImages,
  } = data;

  /* ---------------- ANIMATIONS ---------------- */
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
  };

  const imageContainerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, x: -50 },
    visible: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.8 } },
  };

  const imageVariants: Variants = {
    initial: { opacity: 0, scale: 1.1 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: TRANSITION_DURATION },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: TRANSITION_DURATION },
    },
  };

  const smallImageVariants: Variants = {
    initial: { opacity: 0, scale: 0.95, rotate: -5 },
    animate: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: TRANSITION_DURATION },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      rotate: 5,
      transition: { duration: TRANSITION_DURATION },
    },
    hover: { scale: 1.05, rotate: 2, transition: { duration: 0.3 } },
  };

  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  /* ---------------- UI ---------------- */
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full bg-white py-20 px-4 md:px-20"
    >
      <motion.div
        variants={containerVariants}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
      >
        {/* LEFT - CONTENT */}
        <motion.div variants={contentVariants}>
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-10 bg-[#B99A49]" />
            <span className="text-sm uppercase tracking-wider text-gray-500">
              {label}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-[#01311F] mb-6 leading-snug">
            {heading}
          </h2>

          <p className="text-gray-600 mb-4">{description1}</p>
          {description2 && <p className="text-gray-600">{description2}</p>}
        </motion.div>

        {/* RIGHT - IMAGES */}
        <div className="relative flex justify-center md:justify-start">
          {/* MAIN IMAGE */}
          <motion.div
            variants={imageContainerVariants}
            className="rounded-2xl overflow-hidden shadow-lg w-full h-[500px] md:h-[600px] relative"
          >
            {hasMainImages ? (
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentMainImageIndex}
                  src={`${API_BASE_URL}${mainImages[currentMainImageIndex]}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  variants={imageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                />
              </AnimatePresence>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Image coming soon
              </div>
            )}
          </motion.div>

          {/* SMALL IMAGE */}
          {hasSmallImages && (
            <motion.div
              variants={smallImageVariants}
              whileHover="hover"
              className="absolute bottom-[-50px] right-[-50px] z-10 rounded-xl overflow-hidden shadow-lg w-[120px] h-[100px] md:w-[200px] md:h-[150px] hidden md:block"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSmallImageIndex}
                  src={`${API_BASE_URL}${smallImages[currentSmallImageIndex]}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  variants={smallImageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                />
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default TrainnerAbout;
