import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { usePageContext } from "../../context/usePageContext";
import {
  FiFileText,
  FiBookOpen,
  FiFilm,
  FiFolder,
  FiEye,
  FiX,
} from "react-icons/fi";

/* ---------------- CONFIG ---------------- */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const COLORS = {
  darkGreen: "#01311F",
  gold: "#B99A49",
};

/* ---------------- TYPES ---------------- */
interface Material {
  id: number;
  fileName: string;
  description: string;
  fileType: "PDF" | "DOCX" | "VIDEO" | "PRESENTATION" | "EBOOK";
  highlight: string;
  filePath: string;
  thumbnailPath?: string | null;
}

/* ---------------- ICON ---------------- */
const getIcon = (type: Material["fileType"], large = false) => {
  const cls = large ? "text-4xl opacity-90" : "text-xl";
  switch (type) {
    case "PDF":
      return <FiFileText className={cls} />;
    case "DOCX":
      return <FiBookOpen className={cls} />;
    case "VIDEO":
      return <FiFilm className={cls} />;
    case "PRESENTATION":
      return <FiFolder className={cls} />;
    default:
      return <FiFileText className={cls} />;
  }
};

/* ---------------- COMPONENT ---------------- */
const StudyMaterialSection: React.FC = () => {
  const { domainId, courseId } = usePageContext();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 3;

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    setLoading(true);

    axios
      .get(`${API_BASE_URL}/api/materials`, {
        params: {
          domainId: Number(domainId ?? 0),
          courseId: Number(courseId ?? 0),
        },
      })
      .then((res) => {
        setMaterials(Array.isArray(res.data) ? res.data : []);
        setPage(0);
      })
      .catch(() => setMaterials([]))
      .finally(() => setLoading(false));
  }, [domainId, courseId]);

  /* ---------------- UI STATES ---------------- */
  if (loading) {
    return (
      <div className="py-20 text-center text-white">
        Loading Study Materials...
      </div>
    );
  }

  if (!materials.length) return null;

  const totalPages = Math.ceil(materials.length / ITEMS_PER_PAGE);
  const visible = materials.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <>
      {/* ================= SECTION ================= */}
      <section
        className="py-24 px-6"
        style={{ background: COLORS.darkGreen }}
      >
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
           <h2 className="text-4xl text-center text-[#F0ECE3] mb-12 font-bold">
        Resource<span className="text-[#B99A49]">.</span>Library
      </h2>

          {/* CARDS */}
          <div className="grid md:grid-cols-3 gap-8">
            {visible.map((m) => (
              <motion.div
                key={m.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelected(m)}
                className="cursor-pointer rounded-2xl overflow-hidden shadow-2xl bg-black"
              >
                {/* THUMBNAIL */}
                {m.thumbnailPath ? (
                  <img
                    src={`${API_BASE_URL}${m.thumbnailPath}`}
                    alt={m.fileName}
                    className="w-full h-[350px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[350px] flex items-center justify-center bg-black text-white">
                    {getIcon(m.fileType, true)}
                  </div>
                )}

                {/* OVERLAY */}
                <div className="p-4 bg-black/80">
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        background: COLORS.gold,
                        color: COLORS.darkGreen,
                      }}
                    >
                      {m.highlight}
                    </span>

                    <span className="text-white">
                      {getIcon(m.fileType)}
                    </span>
                  </div>

                  <h3 className="text-white font-bold">
                    {m.fileName}
                  </h3>

                  <p className="text-white/80 text-sm mt-2 line-clamp-2">
                    {m.description}
                  </p>

                  <div
                    className="mt-4 flex items-center gap-2 font-bold"
                    style={{ color: COLORS.gold }}
                  >
                    <FiEye />
                    Preview
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-6 mt-14">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page === 0}
                className="px-6 py-2 rounded-full font-bold disabled:opacity-40"
                style={{
                  background: COLORS.gold,
                  color: COLORS.darkGreen,
                }}
              >
                Prev
              </button>

              <button
                onClick={() =>
                  setPage((p) => Math.min(p + 1, totalPages - 1))
                }
                disabled={page === totalPages - 1}
                className="px-6 py-2 rounded-full font-bold disabled:opacity-40"
                style={{
                  background: COLORS.gold,
                  color: COLORS.darkGreen,
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================= PREVIEW MODAL ================= */}
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
              className="relative w-full max-w-5xl h-[85vh] bg-black rounded-xl overflow-hidden"
            >
              {/* CLOSE */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 text-white"
              >
                <FiX size={22} />
              </button>

              {/* CONTENT */}
              {selected.fileType === "VIDEO" ? (
                <video
                  src={`${API_BASE_URL}${selected.filePath}`}
                  controls
                  className="w-full h-full"
                />
              ) : (
                <iframe
                  src={`${API_BASE_URL}${selected.filePath}`}
                  className="w-full h-full"
                  title="Study Material Preview"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StudyMaterialSection;
