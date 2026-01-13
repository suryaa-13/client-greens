import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePageContext } from "../../context/usePageContext";
import { safeGet } from "../../util/safeGet";

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
interface CareerImpactData {
  mainTitle: string;
  mainDescription: string;
  ctaText: string;
  ctaLink: string;
  card1Title: string;
  card1Description: string;
  card2Title: string;
  card2Description: string;
}

/* ---------------- COMPONENT ---------------- */
const CareerImpactSection: React.FC = () => {
  const { domainId, courseId } = usePageContext();
  const [data, setData] = useState<CareerImpactData | null>(null);

  /* ---------------- FETCH CAREER IMPACT (SAFE) ---------------- */
  useEffect(() => {
    let mounted = true;

    const fetchCareerImpact = async () => {
      // 1️⃣ Try domain + course
      let result = await safeGet<CareerImpactData>(
        `${API_BASE_URL}/api/career-impact`,
        {
          domainId: domainId ?? undefined,
          courseId: courseId ?? undefined,
        }
      );

      // 2️⃣ Fallback → landing
      if (!result) {
        result = await safeGet<CareerImpactData>(
          `${API_BASE_URL}/api/career-impact`,
          { domainId: 0, courseId: 0 }
        );
      }

      if (mounted) {
        setData(result);
      }
    };

    fetchCareerImpact();
    return () => {
      mounted = false;
    };
  }, [domainId, courseId]);

  /* ---------------- GUARD ---------------- */
  if (!data) return null;

  /* ---------------- UI ---------------- */
  return (
    <section
      className="relative w-full py-20 px-6 md:px-20 overflow-hidden"
      style={{ backgroundColor: COLORS.white }}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 h-full">

        {/* === LEFT COLUMN: MAIN CAREER CARD === */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full lg:w-1/2 min-h-[400px] rounded-3xl p-10 flex flex-col justify-center shadow-2xl relative overflow-hidden"
          style={{ backgroundColor: COLORS.gold }}
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-20 bg-white" />

          <div className="relative z-10">
            <h2
              className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
              style={{ color: COLORS.darkGreen }}
            >
              {data.mainTitle}
            </h2>

            <p
              className="text-lg md:text-xl mb-8 font-medium opacity-90"
              style={{ color: COLORS.darkGreen }}
            >
              {data.mainDescription}
            </p>

            <a
              href={data.ctaLink}
              className="inline-block px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-transform hover:scale-105"
              style={{
                backgroundColor: COLORS.darkGreen,
                color: COLORS.cream,
              }}
            >
              {data.ctaText}
            </a>
          </div>
        </motion.div>

        {/* === RIGHT COLUMN === */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 md:gap-8">

          {/* CARD 1 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 rounded-3xl p-8 md:p-10 shadow-xl flex flex-col justify-center"
            style={{ backgroundColor: COLORS.darkGreen }}
          >
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: COLORS.cream }}
            >
              {data.card1Title}
            </h3>
            <p
              className="text-base opacity-80 leading-relaxed"
              style={{ color: COLORS.cream }}
            >
              {data.card1Description}
            </p>
          </motion.div>

          {/* CARD 2 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex-1 rounded-3xl p-8 md:p-10 shadow-xl flex flex-col justify-center"
            style={{ backgroundColor: COLORS.darkGreen }}
          >
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: COLORS.cream }}
            >
              {data.card2Title}
            </h3>
            <p
              className="text-base opacity-80 leading-relaxed"
              style={{ color: COLORS.cream }}
            >
              {data.card2Description}
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default CareerImpactSection;
