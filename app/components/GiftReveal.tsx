"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ReactConfetti from "react-confetti";
import { Heart, PawPrint } from "lucide-react";

interface GiftRevealProps {
  name: string;
  message: string;
  certificate: string;
}

export default function GiftReveal({ name, message, certificate }: GiftRevealProps) {
  const [windowSize] = useState(() =>
    typeof window !== "undefined"
      ? { w: window.innerWidth, h: window.innerHeight }
      : { w: 400, h: 800 }
  );
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100, 50, 200]);
    }
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-y-auto px-4 py-10">
      {showConfetti && (
        <ReactConfetti
          width={windowSize.w}
          height={windowSize.h}
          recycle={false}
          numberOfPieces={300}
          colors={["#f2a9b8", "#c5b3e6", "#a8d5a2", "#fce4ec", "#ede7f6", "#FFD700"]}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.3 }}
        className="w-full max-w-md text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6 flex items-center justify-center gap-2 text-pink"
        >
          <Heart size={24} fill="currentColor" />
          <span className="text-2xl font-bold">С 8 Марта!</span>
          <Heart size={24} fill="currentColor" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-2xl bg-card p-6 shadow-lg"
        >
          <p className="mb-1 text-sm text-muted">Для тебя, {name} 💐</p>
          <div className="my-4 rounded-xl bg-lavender-light p-4">
            <p className="whitespace-pre-wrap text-foreground">{message}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
          className="mt-6 rounded-2xl border-2 border-dashed border-pink bg-pink-light p-6 shadow-md"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-pink-dark">
            🎁 Твой подарок
          </p>
          <p className="text-xl font-bold text-foreground">{certificate}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-8 flex items-center justify-center gap-1 text-sm text-muted"
        >
          <PawPrint size={14} />
          <span>Доставлено с любовью от КотоПочты</span>
          <PawPrint size={14} />
        </motion.div>
      </motion.div>
    </div>
  );
}
