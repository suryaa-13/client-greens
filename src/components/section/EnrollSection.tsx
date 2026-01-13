import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiUpload, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

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
  image: string;
}

interface Course {
  id: number;
  domainId: number;
  title: string;
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

  /* ---------------- FETCH DOMAINS (Hardcoded as Courses) ---------------- */
  useEffect(() => {
    // Hardcoded list per user request
    const HARDCODED_COURSES = [
      { id: 1, domain: "AWS Solu Arch Associate", domainId: 1, image: "https://placehold.co/600x800/01311F/F0ECE3?text=AWS+SAA" },
      { id: 2, domain: "Azure Administrator", domainId: 2, image: "https://placehold.co/600x800/01311F/F0ECE3?text=Azure+Admin" },
      { id: 3, domain: "Aws DevOps", domainId: 3, image: "https://placehold.co/600x800/01311F/F0ECE3?text=AWS+DevOps" },
      { id: 4, domain: "Azure DevOps", domainId: 4, image: "https://placehold.co/600x800/01311F/F0ECE3?text=Azure+DevOps" },
      { id: 5, domain: "AWS with Terraform", domainId: 5, image: "https://placehold.co/600x800/01311F/F0ECE3?text=AWS+Terraform" },
      { id: 6, domain: "K8S Admin", domainId: 6, image: "https://placehold.co/600x800/01311F/F0ECE3?text=K8S+Admin" },
      { id: 7, domain: "Terraform Associate", domainId: 7, image: "https://placehold.co/600x800/01311F/F0ECE3?text=Terraform" },
      { id: 8, domain: "RedHat Linux", domainId: 8, image: "https://placehold.co/600x800/01311F/F0ECE3?text=RedHat+Linux" },
    ];
    setDomains(HARDCODED_COURSES);
  }, []);

  /* ---------------- FETCH COURSES ---------------- */
  useEffect(() => {
    const idToQuery = Number(selectedDomainId);

    // Stop if ID is invalid, but allow 0 if it's a valid "Landing" domain
    if (isNaN(idToQuery)) {
      setCourses([]);
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/courses`, {
        params: { domainId: idToQuery },
      })
      .then((res) => {
        // Handle array vs object response
        const data = res.data?.data || res.data;
        const list = Array.isArray(data) ? data : [];

        console.log("Updating Course State with:", list);
        setCourses(list);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setCourses([]);
      });
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
        console.log("cards list", cards);

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

    // 1. Domain is MANDATORY
    if (!selectedDomainId || selectedDomainId === 0) {
      return alert("Please select a Domain");
    }

    // 2. Course is OPTIONAL (We don't return alert if it's missing)
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      domainId: selectedDomainId,
      // If selectedCourseId is 0, we send null or 0 depending on what your API prefers
      courseId: selectedCourseId !== 0 ? selectedCourseId : null,
    };

    setLoading(true);

    try {
      // Sending as JSON for a cleaner request
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
    <section className="relative w-full h-auto py-6 px-4 lg:py-10 bg-[#fbfaf8] overflow-hidden">
      {/* Background Slant */}
      <div
        className="absolute inset-0 bg-[#01311F] h-[50%] lg:h-[45%]"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 100%)" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">

        {/* LEFT SIDE: Heading & Stack */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl lg:text-4xl font-black text-[#F0ECE3]"
            >
              Start Your <span className="text-[#B99A49]">Journey.</span>
            </motion.h2>
            <p className="text-[#F0ECE3]/70 text-sm md:text-base max-w-md mx-auto lg:mx-0">
              Join thousands of students mastering new domains with our specialized curriculum.
            </p>
          </div>

          <div
            className="relative w-[200px] h-[280px] md:w-[240px] md:h-[320px] mt-4 lg:ml-12"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* 1. If a Course (Domain) is selected, show its image */}
            {selectedDomainId !== 0 ? (
              (() => {
                const selectedCourse = domains.find(d => d.domainId === selectedDomainId);
                if (selectedCourse) {
                  return (
                    <motion.div
                      key="selected-course-image"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border-4 border-white"
                    >
                      <img
                        src={selectedCourse.image}
                        alt={selectedCourse.domain}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  );
                }
                return null;
              })()
            ) : (
              /* 2. Else show the card stack or loading state */
              sortedCards.length ? (
                sortedCards.map((card, index) => {
                  const pos = (index - activeIndex + sortedCards.length) % sortedCards.length;
                  return <AnimatedStackCard key={card.id} card={card} position={pos} />;
                })
              ) : (
                <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-[#F0ECE3]/30 rounded-[2.5rem] text-[#F0ECE3]/50">
                  Loading previews...
                </div>
              )
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Enrollment Form */}
        <div className="w-full lg:w-[360px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-[#01311F] p-6 rounded-[1.5rem] shadow-2xl border border-white/5"
          >
            <div className="mb-5">
              <h3 className="text-xl font-bold text-white mb-1">Enroll Now</h3>
              <div className="h-1 w-12 bg-[#B99A49] rounded-full" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input components usually expect a string 'v' */}
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

              <div className={`grid grid-cols-1 ${courses.length > 0 ? "md:grid-cols-2" : ""} gap-4`}>
                <Select
                  label="Courses"
                  value={selectedDomainId}
                  options={domains.map((d) => ({ label: d.domain, value: d.domainId }))}
                  onChange={(v: string | number) => {
                    setSelectedDomainId(Number(v));
                    setSelectedCourseId(0); // Reset course when domain changes
                  }}
                />

                {courses.length > 0 && (
                  <Select
                    label="Select Course"
                    value={selectedCourseId}
                    options={courses.map((c) => ({ label: c.title, value: c.id }))}
                    onChange={(v: string | number) => setSelectedCourseId(Number(v))}
                  />
                )}
              </div>



              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-base shadow-lg transition-all disabled:opacity-50"
                style={{
                  backgroundColor: COLORS.gold,
                  color: COLORS.darkGreen,
                }}
              >
                {loading ? "Processing..." : "Submit Application"}
              </motion.button>

              {/* Error/Success messages remain the same */}
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
      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F0ECE3] text-[#01311F] text-sm placeholder:text-[#01311F]/40 outline-none focus:ring-2 ring-[#B99A49]/50 transition-all"
    />
  </div>
);

const Select = ({ options, label, onChange, value, ...props }: any) => (
  <div className="relative">
    <select
      {...props}
      value={value} // This allows the "Course" to reset to 0 (the label)
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl bg-[#F0ECE3] text-[#01311F] font-medium text-sm outline-none focus:ring-2 ring-[#B99A49]/50 transition-all disabled:opacity-40 appearance-none"
      style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2301311F\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 1rem center',
        backgroundSize: '1.2em'
      }}
    >
      <option value="0">{label}</option>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
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
      {/* Subtle overlay to card when in back */}
      {position > 0 && <div className="absolute inset-0 bg-[#01311F]/20" />}
    </motion.div>
  );
};

export default EnrollSection;


