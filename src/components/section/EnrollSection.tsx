import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const COLORS = {
  darkGreen: "#01311F",
  gold: "#B99A49",
  cream: "#F0ECE3",
  white: "#FFFFFF",
};

/* ---------------- TYPES ---------------- */
interface EnrollCard {
  id: number;
  title: string;
  image: string;
  order: number;
}

interface Domain {
  id: number;
  domain: string;
  domainId: number;
}

interface Course {
  id: number;
  domainId: number;
  title: string;
  courseId: number;
}

const EnrollSection: React.FC = () => {
  const { domainId } = useParams();

  const [domains, setDomains] = useState<Domain[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [cards, setCards] = useState<EnrollCard[]>([]);

  const [selectedDomainId, setSelectedDomainId] = useState<number>(
    Number(domainId) || 0
  );
  const [selectedCourseId, setSelectedCourseId] = useState<number>(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  /* FORM */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- FETCH DOMAINS ---------------- */
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/domain`)
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        setDomains(list);
      })
      .catch(() => setDomains([]));
  }, []);

  /* ---------------- FETCH COURSES ---------------- */
  useEffect(() => {
    if (!selectedDomainId) {
      setCourses([]);
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/courses`, {
        params: { domainId: selectedDomainId },
      })
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        setCourses(list);
      })
      .catch(() => setCourses([]));
  }, [selectedDomainId]);

  /* ---------------- FETCH ENROLL CARDS ---------------- */
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/enroll-cards`, {
        params: {
          domainId: selectedDomainId || 0,
          courseId: selectedCourseId || 0,
        },
      })
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        setCards(list);
        setActiveIndex(0);
      })
      .catch(() => setCards([]));
  }, [selectedDomainId, selectedCourseId]);

  /* ---------------- CARD STACK LOGIC ---------------- */
  const sortedCards = useMemo(
    () => [...cards].sort((a, b) => a.order - b.order),
    [cards]
  );

  useEffect(() => {
    if (!sortedCards.length || paused) return;
    const timer = setInterval(
      () => setActiveIndex((i) => (i + 1) % sortedCards.length),
      4000
    );
    return () => clearInterval(timer);
  }, [sortedCards, paused]);

  /* ---------------- FORM SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedDomainId) {
      return alert("Please select a Domain");
    }

    setLoading(true);

    try {
      // Sending as JSON since there is no file upload
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        domainId: selectedDomainId,
        courseId: selectedCourseId !== 0 ? selectedCourseId : null,
      };

      await axios.post(`${API_BASE_URL}/api/enrollments/request`, payload);
      
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "" });
      setSelectedCourseId(0);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen py-12 px-6 lg:py-24 bg-[#fbfaf8] overflow-hidden">
      {/* Background Slant */}
      <div
        className="absolute inset-0 bg-[#01311F] h-[50%] lg:h-[45%]"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 100%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* LEFT SIDE: Heading & Stack */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-[#F0ECE3]"
            >
              Start Your <span className="text-[#B99A49]">Journey.</span>
            </motion.h2>
            <p className="text-[#F0ECE3]/70 text-lg max-w-md mx-auto lg:mx-0">
              Join thousands of students mastering new domains with our specialized curriculum.
            </p>
          </div>

          <div
            className="relative w-[280px] h-[380px] md:w-[320px] md:h-[440px] mt-8"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {sortedCards.length ? (
              sortedCards.map((card, index) => {
                const pos = (index - activeIndex + sortedCards.length) % sortedCards.length;
                return <AnimatedStackCard key={card.id} card={card} position={pos} />;
              })
            ) : (
              <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-[#F0ECE3]/30 rounded-[2.5rem] text-[#F0ECE3]/50">
                Loading previews...
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Enrollment Form */}
        <div className="w-full lg:w-[480px]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-[#01311F] p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/5"
          >
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Enroll Now</h3>
                <div className="h-1 w-12 bg-[#B99A49] rounded-full" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                icon={<FiUser />}
                placeholder="Full Name"
                value={formData.name}
                onChange={(v: string) => setFormData({ ...formData, name: v })}
              />

              <Input
                icon={<FiMail />}
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(v: string) => setFormData({ ...formData, email: v })}
              />

              <Input
                icon={<FiPhone />}
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(v: string) => setFormData({ ...formData, phone: v })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Domain"
                  value={selectedDomainId}
                  options={domains.map((d) => ({ label: d.domain, value: d.domainId }))}
                  onChange={(v: string) => {
                    setSelectedDomainId(+v);
                    setSelectedCourseId(0);
                  }}
                />

                <Select
                  label={selectedDomainId !== 0 && courses.length === 0 ? "Not Available" : "Course"}
                  value={selectedCourseId}
                  options={courses.map((c) => ({ label: c.title, value: c.courseId }))}
                  onChange={(v: string) => setSelectedCourseId(+v)}
                  disabled={!courses.length}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all disabled:opacity-50"
                style={{
                  backgroundColor: COLORS.gold,
                  color: COLORS.darkGreen,
                }}
              >
                {loading ? "Processing..." : "Submit Application"}
              </motion.button>

              <AnimatePresence>
                {success && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 text-green-400 font-medium">
                    <FiCheckCircle /> <span>Application Submitted Successfully!</span>
                  </motion.div>
                )}
                {error && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 text-red-400 font-medium">
                    <FiAlertCircle /> <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ---------------- HELPERS ---------------- */

const Input = ({ onChange, icon, ...props }: any) => (
  <div className="relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#01311F]/50 text-lg">
      {icon}
    </div>
    <input
      {...props}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-[#F0ECE3] text-[#01311F] placeholder:text-[#01311F]/40 outline-none focus:ring-2 ring-[#B99A49]/50 transition-all"
    />
  </div>
);

const Select = ({ options, label, onChange, ...props }: any) => (
  <div className="relative">
    <select
      {...props}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3.5 rounded-2xl bg-[#F0ECE3] text-[#01311F] font-medium outline-none focus:ring-2 ring-[#B99A49]/50 transition-all disabled:opacity-50 appearance-none pr-10"
    >
      <option value="0">{label}</option>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
       <svg className="w-4 h-4 text-[#01311F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
       </svg>
    </div>
  </div>
);

const AnimatedStackCard = ({ card, position }: any) => {
  const variants: any = {
    0: { x: 0, y: 0, scale: 1, zIndex: 30, opacity: 1, rotate: 0 },
    1: { x: 20, y: 20, scale: 0.92, zIndex: 20, opacity: 0.6, rotate: 2, filter: "blur(1px)" },
    2: { x: 40, y: 40, scale: 0.85, zIndex: 10, opacity: 0.3, rotate: 4, filter: "blur(2px)" },
  };

  return (
    <motion.div
      initial={false}
      animate={variants[position] || { opacity: 0, x: 60 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border-4 border-white"
    >
      <img
        src={`${API_BASE_URL}${card.image}`}
        alt={card.title}
        className="w-full h-full object-cover"
      />
      {position > 0 && <div className="absolute inset-0 bg-[#01311F]/20" />}
    </motion.div>
  );
};

export default EnrollSection;