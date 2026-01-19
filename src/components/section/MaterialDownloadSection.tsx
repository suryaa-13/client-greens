import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { usePageContext } from "../../context/usePageContext";
import {
  FiFileText,
  FiBookOpen,
  FiFolder,
  FiEye,
  FiX,
  FiExternalLink,
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
  fileType: "PDF" | "DOCX" | "PRESENTATION";
  highlight: string;
  filePath: string;
  imageUrl?: string | null;
}

/* ---------------- ICON HELPER ---------------- */
const getIcon = (type: Material["fileType"], large = false) => {
  const cls = large ? "text-4xl opacity-90" : "text-xl";
  switch (type) {
    case "PDF": return <FiFileText className={cls} />;
    case "DOCX": return <FiBookOpen className={cls} />;
    case "PRESENTATION": return <FiFolder className={cls} />;
    default: return <FiFileText className={cls} />;
  }
};

const StudyMaterialSection: React.FC = () => {
  const { domainId, courseId } = usePageContext();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 3;

  /* ---------------- FETCH DATA ---------------- */
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
console.log("metarial",materials);

  /* ---------------- PREVIEW LOGIC ---------------- */
  const handleMaterialClick = (m: Material) => {
    const fileUrl = `${API_BASE_URL}${m.filePath}`;

    // PDF and VIDEO can be previewed in our modal
    if (m.fileType === "PDF") {
      setSelected(m);
    } else {
      // DOCX and PRESENTATION are opened in a new tab
      // This allows the browser to handle the file (download or open in Office Online)
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) return <div className="py-20 text-center text-white">Loading Study Materials...</div>;
  if (!materials.length) return null;

  const totalPages = Math.ceil(materials.length / ITEMS_PER_PAGE);
  const visible = materials.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE);

  return (
    <>
      <section className="py-24 px-6" style={{ background: COLORS.darkGreen }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl text-center text-[#F0ECE3] mb-12 font-bold">
            Resource<span className="text-[#B99A49]">.</span>Library
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {visible.map((m) => (
              <motion.div
                key={m.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleMaterialClick(m)}
                className="cursor-pointer rounded-2xl overflow-hidden shadow-2xl bg-black flex flex-col h-full"
              >
                <div className="relative h-[250px] w-full bg-gray-900">
                  {m.imageUrl ? (
                    <img src={`${API_BASE_URL}${m.imageUrl}`} alt={m.fileName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      {getIcon(m.fileType, true)}
                    </div>
                  )}
                </div>

                <div className="p-6 bg-black/90 flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-[#B99A49] text-[#01311F]">
                      {m.highlight}
                    </span>
                    <span className="text-white/50">{getIcon(m.fileType)}</span>
                  </div>

                  <h3 className="text-white font-bold text-lg mb-2 truncate">{m.fileName}</h3>
                  <p className="text-white/60 text-sm line-clamp-2 mb-4">{m.description}</p>

                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider" style={{ color: COLORS.gold }}>
                    {m.fileType === "PDF" ? (
                      <><FiEye /> Preview Now</>
                    ) : (
                      <><FiExternalLink /> Open Material</>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-12">
              <button 
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-6 py-2 rounded-xl font-bold bg-[#B99A49] text-[#01311F] disabled:opacity-30"
              >Prev</button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="px-6 py-2 rounded-xl font-bold bg-[#B99A49] text-[#01311F] disabled:opacity-30"
              >Next</button>
            </div>
          )}
        </div>
      </section>

      {/* ================= PREVIEW MODAL ================= */}
<AnimatePresence>
  {selected && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
      onClick={() => setSelected(null)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-6xl h-full max-h-[90vh] bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black">
          <div className="flex items-center gap-3">
            <span style={{ color: COLORS.gold }}>{getIcon(selected.fileType)}</span>
            <span className="text-white font-medium truncate max-w-[200px] md:max-w-md">
              {selected.fileName}
            </span>
          </div>
          <button 
            onClick={() => setSelected(null)}
            className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </>
  );
};

export default StudyMaterialSection;