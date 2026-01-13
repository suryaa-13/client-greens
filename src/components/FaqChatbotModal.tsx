import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

/* ---------------- TYPES ---------------- */
interface ColorScheme {
  cream: string;
  darkGreen: string;
  gold: string;
  white: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  colors: ColorScheme;
}

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

/* ---------------- CONFIG ---------------- */
const API_BASE_URL = "http://localhost:5000/api";

/* ---------------- COMPONENT ---------------- */
const FaqChatbotModal = ({ isOpen, onClose, colors }: Props) => {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [questions, setQuestions] = useState<FaqItem[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  /* ---------- AUTO SCROLL ---------- */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------- FETCH FAQ BY STEP ---------- */
  useEffect(() => {
    if (!isOpen) return;

    const fetchFaqs = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/faq-chat?step=${step}`
        );
        setQuestions(res.data);
      } catch (error) {
        console.error("FAQ fetch error", error);
      }
    };

    fetchFaqs();
  }, [step, isOpen]);

  if (!isOpen) return null;

  /* ---------- HANDLE CLICK ---------- */
  const handleQuestionClick = (q: string, a: string) => {
    setMessages(prev => [
      ...prev,
      { sender: "user", text: q },
      { sender: "bot", text: a }
    ]);

    setQuestions([]); // clear current options

    if (step < 2) {
      setStep(prev => prev + 1);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="fixed right-6 bottom-6 z-[9999]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-[420px] h-[600px] rounded-2xl shadow-2xl flex flex-col"
        style={{ backgroundColor: colors.cream }}
      >
        {/* Header */}
        <div
          className="px-4 py-3 flex justify-between items-center rounded-t-2xl"
          style={{ backgroundColor: colors.darkGreen, color: colors.cream }}
        >
          <h3 className="font-bold">🤖 Green Tech Assistant</h3>
          <button onClick={onClose}>✖</button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                msg.sender === "user" ? "ml-auto" : "mr-auto"
              }`}
              style={{
                backgroundColor:
                  msg.sender === "user"
                    ? colors.gold
                    : colors.white
              }}
            >
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Question Options */}
        {questions.length > 0 && (
          <div className="border-t p-3 space-y-2">
            {questions.map(item => (
              <button
                key={item.id}
                onClick={() =>
                  handleQuestionClick(item.question, item.answer)
                }
                className="w-full text-left px-3 py-2 rounded-lg border text-sm hover:opacity-80"
                style={{ borderColor: colors.gold }}
              >
                {item.question}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FaqChatbotModal;
