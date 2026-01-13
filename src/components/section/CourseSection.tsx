/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { usePageContext } from "../../context/usePageContext";

/* ---------------- CONFIG ---------------- */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ---------------- COLORS ---------------- */
const darkGreen = "#01311F";
const gold = "#B99A49";
const cream = "#F0ECE3";

/* ---------------- TYPES ---------------- */
interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  price: string;
  duration: string;
}

/* ---------------- ANIMATION ---------------- */
const carouselVariants = (direction: number): Variants => ({
  enter: {
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    position: "absolute",
    width: "100%",
  },
  center: {
    x: 0,
    opacity: 1,
    position: "relative",
    width: "100%",
  },
  exit: {
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    position: "absolute",
    width: "100%",
  },
});

/* ---------------- COURSE CARD ---------------- */
const CourseCard: React.FC<{
  course: Course;
  onClick: () => void;
}> = ({ course, onClick }) => (
  <motion.div
    onClick={onClick}
    className="cursor-pointer rounded-3xl shadow-xl overflow-hidden flex flex-col h-full"
    style={{ backgroundColor: cream }}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="h-40 overflow-hidden">
      {/* Course Image */}
      <img
        src={`${API_BASE_URL}${course.image}`}
        alt={course.title}
        className="w-full h-full object-cover transition hover:scale-110"
      />
    </div>

    <div className="p-5 flex flex-col flex-grow">
      <h3 className="text-xl font-bold mb-2" style={{ color: gold }}>
        {course.title}
      </h3>

      <p className="text-sm mb-4 flex-grow" style={{ color: darkGreen }}>
        {course.description.substring(0, 100)}...
      </p>

      <div className="flex justify-between pt-3 border-t">
        <span
          className="px-4 py-1 text-sm font-bold rounded-full"
          style={{ backgroundColor: gold, color: darkGreen }}
        >
          {course.price}
        </span>
        <span
          className="px-4 py-1 text-sm font-bold rounded-full border-2"
          style={{ borderColor: gold, color: gold }}
        >
          {course.duration}
        </span>
      </div>
    </div>
  </motion.div>
);

/* ---------------- MAIN COMPONENT ---------------- */
const CourseSection: React.FC = () => {
  const navigate = useNavigate();
  const { domainId, setCourseId } = usePageContext();

  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  /* ---------- FETCH COURSES ---------- */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/courses`, {
          params: { domainId: domainId ?? 0 },
        });
        setCourses(res.data);
        setPage(0);
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    };

    fetchCourses();
  }, [domainId]);

  /* ---------- RESPONSIVE ---------- */
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 640) setVisibleCards(1);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else setVisibleCards(3);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  if (!courses.length) return null;

  const totalPages = Math.ceil(courses.length / visibleCards);

  const paginate = (dir: number) => {
    setDirection(dir);
    setPage((prev) =>
      dir > 0
        ? (prev + 1) % totalPages
        : prev === 0
        ? totalPages - 1
        : prev - 1
    );
  };

  const visibleCourses = courses.slice(
    page * visibleCards,
    page * visibleCards + visibleCards
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="p-4 sm:p-10 pb-20" style={{ backgroundColor: darkGreen }}>
      <h2 className="text-4xl text-center mb-12" style={{ color: cream }}>
        Featured<span style={{ color: gold }}>.</span>Courses
      </h2>

      <div className="relative max-w-7xl mx-auto flex items-center">
        {/* Prev */}
        <motion.button
          onClick={() => paginate(-1)}
          className="hidden lg:block absolute -left-12 p-3 rounded-full"
          style={{ backgroundColor: gold, color: darkGreen }}
          whileHover={{ scale: 1.1 }}
        >
          <FiChevronLeft size={24} />
        </motion.button>

        {/* Slider */}
        <div className="relative overflow-hidden w-full min-h-[450px]">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={page}
              custom={direction}
              variants={carouselVariants(direction)}
              initial="enter"
              animate="center"
              exit="exit"
              className={`grid gap-10 ${
                visibleCards === 1
                  ? "grid-cols-1"
                  : visibleCards === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
              }`}
            >
              {visibleCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => {
                    if (!domainId) return;
                    setCourseId(course.id);
                    navigate(`/domain/${domainId}/course/${course.id}`);
                  }}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next */}
        <motion.button
          onClick={() => paginate(1)}
          className="hidden lg:block absolute -right-12 p-3 rounded-full"
          style={{ backgroundColor: gold, color: darkGreen }}
          whileHover={{ scale: 1.1 }}
        >
          <FiChevronRight size={24} />
        </motion.button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <div
            key={i}
            onClick={() => {
              setDirection(i > page ? 1 : -1);
              setPage(i);
            }}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              i === page ? "opacity-100" : "opacity-40"
            }`}
            style={{ backgroundColor: gold }}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseSection;
