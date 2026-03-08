"use client";

import { motion } from "framer-motion";
import { PawPrint } from "lucide-react";
import { useState } from "react";

interface CatVideoProps {
  onComplete: () => void;
}

export default function CatVideo({ onComplete }: CatVideoProps) {
  const [videoError, setVideoError] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-sm text-center"
      >
        <div className="mb-4 flex items-center justify-center gap-2 text-pink">
          <PawPrint size={20} />
          <span className="text-sm font-semibold">Курьер Барсик передаёт привет!</span>
        </div>

        {/* 9:16 aspect ratio container for cat video */}
        <div className="relative mx-auto aspect-[16/9] w-full max-w-[280px] overflow-hidden rounded-2xl bg-pink-light shadow-lg">
          {!videoError ? (
            <video
              className="relative z-10 h-full w-full object-cover"
              src="/cat.mp4"
              autoPlay
              muted
              loop
              playsInline
              onError={() => setVideoError(true)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center bg-pink-light text-pink-dark">
              <span className="text-6xl">🐱🌷</span>
              <p className="mt-3 text-sm font-medium">Барсик несёт тюльпан!</p>
            </div>
          )}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={onComplete}
          className="mt-6 cursor-pointer rounded-full bg-pink px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-pink-dark hover:shadow-lg active:scale-95"
        >
          Дальше →
        </motion.button>
      </motion.div>
    </div>
  );
}
