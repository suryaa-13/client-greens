import { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";

/* ---------------- CONFIG ---------------- */
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const Navbar = () => {
  const [notices, setNotices] = useState<string[]>([]);

  /* ---------------- FETCH NOTICES ---------------- */

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/notices`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setNotices(res.data.filter((n): n is string => typeof n === "string"));
        } else {
          setNotices([]);
        }
      })
      .catch(() => setNotices([]));
  }, []);

  const marqueeText =
    notices.length > 0
      ? notices.join(" | ")
      : "Welcome to our official website";

  return (
    <>
      {/* TOP NAVBAR */}
      <div className="w-full bg-[#01311F] text-[#F0ECE3] h-16 flex items-center px-4 md:px-6 justify-between">

        {/* LOGO */}
        <div className="shrink-0">
          <img
            src={logo}
            alt="Greens Technology Logo"
            className="h-10 md:h-12 w-auto"
          />
        </div>

        {/* MARQUEE (DESKTOP) */}
        <div className="hidden md:flex flex-1 mx-10 overflow-hidden whitespace-nowrap">
          <p className="animate-marquee text-sm md:text-base">
            {marqueeText}
          </p>
        </div>

        {/* CONTACT */}
        <div className="shrink-0">
          <a
            href="tel:+919876543210"
            className="text-xs md:text-base font-semibold hover:text-[#B99A49]"
          >
            📞 +91 98765 43210
          </a>
        </div>
      </div>

      {/* MARQUEE (MOBILE) */}
      <div className="md:hidden w-full bg-[#01311F] border-t border-white/10 text-[#F0ECE3] overflow-hidden py-2">
        <p className="animate-marquee text-sm whitespace-nowrap">
          {marqueeText}
        </p>
      </div>
    </>
  );
};

export default Navbar;
