/* eslint-disable no-irregular-whitespace */
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FaqChatbotModal from "../components/FaqChatbotModal";
import EnrollSection from "../components/section/EnrollSection";

/* ---------------- TYPES ---------------- */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors: typeof COLORS;
}

interface FloatingBtnProps {
  children: React.ReactNode;
  label: string;
  color: string;
  textColor: string;
  onClick: () => void;
}

/* ---------------- COLORS ---------------- */
const COLORS = {
  darkGreen: "#01311F",
  gold: "#B99A49",
  cream: "#F0ECE3",
  white: "#FFFFFF",
  gray: "#CCCCCC",
};

/* ---------------- ANIMATION VARIANTS ---------------- */

const dnaHelixVariants: Variants = {
  hidden: { opacity: 0, x: 20, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { delay: i * 0.1, type: "spring", stiffness: 260, damping: 20 },
  }),
  exit: { opacity: 0, x: 20, scale: 0.5, transition: { duration: 0.2 } },
};

const infinityEnquiryVariants: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } },
  hover: {
    scale: 1.05,
    transition: { duration: 0.3 },
  },
};

export const MainLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStackOpen, setIsStackOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleModal = () => setIsModalOpen((p) => !p);
  const toggleChat = () => {
    setIsChatbotOpen((p) => !p);
    setIsStackOpen(false);
  };
  const handleWhatsApp = () => {
    window.open("https://wa.me/8870295336", "_blank");
  };

  /* BLOCK BODY SCROLL WHEN MODAL OPEN */
  useEffect(() => {
    if (isModalOpen || isChatbotOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isModalOpen, isChatbotOpen]);

  useEffect(() => {
    const enrolListener = () => setIsModalOpen(true);
    window.addEventListener("open-enrolment", enrolListener);
    const timer = setTimeout(() => setIsModalOpen(true), 2000);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("open-enrolment", enrolListener);
    };
  }, []);

  return (
    <>
      {/* Global CSS for hiding scrollbars */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <main className="relative min-h-screen">
        <Outlet />
      </main>

      {/* FLOATING STACK */}
      <div className="fixed bottom-6 right-0 sm:bottom-10 sm:right-0 z-[60] flex flex-col items-end gap-3 sm:gap-4 pr-0 sm:pr-4">

        {/* SIDE BAR ENQUIRY */}
        <motion.div
          variants={infinityEnquiryVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          className="cursor-pointer rounded-l-xl sm:rounded-l-2xl border-l-2 sm:border-l-4 border-y-2 sm:border-y-4 border-white/20 shadow-xl"
          style={{ backgroundColor: COLORS.gold }}
          onClick={toggleModal}
        >
          <div
            className="py-4 px-1 sm:py-6 sm:px-2"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              color: COLORS.darkGreen,
            }}
          >
            <span className="font-bold tracking-widest text-[10px] sm:text-xs rotate-180">
              ENQUIRY FORM
            </span>
          </div>
        </motion.div>

        {/* STACK ITEMS */}
        <AnimatePresence>
          {isStackOpen && (
            <motion.div className="flex flex-col gap-3 sm:gap-4 items-end mr-4">
              <motion.div variants={dnaHelixVariants} custom={1} initial="hidden" animate="visible" exit="exit">
                <FloatingButton label="AI Chat" color={COLORS.cream} textColor={COLORS.darkGreen} onClick={toggleChat}>
                  💬
                </FloatingButton>
              </motion.div>

              <motion.div variants={dnaHelixVariants} custom={2} initial="hidden" animate="visible" exit="exit">
                <FloatingButton label="WhatsApp" color={COLORS.gold} textColor={COLORS.darkGreen} onClick={handleWhatsApp}>
                  📞
                </FloatingButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsStackOpen((p) => !p)}
          className="mr-4 p-3 sm:p-4 rounded-full shadow-2xl border border-gray-100"
          style={{ backgroundColor: COLORS.white, color: COLORS.darkGreen }}
        >
          <span className={`inline-block transition-transform duration-300 ${isStackOpen ? 'rotate-180' : ''}`}>
            ⬆
          </span>
        </motion.button>
      </div>

      <EnrollmentModal isOpen={isModalOpen} onClose={toggleModal} colors={COLORS} />

      <FaqChatbotModal
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        colors={COLORS}
      />

      <Footer />
    </>
  );
};

/* ---------------- FLOATING BUTTON ---------------- */

const FloatingButton = ({ children, label, color, textColor, onClick }: FloatingBtnProps) => (
  <div className="flex items-center gap-2 cursor-pointer group" onClick={onClick}>
    <span className="hidden sm:block bg-white px-3 py-1 rounded-md text-xs font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
      {label}
    </span>
    <span className="sm:hidden bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold shadow-sm">
      {label}
    </span>
    <div
      className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-xl text-lg sm:text-xl"
      style={{ backgroundColor: color, color: textColor }}
    >
      {children}
    </div>
  </div>
);

/* ---------------- ENROLLMENT MODAL ---------------- */

const EnrollmentModal: React.FC<ModalProps> = ({ isOpen, onClose, colors }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-4xl bg-transparent overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 sm:absolute sm:-top-2 sm:-right-2 p-3 sm:p-2 rounded-full z-[210] shadow-2xl transition-transform hover:scale-110"
          style={{ backgroundColor: colors.gold, color: colors.darkGreen }}
        >
          ✕
        </button>

        <div className="w-full h-full pt-12 sm:pt-0">
          <EnrollSection />
        </div>
      </motion.div>
    </div>
  );
};