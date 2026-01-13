import React from "react";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

const LoadingPage: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#01311F]">
      
      {/* LOGO */}
      <motion.img
        src={logo}
        alt="Greens Technology"
        className="w-36 mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* SPINNER */}
      <motion.div
        className="w-14 h-14 border-4 border-[#B99A49] border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      />

      {/* TEXT */}
      <motion.p
        className="mt-6 text-[#F0ECE3] tracking-widest text-sm uppercase"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Loading Experience...
      </motion.p>
    </div>
  );
};

export default LoadingPage;
