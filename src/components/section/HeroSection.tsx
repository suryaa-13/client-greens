
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { safeGet } from "../../util/safeGet";
import LoadingPage from "../LoadingPage";
import logo from "../../assets/Greens.png";

const API_BASE_URL =import.meta.env.VITE_API_BASE_URL;

const COLORS = {
  darkGreen: "#01311F",
  gold: "#B99A49",
  cream: "#F0ECE3",
  white: "#FFFFFF",
};

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { domainId, courseId } = useParams();
  const [heroData, setHeroData] = useState<any>(null);
  const [domains, setDomains] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  console.log("Course", courses);

  const isLandingPage = !domainId;
  const isDomainPage = !!domainId && !courseId;
  const isCoursePage = !!domainId && !!courseId;
  const parsedDomainId = domainId ? Number(domainId) : undefined;
  const parsedCourseId = courseId ? Number(courseId) : undefined;


useEffect(() => {
  let mounted = true;

  const fetchHero = async () => {
    setLoading(true);

    const data =
      (await safeGet<any>(`${API_BASE_URL}/api/hero`, {
        domainId: parsedDomainId ?? 0,
        courseId: parsedCourseId ?? 0,
      })) ??
      (await safeGet<any>(`${API_BASE_URL}/api/hero`, {
        domainId: 0,
        courseId: 0,
      }));

    if (mounted) {
      setHeroData(data);
      setLoading(false);
    }
  };

  fetchHero();

  return () => {
    mounted = false;
  };
}, [parsedDomainId, parsedCourseId]);

console.log("hero",heroData);

  // useEffect(() => {
  //   if (isLandingPage) safeGet<any[]>(`${API_BASE_URL}/api/domain`).then(setDomains);
  //   if (isDomainPage && parsedDomainId) safeGet<any[]>(`${API_BASE_URL}/api/courses`, { domainId: parsedDomainId }).then(setCourses);
  // }, [isLandingPage, isDomainPage, parsedDomainId]);

  useEffect(() => {
    if (isLandingPage) {
      safeGet<any[]>(`${API_BASE_URL}/api/domain`)
        .then(data => setDomains(data ?? [])); // ✅ FIX
    }

    if (isDomainPage && parsedDomainId) {
      safeGet<any[]>(
        `${API_BASE_URL}/api/courses`,
        { domainId: parsedDomainId }
      ).then(data => setCourses(data ?? [])); // ✅ FIX
    }
  }, [isLandingPage, isDomainPage, parsedDomainId]);

  useEffect(() => {
    if (!heroData?.images?.length) return;
    const interval = setInterval(() => setCurrent(p => (p + 1) % heroData.images.length), 6000);
    return () => clearInterval(interval);
  }, [heroData]);

  if (loading) return <LoadingPage />;

  return (
    <div className="relative w-full overflow-hidden bg-[#012618]">

      {/* 1. ELEGANT RUNNING STRIP */}
      {heroData?.runningTexts?.length > 0 && (
        <div className="w-full py-2 bg-[#B99A49] relative z-30 shadow-md">
          <div className="flex whitespace-nowrap overflow-hidden">
            <motion.div
              animate={{ x: [0, -1000] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="flex gap-12 items-center text-[11px] font-bold uppercase tracking-[0.3em] text-[#01311F]"
            >
              {[...heroData.runningTexts, ...heroData.runningTexts].map((item, i) => (
                <span key={i} className="flex items-center gap-12">
                  {item.text} <span>•</span>
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      )}

      {/* 2. HERO SLIDER WITH KEN BURNS EFFECT */}
      <div className="relative w-full h-[85vh] md:h-[90vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
style={{
  backgroundImage: heroData?.images?.[current]
    ? `url(${API_BASE_URL}${heroData.images[current]})`
    : "none",
}}          >
            {/* Multi-layered Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#01311F]/90 via-[#01311F]/60 to-transparent" />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        </AnimatePresence>

        {/* 3. CONTENT AREA */}
        <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-20 lg:px-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[2px] w-12 bg-[#B99A49]" />
              <span className="text-[#B99A49] font-bold tracking-[0.4em] text-xs uppercase">Premium Training</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6 drop-shadow-2xl">
              {heroData?.title?.split(' ').map((word: string, i: number) => (
                <span key={i} className={i === 1 ? "text-[#B99A49]" : ""}>{word} </span>
              ))}
            </h1>

            <p className="text-lg md:text-xl text-[#F0ECE3]/80 mb-10 leading-relaxed max-w-xl font-light">
              {heroData.description}
            </p>

            {/* 4. DYNAMIC BUTTON GRID */}
            <div className="flex flex-wrap gap-4">
              {isLandingPage && (
                <div className="relative flex items-center justify-center h-20 w-20 my-5">
                  {/* EXPLORE BUTTON */}
                  <motion.button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative z-50 w-20 h-20 rounded-full font-bold text-xs uppercase tracking-widest border border-[#B99A49] bg-[#01311F] text-[#B99A49] shadow-[0_0_20px_rgba(185,154,73,0.3)] hover:bg-[#B99A49] hover:text-[#01311F] transition-colors duration-300 flex items-center justify-center"
                  >
                    {isMenuOpen ? "Close" : "Explore"}
                  </motion.button>

                  {/* CIRCULAR ITEMS */}
                  <AnimatePresence>
                    {isMenuOpen && domains.map((d, i) => {
                      const angle = (i / domains.length) * 360; // Spread full circle
                      const radius = 90; // Distance from center
                      const x = Math.cos((angle * Math.PI) / 180) * radius;
                      const y = Math.sin((angle * Math.PI) / 180) * radius;

                      return (
                        <motion.button
                          key={d.id}
                          onClick={() => navigate(`/domain/${d.domainId}`)}
                          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                          animate={{ opacity: 1, scale: 1, x, y }}
                          exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 20, delay: i * 0.05 }}
                          className="absolute w-24 h-10 rounded-full font-bold text-[10px] uppercase tracking-wider border border-[#B99A49]/50 bg-white/10 backdrop-blur-md text-white hover:bg-[#B99A49] hover:text-[#01311F] transition-colors truncate px-2 whitespace-nowrap overflow-hidden flex items-center justify-center"
                          style={{ top: "30%", left: "30%", transform: "translate(-50%, -50%)" }} // Center origin
                        >
                          {d.domain}
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}

              {isDomainPage && courses.map(c => (
                <button
                  key={c.id}
                  onClick={() => navigate(`/domain/${parsedDomainId}/course/${c.courseId}`)}
                  className="px-8 py-3 rounded-md font-bold text-sm uppercase tracking-widest border border-[#B99A49]/30 bg-white/5 backdrop-blur-md text-white hover:bg-[#B99A49] hover:text-[#01311F] transition-all duration-300"
                >
                  {c.title}
                </button>
              ))}

              {isCoursePage && (
                <button
                  onClick={() => window.dispatchEvent(new Event("open-enrolment"))}
                  className="px-12 py-5 bg-[#B99A49] text-[#01311F] rounded-sm font-black text-lg uppercase tracking-tighter shadow-[0_10px_30px_rgba(185,154,73,0.3)] hover:scale-105 transition-all"
                >
                  Start Your Journey →
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* 5. SLIDER INDICATORS */}
        <div className="absolute bottom-10 right-10 z-30 flex gap-3">
          {heroData?.images?.map((_: any, i: number) => (
            <div
              key={i}
              className={`h-1 transition-all duration-500 ${current === i ? "w-12 bg-[#B99A49]" : "w-4 bg-white/30"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

