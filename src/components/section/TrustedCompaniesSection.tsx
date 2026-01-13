import React from "react";
import { motion } from "framer-motion";

// --- Configuration ---
const COLORS = {
  darkGreen: "#01311F",
  gold: "#B99A49",
  cream: "#F0ECE3",
  white: "#FFFFFF",
};

// --- COMPANY DATA ---
const companies = [
  { 
    name: "Amazon Web Services", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1024px-Amazon_Web_Services_Logo.svg.png" 
  },
  { 
    name: "Google Cloud", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/1024px-Google_Cloud_logo.svg.png" 
  },
  { 
    name: "Microsoft Azure", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Microsoft_Azure.svg/1024px-Microsoft_Azure.svg.png" 
  },
  { 
    name: "TCS", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/1024px-Tata_Consultancy_Services_Logo.svg.png" 
  },
  { 
    name: "Infosys", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/1024px-Infosys_logo.svg.png" 
  },
  { 
    name: "Wipro", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/1024px-Wipro_Primary_Logo_Color_RGB.svg.png" 
  },
  { 
    name: "Accenture", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/1024px-Accenture.svg.png" 
  },
  { 
    name: "Capgemini", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Capgemini_201x_logo.svg/1024px-Capgemini_201x_logo.svg.png" 
  },
];

const TrustedCompaniesSection: React.FC = () => {
  // Duplicating list for seamless infinite scroll
  const marqueeList = [...companies, ...companies, ...companies, ...companies];

  return (
    <section 
      className="relative w-full py-20 overflow-hidden" 
      style={{ backgroundColor: COLORS.cream }}
    >
      
      {/* Header */}
      <div className="text-center mb-16 px-6 relative z-30">
        <h3 className="text-lg md:text-xl font-bold uppercase tracking-widest opacity-90" style={{ color: COLORS.darkGreen }}>
          Trusted by Global Leaders
        </h3>
        <div className="w-20 h-1 mx-auto mt-3 rounded-full" style={{ backgroundColor: COLORS.gold }}></div>
      </div>

      {/* === MARQUEE CONTAINER === */}
      <div className="flex flex-col gap-12 relative z-10">
        
        {/* --- ROW 1: Running Left to Right (->) --- */}
        <div className="relative flex overflow-hidden py-2">
          <motion.div
            className="flex gap-16 md:gap-24 items-center whitespace-nowrap pr-16"
            animate={{ x: ["-25%", "0%"] }} 
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
          >
            {marqueeList.map((company, index) => (
              <CompanyLogo key={`r1-${index}`} name={company.name} logoUrl={company.logo} />
            ))}
          </motion.div>
        </div>

        {/* --- ROW 2: Running Right to Left (<-) --- */}
        <div className="relative flex overflow-hidden py-2">
          <motion.div
            className="flex gap-16 md:gap-24 items-center whitespace-nowrap pr-16"
            animate={{ x: ["0%", "-25%"] }} 
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40, 
                ease: "linear",
              },
            }}
          >
             {marqueeList.map((company, index) => (
              <CompanyLogo key={`r2-${index}`} name={company.name} logoUrl={company.logo} />
            ))}
          </motion.div>
        </div>

      </div>

      {/* === FADE OVERLAYS === */}
      {/* Left Fade */}
      <div 
        className="absolute inset-y-0 left-0 w-40 z-20 pointer-events-none"
        style={{ background: `linear-gradient(to right, ${COLORS.cream} 0%, transparent 100%)` }} 
      ></div>
      
      {/* Right Fade */}
      <div 
        className="absolute inset-y-0 right-0 w-40 z-20 pointer-events-none"
        style={{ background: `linear-gradient(to left, ${COLORS.cream} 0%, transparent 100%)` }}
      ></div>

    </section>
  );
};

// --- Updated Helper Component ---
const CompanyLogo = ({ name, logoUrl }: { name: string, logoUrl: string }) => (
  <div 
    // REMOVED: grayscale, opacity-60, hover:grayscale-0
    // KEPT: flex centering and a slight scale on hover for interactivity
    className="flex-shrink-0 flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110"
  >
    <img 
        src={logoUrl} 
        alt={`${name} Logo`} 
        className="h-10 md:h-14 w-auto object-contain"
    />
  </div>
);

export default TrustedCompaniesSection;