import React, { useState } from "react";
import axios from "axios";

// --- Configuration ---
const COLORS = {
  darkGreen: "#01311F",
  gold: "#B99A49",
  cream: "#F0ECE3",
  white: "#FFFFFF",
};

// Use your environment variable or fallback to localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      // Sending request to the backend with mode: CLIENT_GENERAL
      const response = await axios.post(`${API_BASE_URL}/api/mail/process`, {
        mode: "CLIENT_GENERAL",
        email: email,
      });

      if (response.data.success) {
        setStatus("success");
        setMessage("Thank you for subscribing!");
        setEmail(""); // Reset input
      }
    } catch (err: any) {
      console.error("Subscription Error:", err);
      setStatus("error");
      setMessage(err.response?.data?.message || "Failed to subscribe. Please try again.");
    } finally {
      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    }
  };

  return (
    <footer 
      className="relative w-full pt-16 pb-8 px-6 md:px-20 overflow-hidden" 
      style={{ backgroundColor: COLORS.darkGreen, color: COLORS.cream }}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* === TOP CONTENT GRID === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl" style={{ backgroundColor: COLORS.gold, color: COLORS.darkGreen }}>
                G
              </div>
              <h2 className="text-2xl font-bold tracking-wide">Greens Tech</h2>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Empowering students with industry-ready skills. Join the top-rated software training institute in Chennai and kickstart your tech career today.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6" style={{ color: COLORS.gold }}>Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {['Home', 'About Us', 'Success Stories', 'Corporate Training', 'Contact Us'].map((link) => (
                <li key={link}>
                  <a href="#" className="opacity-80 hover:opacity-100 hover:text-[#B99A49] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Popular Courses */}
          <div>
            <h3 className="text-lg font-bold mb-6" style={{ color: COLORS.gold }}>Trending Courses</h3>
            <ul className="space-y-3 text-sm">
              {['AWS Solution Architect', 'Full Stack Development', 'Data Science & AI', 'Selenium Automation', 'Python Masterclass'].map((course) => (
                <li key={course}>
                  <a href="#" className="opacity-80 hover:opacity-100 hover:text-[#B99A49] transition-colors">
                    {course}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6" style={{ color: COLORS.gold }}>Stay Updated</h3>
            <p className="text-sm opacity-80 mb-4">
              Subscribe to get the latest course updates and career tips.
            </p>
            <form className="flex flex-col gap-3" onSubmit={handleSubscribe}>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading" || status === "success"}
                  placeholder="Enter your email" 
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-[#B99A49] text-white placeholder-white/50 transition-all disabled:opacity-50"
                />
              </div>
              <button 
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="w-full py-3 rounded-lg font-bold transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: status === "success" ? "#22C55E" : COLORS.gold, 
                  color: status === "success" ? "#FFFFFF" : COLORS.darkGreen 
                }}
              >
                {status === "loading" ? "Processing..." : status === "success" ? "Subscribed! ✨" : "Subscribe"}
              </button>
              
              {/* Feedback Messages */}
              {message && (
                <p className={`text-xs mt-2 ${status === "error" ? "text-red-400" : "text-[#B99A49]"}`}>
                  {message}
                </p>
              )}
            </form>
          </div>

        </div>

        {/* === DIVIDER === */}
        <div className="w-full h-px bg-white/10 mb-8"></div>

        {/* === BOTTOM BAR === */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs opacity-60">
          <p>© 2026 Greens Technology. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#B99A49] transition">Privacy Policy</a>
            <a href="#" className="hover:text-[#B99A49] transition">Terms of Service</a>
            <a href="#" className="hover:text-[#B99A49] transition">Sitemap</a>
          </div>
        </div>

      </div>

      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#B99A49] opacity-5 blur-[100px] pointer-events-none"></div>

    </footer>
  );
};

export default Footer;