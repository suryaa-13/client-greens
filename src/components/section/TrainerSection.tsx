import React from "react";
import { motion } from "framer-motion";

// --- Configuration ---
const COLORS = {
  darkGreen: "#01311F",
  gold: "#B99A49",
  cream: "#F0ECE3",
  white: "#FFFFFF",
};

// Placeholder image for the trainer - replace with actual image
const trainerImageStr = "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const TrainerSection: React.FC = () => {
  return (
    <section className="relative w-full py-24 px-6 md:px-20 overflow-hidden" style={{ backgroundColor: COLORS.cream }}>
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 md:gap-20">
        
        {/* === LEFT COLUMN: TRAINER ABOUT TEXT (From Wireframe's square block) === */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-1/2 flex flex-col justify-center"
        >
          {/* Small Accent Header */}
          <h4 className="text-lg font-bold uppercase tracking-widest mb-4" style={{ color: COLORS.gold }}>
            Meet Your Mentor
          </h4>
          
          {/* Main Name Heading */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: COLORS.darkGreen }}>
            Vikram Singh
          </h2>
          
          {/* Role/Credentials */}
          <h3 className="text-xl md:text-2xl font-semibold mb-8 opacity-90" style={{ color: COLORS.darkGreen }}>
            Senior AWS Solutions Architect & Ex-Amazon
          </h3>

          {/* Bio Paragraphs */}
          <div className="space-y-6 text-lg leading-relaxed opacity-80" style={{ color: COLORS.darkGreen }}>
            <p>
              With over 12 years of industry experience architecting scalable cloud solutions for Fortune 500 companies, Vikram brings real-world expertise directly to the classroom.
            </p>
            <p>
              He is passionate about bridging the gap between theoretical knowledge and practical application. Having trained over 2,000+ students, his teaching methodology focuses on hands-on labs, live industry projects, and decoding complex interview scenarios.
            </p>
          </div>

          {/* Signature/Credentials Block */}
          <div className="mt-10 flex items-center gap-4">
            <div className="h-1 w-12" style={{ backgroundColor: COLORS.gold }}></div>
            <span className="font-bold italic" style={{ color: COLORS.darkGreen }}>8x AWS Certified Prof.</span>
          </div>
        </motion.div>


        {/* === RIGHT COLUMN: CIRCULAR IMAGE (From Wireframe's circles) === */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full md:w-1/2 flex justify-center items-center relative"
        >
          {/* The Outer Gold Circle Frame */}
          <div 
            className="w-80 h-80 md:w-[450px] md:h-[450px] rounded-full flex items-center justify-center shadow-2xl relative z-10"
            style={{ 
                backgroundColor: COLORS.gold,
                // Optional: Add a subtle gradient for more depth
                background: `linear-gradient(135deg, ${COLORS.gold}, #D4B86A)`
            }}
          >
            {/* The Inner Image Circle */}
            <img 
              src={trainerImageStr} 
              alt="Mentor Vikram Singh" 
              className="w-72 h-72 md:w-[410px] md:h-[410px] rounded-full object-cover border-4"
              style={{ borderColor: COLORS.cream }}
            />
          </div>

          {/* Decorative Background Element (Optional subtle glow) */}
          <div className="absolute w-full h-full bg-gold opacity-20 blur-3xl rounded-full -z-10 transform scale-110"></div>
        </motion.div>

      </div>
    </section>
  );
};

export default TrainerSection;