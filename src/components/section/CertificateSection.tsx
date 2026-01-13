import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
interface CertificateStep {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface CertificateData {
  sectionTitle: string;
  steps: CertificateStep[];
  certificateImage: string;
}

/* ---------------- COMPONENT ---------------- */
const CertificateSection: React.FC = () => {
  const { domainId, courseId } = usePageContext();
  const [data, setData] = useState<CertificateData | null>(null);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    // 🚫 FULL GUARD: landing page + undefined context
    const shouldSkip =
      domainId == null ||
      courseId == null ||
      (domainId === 0 && courseId === 0);

    if (shouldSkip) {
      setData(null);
      return;
    }

    let isMounted = true;

    const fetchCertificate = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/certificate`, {
          params: { domainId, courseId },
        });

        if (isMounted) {
          setData(res.data);
        }
      } catch {
        // Expected for domains without certificate
        if (isMounted) setData(null);
      }
    };

    fetchCertificate();

    return () => {
      isMounted = false;
    };
  }, [domainId, courseId]);

  /* ---------------- SAFE GUARD ---------------- */
  if (!data || !data.steps?.length) return null;

  /* ---------------- UI ---------------- */
  return (
    <section
      className="relative w-full py-20 px-6 md:px-20 overflow-hidden"
      style={{ backgroundColor: COLORS.white }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: COLORS.darkGreen }}
          >
            {data.sectionTitle}
          </h2>
          <div
            className="w-24 h-1.5 mx-auto rounded-full"
            style={{ backgroundColor: COLORS.gold }}
          />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* LEFT: STEPS */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            {data.steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="p-6 rounded-2xl shadow-md flex items-start gap-5 hover:-translate-y-1 transition-transform"
                style={{ backgroundColor: COLORS.cream }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm"
                  style={{
                    backgroundColor: COLORS.gold,
                    color: COLORS.darkGreen,
                  }}
                >
                  {step.icon}
                </div>

                <div>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: COLORS.darkGreen }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-sm md:text-base leading-relaxed opacity-80"
                    style={{ color: COLORS.darkGreen }}
                  >
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* RIGHT: CERTIFICATE IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/2 relative"
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full blur-3xl opacity-20"
              style={{ backgroundColor: COLORS.gold }}
            />

            <div
              className="relative z-10 p-2 rounded-xl border-4 shadow-2xl bg-white overflow-hidden"
              style={{ borderColor: COLORS.gold }}
            >
              <img
                src={`${API_BASE_URL}${data.certificateImage}`}
                alt="Course Certificate"
                className="w-full h-auto min-h-[300px] rounded-lg object-cover bg-gray-100"
              />

              <div
                className="absolute bottom-6 right-6 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm"
                style={{
                  backgroundColor: COLORS.darkGreen,
                  color: COLORS.gold,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Verified
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CertificateSection;
