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
interface Student {
  id: number;
  name?: string;
  course?: string;
  rating?: number;
  review?: string;
  image?: string;
  placement?: string;
  duration?: string;
}

/* ---------------- FLIP CARD ---------------- */
const StudentFlipCard: React.FC<Student> = ({
  name,
  course,
  rating = 0,
  review = "",
  image,
  placement,
  duration = "6 months",
}) => {
  const [hover, setHover] = useState(false);

  const firstLetter = name?.charAt(0)?.toUpperCase() || "S";

  return (
    <div
      className="w-full h-[450px] perspective-1000"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <motion.div
        animate={{ rotateY: hover ? 180 : 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT */}
        <div className="absolute inset-0 bg-white rounded-2xl shadow-xl backface-hidden">
          <div className="h-28 bg-gradient-to-b from-[#01311F] to-[#014f32]" />

          <div className="-mt-16 flex justify-center">
            <div className="w-32 h-32 rounded-full border-4 overflow-hidden bg-white border-[#B99A49] flex items-center justify-center">
              {image ? (
                <img
                  src={`${API_BASE_URL}${image}`}
                  className="w-full h-full object-cover"
                  alt={name || "Student"}
                  onError={(e) =>
                    ((e.target as HTMLImageElement).style.display = "none")
                  }
                />
              ) : (
                <div className="text-4xl font-bold">{firstLetter}</div>
              )}
            </div>
          </div>

          <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-[#01311F]">
              {name || "Student"}
            </h3>
            <p className="text-xs uppercase opacity-70">{course}</p>

            <div className="flex justify-center gap-1 my-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i < rating ? "⭐" : "☆"}</span>
              ))}
            </div>

            <div className="flex justify-between mt-6 border-t pt-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Duration</p>
                <p className="font-bold">{duration}</p>
              </div>

              {placement && (
                <div>
                  <p className="text-gray-400 text-xs">Placed At</p>
                  <p className="font-bold text-[#B99A49]">{placement}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-2xl flex items-center justify-center p-8 text-center backface-hidden"
          style={{
            backgroundColor: COLORS.gold,
            transform: "rotateY(180deg)",
          }}
        >
          <p className="italic text-lg">"{review}"</p>
        </div>
      </motion.div>
    </div>
  );
};

/* ---------------- MAIN SECTION ---------------- */
const SuccessStoriesSection: React.FC = () => {
  const { domainId, courseId } = usePageContext();
  const [students, setStudents] = useState<Student[]>([]);
  const [index, setIndex] = useState(0);

  const itemsPerPage = window.innerWidth < 768 ? 1 : 3;

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    // 🚫 Skip landing page
    if (domainId == null && courseId == null) {
      setStudents([]);
      return;
    }

    const params: any = {};
    if (domainId > 0) params.domainId = domainId;
    if (courseId > 0) params.courseId = courseId;

    axios
      .get(`${API_BASE_URL}/api/student-success`, { params })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setStudents(res.data);
        } else {
          setStudents([]);
        }
      })
      .catch(() => setStudents([]));
  }, [domainId, courseId]);

  const totalPages = Math.ceil(students.length / itemsPerPage);

  useEffect(() => {
    if (totalPages <= 1) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % totalPages),
      5000
    );
    return () => clearInterval(timer);
  }, [totalPages]);

  if (!students.length) return null;

  const visible = students.slice(
    index * itemsPerPage,
    index * itemsPerPage + itemsPerPage
  );

  return (
    <section className="py-24 px-6" style={{ backgroundColor: COLORS.darkGreen }}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-[#B99A49] mb-12">
          Student Success Stories
        </h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`grid gap-8 ${
              itemsPerPage === 1 ? "grid-cols-1" : "md:grid-cols-3"
            }`}
          >
            {visible.map((s) => (
              <StudentFlipCard key={s.id} {...s} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
