/* eslint-disable no-irregular-whitespace */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { usePageContext } from "../../context/usePageContext";

/* ---------------- COLORS ---------------- */
const COLORS = {
  darkGreen: "#01311F",
  gold: "#B99A49",
  cream: "#F0ECE3",
  white: "#FFFFFF",
  silver: "#E5E5E5",
};

/* ---------------- TYPES ---------------- */
interface ModuleTopic {
  id: number;
  title: string;
}

interface Module {
  id: number;
  title: string;
  description?: string;
  topics?: ModuleTopic[];
}

/* ---------------- COMPONENT ---------------- */
const ModulesSection: React.FC = () => {
  const { domainId, courseId } = usePageContext();

  const [modules, setModules] = useState<Module[]>([]);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  /* ---------------- FETCH MODULES ---------------- */
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_BASE_URL}/api/modules`, {
          params: {
            domainId: domainId ?? 0,
            courseId: courseId ?? 0,
          },
        });

        const fetchedModules: Module[] = res.data || [];

        setModules(fetchedModules);

        // ✅ Keep previously selected module if exists
        setActiveModule((prev) => {
          if (!prev) return fetchedModules[0] || null;
          return (
            fetchedModules.find((m) => m.id === prev.id) ||
            fetchedModules[0] ||
            null
          );
        });
      } catch (error) {
        console.error("Failed to load modules", error);
        setModules([]);
        setActiveModule(null);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [domainId, courseId]);

  if (loading) return null;
  if (!activeModule) return null;

  return (
    <section
      className="relative w-full py-16 md:py-20 px-4 md:px-20 overflow-hidden"
      style={{ backgroundColor: COLORS.white }}
    >
      <div className="max-w-7xl mx-auto">

        {/* ===== HEADING ===== */}
        <div className="text-center mb-8 md:mb-12">
          <h2
            className="text-2xl md:text-3xl lg:text-5xl font-bold mb-3 md:mb-4"
            style={{ color: COLORS.darkGreen }}
          >
            Course Curriculum
          </h2>
          <p
            className="text-base md:text-lg opacity-80 max-w-2xl mx-auto"
            style={{ color: COLORS.darkGreen }}
          >
            Structured modules designed for real-world expertise.
          </p>
        </div>

        {/* ===== MAIN CONTAINER ===== */}
        <div
          className="rounded-3xl p-4 md:p-12 shadow-2xl flex flex-col lg:flex-row gap-6 md:gap-8"
          style={{ backgroundColor: COLORS.gold }}
        >

          {/* ===== LEFT: MODULE LIST ===== */}
          <div
            className="w-full lg:w-1/3 rounded-2xl p-4 md:p-6 flex flex-row lg:flex-col gap-3 md:gap-4 overflow-x-auto lg:overflow-visible no-scrollbar snap-x"
            style={{ backgroundColor: COLORS.silver }}
          >
            <h3
              className="hidden lg:block text-xl font-bold mb-2 pl-2"
              style={{ color: COLORS.darkGreen }}
            >
              Modules
            </h3>

            {modules.map((mod, index) => {
              const isActive = activeModule.id === mod.id;

              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(mod)}
                  className={`flex-shrink-0 snap-start text-left px-4 py-3 md:px-6 md:py-4 rounded-xl font-semibold transition-all duration-300 shadow-sm flex justify-between items-center whitespace-nowrap lg:whitespace-normal ${
                    isActive
                      ? "scale-95 lg:scale-105 ring-2 ring-offset-2 ring-[#01311F]"
                      : "hover:bg-white/50"
                  }`}
                  style={{
                    backgroundColor: isActive
                      ? COLORS.darkGreen
                      : COLORS.white,
                    color: isActive ? COLORS.gold : COLORS.darkGreen,
                  }}
                >
                  <span className="text-sm md:text-base">
                    Module {index + 1}: {mod.title}
                  </span>

                  {isActive && (
                    <motion.span
                      layoutId="activeDot"
                      className="hidden lg:block w-2 h-2 rounded-full bg-[#B99A49]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ===== RIGHT: MODULE DETAILS ===== */}
          <div
            className="w-full lg:w-2/3 rounded-2xl p-6 md:p-12 min-h-[350px] md:min-h-[400px] flex flex-col justify-center relative overflow-hidden"
            style={{ backgroundColor: COLORS.darkGreen }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#B99A49] text-[#01311F]">
                  Module
                </span>

                <h3
                  className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 mt-4"
                  style={{ color: COLORS.gold }}
                >
                  {activeModule.title}
                </h3>

                {activeModule.description && (
                  <p
                    className="text-base md:text-xl leading-relaxed mb-6 md:mb-8 opacity-90"
                    style={{ color: COLORS.cream }}
                  >
                    {activeModule.description}
                  </p>
                )}

                {/* ===== TOPICS ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {activeModule.topics && activeModule.topics.length > 0 ? (
                    activeModule.topics.map((topic) => (
                      <div
                        key={topic.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={COLORS.gold}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>

                        <span
                          className="text-sm md:text-md font-medium"
                          style={{ color: COLORS.cream }}
                        >
                          {topic.title}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/60 text-sm col-span-full">
                      No topics available for this module.
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Decorative Background Icon */}
            <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
              <svg
                width="200"
                height="200"
                viewBox="0 0 24 24"
                fill={COLORS.white}
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
