/* eslint-disable no-irregular-whitespace */
import React, { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import axios from "axios";
import { usePageContext } from "../../context/usePageContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const COLORS = {
  darkGreen: "#01311F",
  gold: "#B99A49",
  cream: "#F0ECE3",
  white: "#FFFFFF",
};

interface Tech {
  id: number;
  name: string;
  iconUrl: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { stiffness: 100, damping: 20 },
  },
};

const floatAnimation = {
  y: [-5, 5, -5],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: [0.42, 0, 0.58, 1] as const,
  },
};

const TechStackSection: React.FC = () => {
  const { domainId, courseId } = usePageContext();
  const [techStack, setTechStack] = useState<Tech[]>([]);

  useEffect(() => {
    // Safety check to ensure IDs are passed as numbers
    const dId = Number(domainId) || 0;
    const cId = Number(courseId) || 0;

    axios
      .get(`${API_BASE_URL}/api/tech-stack`, {
        params: { domainId: dId, courseId: cId },
      })
      .then(res => {
        // Handle both direct arrays and nested data objects
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setTechStack(data);
      })
      .catch(err => console.error("Tech Stack Fetch Error:", err));
  }, [domainId, courseId]);

  return (
    <section
      className="relative w-full py-24 px-6 md:px-20 overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${COLORS.white}, ${COLORS.cream})` }}
    >
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-16" style={{ color: COLORS.darkGreen }}>
          Technologies You Will Master
        </h2>

        {techStack.length === 0 ? (
          <p className="text-gray-400 italic">No technologies listed for this selection.</p>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
          >
            {techStack.map(tech => (
              <motion.div
                key={tech.id}
                variants={cardVariants}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                className="group p-8 rounded-3xl border border-white/50 shadow-sm transition-shadow"
                style={{ backgroundColor: "rgba(255,255,255,0.7)" }}
              >
                <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <motion.img
                    animate={floatAnimation}
                    // Safe URL joining: removes double slashes if API_BASE_URL ends with /
                    src={`${API_BASE_URL.replace(/\/$/, '')}${tech.iconUrl}`}
                    alt={tech.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Tech';
                    }}
                  />
                </div>
                <h3 className="text-lg font-extrabold uppercase tracking-wider" style={{ color: COLORS.darkGreen }}>
                  {tech.name}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TechStackSection;