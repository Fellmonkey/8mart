"use client";

import { motion } from "framer-motion";
import { Gift, PawPrint } from "lucide-react";

interface GiftBoxProps {
  onOpen: () => void;
}

export default function GiftBox({ onOpen }: GiftBoxProps) {
  const vibrate = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-center"
      >
        <p className="mb-6 text-lg text-muted">Нажми на коробку, чтобы открыть! 👇</p>

        <motion.button
          onClick={() => {
            vibrate();
            onOpen();
          }}
          className="animate-pulse-box cursor-pointer rounded-3xl bg-pink-light p-10 shadow-xl transition-shadow hover:shadow-2xl active:scale-95"
          whileTap={{ scale: 0.9 }}
        >
          <Gift size={80} className="text-pink-dark" strokeWidth={1.5} />
        </motion.button>

        <div className="mt-6 flex items-center justify-center gap-1 text-sm text-muted">
          <PawPrint size={14} />
          <span>Барсик доставил</span>
        </div>
      </motion.div>
    </div>
  );
}
