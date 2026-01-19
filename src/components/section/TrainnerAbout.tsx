import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Globe } from "lucide-react";
import { usePageContext } from "../../context/usePageContext";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const COLORS = { darkGreen: "#01311F", gold: "#B99A49", white: "#FFFFFF" };

const TrainerAbout: React.FC = () => {
  const { domainId, courseId } = usePageContext();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/trainer-about`, {
          params: {
            domainId: domainId || 0,
            courseId: courseId || 0,
          },
        });

        if (mounted && res.data) {
          const rawData = res.data;
          // Parse socialLinks safely
          if (typeof rawData.socialLinks === "string") {
            try {
              rawData.socialLinks = JSON.parse(rawData.socialLinks);
            } catch {
              rawData.socialLinks = [];
            }
          }
          setData(rawData);
        }
      } catch (error) {
        console.error("TrainerAbout Fetch Error:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [domainId, courseId]);

  // Prevent component from disappearing: 
  // Only show nothing if we have NO data AND we are not loading.
  if (!data && !loading) return null;
  
  // Show a spacer if we have absolutely no data yet (first load)
  if (!data) return <div className="h-40" />;

  return (
    <motion.section
      key={`${domainId}-${courseId}`} // Forces clean animation on ID change
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full py-20 px-4 md:px-20"
      style={{ backgroundColor: COLORS.white }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* LEFT CONTENT */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-10" style={{ background: COLORS.gold }} />
            <span className="text-sm uppercase tracking-wider text-gray-500">{data.label}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: COLORS.darkGreen }}>
            {data.heading}
          </h2>
          <p className="text-gray-600 mb-4">{data.description1}</p>
          {data.description2 && <p className="text-gray-600 mb-6">{data.description2}</p>}

          {/* SOCIAL LINKS */}
          <div className="flex gap-4 mt-6">
            {data.socialLinks?.map((link: any, i: number) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                 className="w-11 h-11 rounded-full flex items-center justify-center transition hover:scale-110 shadow-md"
                 style={{ backgroundColor: COLORS.gold, color: COLORS.darkGreen }}>
                <Globe size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl">
          <img src={`${API_BASE_URL}${data.mainImage}`} alt="Trainer" className="w-full h-[500px] object-cover" />
          <div className="absolute bottom-6 right-6 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2"
               style={{ backgroundColor: COLORS.darkGreen, color: COLORS.gold }}>
            <Globe size={16} /> Official Profile
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default TrainerAbout;