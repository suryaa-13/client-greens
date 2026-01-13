import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { usePageContext } from "../../context/usePageContext";

/* ---------------- COLORS ---------------- */
const COLORS = {
  darkGreen: "#01311F",
  gold: "#B99A49",
  cream: "#F0ECE3",
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ---------------- TYPES ---------------- */
interface VideoItem {
  id: number;
  name: string;
  batch: string;
  quote: string;
  imageUrl: string;
  videoUrl: string;
}

/* ---------------- HELPERS ---------------- */
const getEmbedSource = (url: string) => {
  if (!url) return "";

  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/
  );

  return match
    ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`
    : url;
};

/* ---------------- COMPONENT ---------------- */
const YoutubeSection: React.FC = () => {
  const { domainId, courseId } = usePageContext();

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<VideoItem | null>(null);

  const ITEMS_PER_PAGE = 3;

  /* ---------------- FETCH (SAFE) ---------------- */
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/videos`, {
        params: { domainId: domainId ?? 0, courseId: courseId ?? 0 },
      })
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        setVideos(list);
        setCurrent(0);
      })
      .catch((err) => {
        console.error("Failed to load videos", err);
        setVideos([]);
      });
  }, [domainId, courseId]);

  /* ---------------- ESC CLOSE ---------------- */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /* ---------------- GUARD ---------------- */
  if (!Array.isArray(videos) || videos.length === 0) return null;

  const totalPages = Math.ceil(videos.length / ITEMS_PER_PAGE);
  const visible = videos.slice(
    current * ITEMS_PER_PAGE,
    current * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <section className="py-24 px-6" style={{ background: COLORS.darkGreen }}>
      <div className="max-w-7xl mx-auto relative">
        {/* HEADER */}
        <h2 className="text-4xl font-bold text-center mb-14 text-white">
          Videos <span style={{ color: COLORS.gold }}>. Resource</span>
        </h2>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-8">
          {visible.map((v) => (
            <motion.div
              key={v.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelected(v)}
              className="cursor-pointer rounded-2xl overflow-hidden shadow-2xl bg-black"
            >
              <img
                src={`${API_BASE_URL}${v.imageUrl}`}
                alt={v.name}
                className="w-full h-[350px] object-cover"
              />

              <div className="p-4 bg-black/80">
                <h3 className="text-white font-bold">{v.name}</h3>

                <p className="text-sm" style={{ color: COLORS.gold }}>
                  {v.batch}
                </p>

                {/* ✅ FULL QUOTE FIX */}
                <p className="text-white/80 text-sm mt-2 whitespace-normal break-words leading-relaxed">
                  “{v.quote}”
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* NAVIGATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-6 mt-10">
            <button
              onClick={() => setCurrent((p) => Math.max(p - 1, 0))}
              disabled={current === 0}
              className="px-6 py-2 rounded-full font-bold disabled:opacity-40"
              style={{ background: COLORS.gold, color: COLORS.darkGreen }}
            >
              Prev
            </button>

            <button
              onClick={() =>
                setCurrent((p) => Math.min(p + 1, totalPages - 1))
              }
              disabled={current === totalPages - 1}
              className="px-6 py-2 rounded-full font-bold disabled:opacity-40"
              style={{ background: COLORS.gold, color: COLORS.darkGreen }}
            >
              Next
            </button>
          </div>
        )}

        {/* MODAL */}
        <AnimatePresence>
          {selected && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
              >
                <iframe
                  src={getEmbedSource(selected.videoUrl)}
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default YoutubeSection;
