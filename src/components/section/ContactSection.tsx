/* eslint-disable no-irregular-whitespace */
import React from "react";
import { motion } from "framer-motion";

// --- Configuration ---
const COLORS = {
  darkGreen: "#01311F",
  gold: "#B99A49",
  cream: "#F0ECE3",
  white: "#FFFFFF",
};

const ContactSection: React.FC = () => {
  return (
    <section className="relative w-full py-20 px-6 md:px-20 overflow-hidden" style={{ backgroundColor: COLORS.white }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: COLORS.darkGreen }}>
            Get in Touch
          </h2>
          <div className="w-20 h-1.5 mx-auto rounded-full" style={{ backgroundColor: COLORS.gold }}></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 h-full">
          
          {/* === LEFT COLUMN: MAP (Matches the large box in wireframe) === */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-3/5 relative min-h-[400px] lg:h-auto rounded-3xl p-4 shadow-xl"
            style={{ backgroundColor: COLORS.gold }} // Gold border effect
          >
            <div className="w-full h-full rounded-2xl overflow-hidden bg-gray-200 border-2 border-white/20">
              {/* Google Map Embed */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.625686034842!2d80.24076337507647!3d12.995775987321853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52678767936a2f%3A0xc02381e4b8686d63!2sGreens%20Technology!5e0!3m2!1sen!2sin!4v1709654321000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: "400px" }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Greens Technology Location"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
          </motion.div>


          {/* === RIGHT COLUMN: STACKED DETAILS (Matches the 3 boxes in wireframe) === */}
          <div className="w-full lg:w-2/5 flex flex-col gap-6">
            
            {/* 1. Contact Info Card (Dark Green) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex-1 p-8 rounded-2xl shadow-lg flex flex-col justify-center gap-4"
              style={{ backgroundColor: COLORS.darkGreen }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-white/10 text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                   <h3 className="text-lg font-bold text-white">Call Us</h3>
                   <p className="text-gray-300 hover:text-white transition">+91 89399 15577</p>
                   <p className="text-gray-300 hover:text-white transition">+91 89399 25577</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-white/10 text-white">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                   <h3 className="text-lg font-bold text-white">Email Us</h3>
                   <p className="text-gray-300 hover:text-white transition">contact@greenstechnology.com</p>
                </div>
              </div>
            </motion.div>

            {/* 2. Opening Hours Card (Gold - Matches the yellow box in wireframe) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="p-8 rounded-2xl shadow-lg flex items-center justify-between"
              style={{ backgroundColor: COLORS.gold }}
            >
               <div>
                  <h3 className="text-xl font-bold mb-1" style={{ color: COLORS.darkGreen }}>Office Hours</h3>
                  <p className="text-sm font-semibold opacity-90" style={{ color: COLORS.darkGreen }}>Mon - Sat: 9:00 AM - 7:00 PM</p>
                  <p className="text-sm font-semibold opacity-80" style={{ color: COLORS.darkGreen }}>Sunday: Closed</p>
               </div>
               <div className="p-3 bg-white/20 rounded-full">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={COLORS.darkGreen} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
               </div>
            </motion.div>

            {/* 3. Social Media / Branch Card (Dark Green) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex-1 p-8 rounded-2xl shadow-lg flex flex-col justify-center"
              style={{ backgroundColor: COLORS.darkGreen }}
            >
               <h3 className="text-lg font-bold text-white mb-4">Connect With Us</h3>
               <div className="flex gap-4">
                  {/* FIX: Replaced 'social' with '_' to avoid TS6133 'declared but its value is never read' error */}
                  {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map((_, i) => (
                    <button 
                      key={i}
                      className="p-3 rounded-full bg-white/10 hover:bg-[#B99A49] hover:text-[#01311F] text-white transition-all duration-300"
                    >
                      {/* Generic Social Icon for demo */}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </button>
                  ))}
               </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;