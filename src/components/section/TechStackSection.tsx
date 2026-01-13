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
    axios
      .get(`${API_BASE_URL}/api/tech-stack`, {
        params: { domainId: domainId ?? 0, courseId: courseId ?? 0 },
      })
      .then(res => setTechStack(res.data));
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {techStack.map(tech => (
            <motion.div
              key={tech.id}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="group p-8 rounded-3xl backdrop-blur-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
            >
              <motion.img
                animate={floatAnimation}
                src={`http://localhost:5000${tech.iconUrl}`}
                alt={tech.name}
                className="w-20 h-20 mx-auto mb-6 object-contain"
              />
              <h3 className="text-lg font-bold" style={{ color: COLORS.darkGreen }}>
                {tech.name}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechStackSection;
