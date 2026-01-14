/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";
import { usePageContext } from "../../context/usePageContext";
import noImage from "../../assets/no-image.png";

/* ---------------- CONFIG ---------------- */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ---------------- COLORS ---------------- */
const COLORS = {
  darkGreen: "#01311F",
  gold: "#B99A49",
  cream: "#F0ECE3",
};

/* ---------------- TYPES ---------------- */
interface Testimonial {
  id: number;
  name: string;
  batch: string;
  image: string;
  quote: string;
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

/* ---------------- COMPONENT ---------------- */
const TestimonialsSection: React.FC = () => {
  const { domainId } = usePageContext();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  /* ---------- FETCH (SAFE) ---------- */
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/testimonials`, {
          params: { domainId: domainId ?? 0 },
        });

        // ✅ NORMALIZE RESPONSE
        const list: Testimonial[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];

        setTestimonials(list);
        setPage(0);
      } catch (err) {
        console.error("Failed to load testimonials", err);
        setTestimonials([]);
      }
    };

    fetchTestimonials();
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

  /* ---------- AUTO SCROLL ---------- */
  useEffect(() => {
    // Determine total pages here or use the calculated one if scope allows, 
    // but totalPages is calculated below. We can recalculate or move it up.
    // For simplicity, we can just use the state logic inside, assuming testimonials & visibleCards change rarely.

    // We need to move totalPages calculation up or access it.
    // However, it's safe to define `totalPages` here if we include deps.
    if (!testimonials.length) return;
    const tPages = Math.ceil(testimonials.length / visibleCards);

    if (tPages <= 1) return;

    const interval = setInterval(() => {
      setDirection(1);
      setPage((prev) => (prev + 1) % tPages);
    }, 3000);

    return () => clearInterval(interval);
  }, [testimonials.length, visibleCards]);

  /* ---------- GUARDS ---------- */
  if (!Array.isArray(testimonials) || testimonials.length === 0) return null;

  const selectedTestimonial = testimonials.find(t => t.id === selectedId);

  const totalPages = Math.ceil(testimonials.length / visibleCards);

  const paginate = (dir: number) => {
    setDirection(dir);
    setPage(prev =>
      dir > 0 ? (prev + 1) % totalPages : prev === 0 ? totalPages - 1 : prev - 1
    );
  };

  const visibleTestimonials = testimonials.slice(
    page * visibleCards,
    page * visibleCards + visibleCards
  );


  /* ---------------- UI ---------------- */
  return (
    <section
      className="w-full py-24 px-6 md:px-10"
      style={{ backgroundColor: COLORS.darkGreen }}
    >
      <div className="max-w-7xl mx-auto">

        <h2 className="text-4xl sm:text-5xl font-light text-center mb-16" style={{ color: COLORS.cream }}>
          Resource<span style={{ color: COLORS.gold }}>.</span>Library
        </h2>

        <div className="relative flex items-center justify-center">

          {/* Prev */}
          <motion.button
            onClick={() => paginate(-1)}
            className="hidden lg:block absolute -left-14 p-3 rounded-full"
            style={{ backgroundColor: COLORS.gold, color: COLORS.darkGreen }}
          >
            <FiChevronLeft size={24} />
          </motion.button>

          {/* Carousel */}
          <div className="relative overflow-hidden w-full min-h-[450px]">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={page}
                custom={direction}
                variants={carouselVariants(direction)}
                initial="enter"
                animate="center"
                exit="exit"
                className={`grid gap-10 ${visibleCards === 1
                  ? "grid-cols-1"
                  : visibleCards === 2
                    ? "grid-cols-2"
                    : "grid-cols-3"
                  }`}
              >
                {visibleTestimonials.map(t => (
                  <motion.div
                    key={t.id}
                    whileHover={{ scale: 1.05 }}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl"
                  >
                    <img
                      src={`${API_BASE_URL}${t.image}`}
                      alt={t.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = noImage;
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 p-4">
                      <h3 className="text-lg font-bold text-white">{t.name}</h3>
                      <p className="text-xs mb-2" style={{ color: COLORS.gold }}>{t.batch}</p>
                      <p className="text-sm text-white/90">{t.quote}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next */}
          <motion.button
            onClick={() => paginate(1)}
            className="hidden lg:block absolute -right-14 p-3 rounded-full"
            style={{ backgroundColor: COLORS.gold, color: COLORS.darkGreen }}
          >
            <FiChevronRight size={24} />
          </motion.button>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center mt-12 gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              onClick={() => {
                setDirection(i > page ? 1 : -1);
                setPage(i);
              }}
              className={`w-3 h-3 rounded-full cursor-pointer ${i === page ? "opacity-100" : "opacity-40"
                }`}
              style={{ backgroundColor: COLORS.gold }}
            />
          ))}
        </div>

    
      </div>
    </section>
  );
};

export default TestimonialsSection;
