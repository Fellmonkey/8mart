"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { decodeGift } from "@/app/lib/gift";
import TrackingTimeline from "@/app/components/TrackingTimeline";
import CatVideo from "@/app/components/CatVideo";
import GiftBox from "@/app/components/GiftBox";
import GiftReveal from "@/app/components/GiftReveal";
import { PawPrint } from "lucide-react";

type Stage = "tracking" | "video" | "box" | "reveal";

export default function GiftQuest() {
  const searchParams = useSearchParams();
  const [stage, setStage] = useState<Stage>("tracking");

  const gift = useMemo(() => {
    const encoded = searchParams.get("gift");
    if (!encoded) return null;
    return decodeGift(encoded);
  }, [searchParams]);

  const goToVideo = useCallback(() => setStage("video"), []);
  const goToBox = useCallback(() => setStage("box"), []);
  const goToReveal = useCallback(() => setStage("reveal"), []);

  if (!gift) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <PawPrint size={48} className="mb-4 text-pink" />
        <h1 className="text-2xl font-bold">КотоПочта 🐾</h1>
        <p className="mt-2 text-muted">
          Похоже, здесь нет посылки для тебя... пока!
        </p>
        <a
          href="/create"
          className="mt-6 inline-block rounded-full bg-pink px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-pink-dark hover:shadow-lg"
        >
          Создать поздравление
        </a>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {stage === "tracking" && (
        <motion.div
          key="tracking"
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.4 }}
        >
          <TrackingTimeline name={gift.n} onComplete={goToVideo} />
        </motion.div>
      )}

      {stage === "video" && (
        <motion.div
          key="video"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.4 }}
        >
          <CatVideo onComplete={goToBox} />
        </motion.div>
      )}

      {stage === "box" && (
        <motion.div
          key="box"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.4 }}
        >
          <GiftBox onOpen={goToReveal} />
        </motion.div>
      )}

      {stage === "reveal" && (
        <motion.div
          key="reveal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GiftReveal name={gift.n} message={gift.m} certificate={gift.c} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
