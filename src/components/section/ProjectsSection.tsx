/* eslint-disable no-irregular-whitespace */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { usePageContext } from "../../context/usePageContext";

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
interface ProjectTech {
  id: number;
  name: string; // ✅ backend uses `name`
}

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  tech?: ProjectTech[]; // ✅ backend sends `tech`
}

/* ---------------- CARD ---------------- */
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <div className="h-full bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col group cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
    
    {/* Image */}
    <div className="h-48 overflow-hidden">
      <img
        src={`${API_BASE_URL}${project.imageUrl}`}
        alt={project.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        onError={(e) => (e.currentTarget.src = "/no-image.png")}
      />
    </div>

    {/* Content */}
    <div className="p-6 flex-1 flex flex-col">
      <h3
        className="text-xl font-bold mb-3"
        style={{ color: COLORS.darkGreen }}
      >
        {project.title}
      </h3>

      <p className="text-sm text-gray-600 mb-6 flex-1">
        {project.description}
      </p>

      {/* Tech Stack */}
      {project.tech && project.tech.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tech.map((tech) => (
            <span
              key={tech.id}
              className="text-[10px] font-bold px-3 py-1 rounded-full border"
              style={{
                borderColor: COLORS.darkGreen,
                color: COLORS.darkGreen,
              }}
            >
              {tech.name}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);

/* ---------------- MAIN ---------------- */
const ProjectsSection: React.FC = () => {
  const { domainId, courseId } = usePageContext();

  const [projects, setProjects] = useState<Project[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  /* ---------- FETCH PROJECTS ---------- */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/projects`, {
          params: {
            domainId: domainId ?? 0,
            courseId: courseId ?? 0,
          },
        });

        setProjects(res.data || []);
        setCurrentIndex(0);
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    };

    fetchProjects();
  }, [domainId, courseId]);

  /* ---------- RESPONSIVE ---------- */
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 1 : 3);
      setCurrentIndex(0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const visibleProjects = projects.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  /* ---------- AUTO SLIDE ---------- */
  useEffect(() => {
    if (totalPages <= 1) return;

    const timer = setInterval(
      () => setCurrentIndex((i) => (i + 1) % totalPages),
      5000
    );

    return () => clearInterval(timer);
  }, [totalPages]);

  if (!projects.length) return null;

  /* ---------------- UI ---------------- */
  return (
    <section
      className="py-24 px-6 md:px-20"
      style={{ background: COLORS.darkGreen }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-10 text-white">
          Course Projects
        </h2>

        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className={`grid gap-8 ${
                itemsPerPage === 1 ? "grid-cols-1" : "md:grid-cols-3"
              }`}
            >
              {visibleProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
