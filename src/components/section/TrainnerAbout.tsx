/* eslint-disable no-irregular-whitespace */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Globe } from "lucide-react";
import { usePageContext } from "../../context/usePageContext";
import axios from "axios";

/* ---------------- CONFIG ---------------- */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ---------------- COLORS ---------------- */
const COLORS = {
  darkGreen: "#01311F",
  gold: "#B99A49",
  cream: "#F0ECE3",
  white: "#FFFFFF",
};

/* ---------------- TYPES ---------------- */
interface SocialLink {
  platform: string;
  url: string;
}

interface TrainerAboutData {
  label: string;
  heading: string;
  description1: string;
  description2?: string;
  mainImage: string;
  socialLinks: SocialLink[];
}

/* ---------------- COMPONENT ---------------- */
const TrainerAbout: React.FC = () => {
  const { domainId, courseId } = usePageContext();
  const [data, setData] = useState<TrainerAboutData | null>(null);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/trainer-about`, {
          params: {
            domainId: domainId ?? 0,
            courseId: courseId ?? 0,
          },
        });

        if (mounted) setData(res.data);
      } catch {
        setData(null);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [domainId, courseId]);

  if (!data) return null;

  /* ---------------- ANIMATIONS ---------------- */
  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
  };

  /* ---------------- UI ---------------- */
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full py-20 px-4 md:px-20"
      style={{ backgroundColor: COLORS.white }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <motion.div variants={contentVariants}>
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-10" style={{ background: COLORS.gold }} />
            <span className="text-sm uppercase tracking-wider text-gray-500">
              {data.label}
            </span>
          </div>

          <h2
            className="text-3xl md:text-4xl font-bold mb-6 leading-snug"
            style={{ color: COLORS.darkGreen }}
          >
            {data.heading}
          </h2>

          <p className="text-gray-600 mb-4">{data.description1}</p>
          {data.description2 && (
            <p className="text-gray-600 mb-6">{data.description2}</p>
          )}

          {/* SOCIAL / WEBSITE LINK */}
{data.socialLinks?.length > 0 && (
  <div className="flex gap-4 mt-6">
    {data.socialLinks.map((link, i) => (
      <div key={i} className="relative group">
        {/* ICON */}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-full flex items-center justify-center shadow-md transition hover:scale-110"
          style={{
            backgroundColor: COLORS.gold,
            color: COLORS.darkGreen,
          }}
        >
          <Globe size={20} />
        </a>

        {/* HOVER PLACEHOLDER / TOOLTIP */}
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 
                     whitespace-nowrap px-3 py-1 rounded-md text-xs font-semibold
                     opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100
                     transition-all duration-200 pointer-events-none shadow-lg"
          style={{
            backgroundColor: COLORS.darkGreen,
            color: COLORS.gold,
          }}
        >
          {link.platform
            ? link.platform.charAt(0).toUpperCase() + link.platform.slice(1)
            : "Website"}
        </div>
      </div>
    ))}
  </div>
)}

        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          variants={imageVariants}
          className="relative rounded-2xl overflow-hidden shadow-xl"
        >
          <img
            src={`${API_BASE_URL}${data.mainImage}`}
            alt="Trainer"
            className="w-full h-[450px] md:h-[550px] object-cover"
          />

          {/* VERIFIED BADGE */}
          <div
            className="absolute bottom-6 right-6 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg"
            style={{
              backgroundColor: COLORS.darkGreen,
              color: COLORS.gold,
            }}
          >
            <Globe size={16} />
            Official Profile
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TrainerAbout;
