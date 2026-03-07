"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, Truck, PawPrint, Package } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

interface TrackingTimelineProps {
  name: string;
  onComplete: () => void;
}

interface Status {
  time: string;
  text: string;
  icon: React.ReactNode;
}

function generateTimeline(): Status[] {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();

  // Dynamic times based on when the page was opened (but within March 8)
  const baseHour = Math.max(8, h - 5);
  const times = [
    `${String(baseHour).padStart(2, "0")}:00`,
    `${String(baseHour + 1).padStart(2, "0")}:15`,
    `${String(Math.min(baseHour + 3, 23)).padStart(2, "0")}:30`,
    `${String(Math.min(h, 23)).padStart(2, "0")}:${String(Math.max(m - 5, 0)).padStart(2, "0")}`,
    `${String(Math.min(h, 23)).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
  ];

  return [
    { time: times[0], text: "Посылка принята в отделении «КотоПочты» 🐈", icon: <Package size={20} /> },
    { time: times[1], text: "Задержка на таможне: подозрение на контрабанду валерьянки 🌿", icon: <Clock size={20} /> },
    { time: times[2], text: "Курьер уснул на тёплой батарее. Посылка задерживается 😴", icon: <PawPrint size={20} /> },
    { time: times[3], text: "Курьер Барсик пересекает границу, держа тюльпан в зубах... 🌷", icon: <Truck size={20} /> },
    { time: times[4], text: "ДОСТАВЛЕНО!", icon: <CheckCircle size={20} /> },
  ];
}

export default function TrackingTimeline({ name, onComplete }: TrackingTimelineProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const timeline = useMemo(() => generateTimeline(), []);

  const vibrate = (pattern: number | number[]) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  useEffect(() => {
    if (visibleCount >= timeline.length) {
      vibrate([100, 50, 100, 50, 200]);
      const t = setTimeout(onComplete, 1200);
      return () => clearTimeout(t);
    }

    const delay = visibleCount === timeline.length - 1 ? 1000 : 700;
    const t = setTimeout(() => {
      vibrate(30);
      setVisibleCount((c) => c + 1);
    }, delay);

    return () => clearTimeout(t);
  }, [visibleCount, timeline.length, onComplete]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="mb-2 flex items-center justify-center gap-2 text-pink">
          <PawPrint size={28} />
          <span className="text-lg font-semibold tracking-wide">КотоПочта</span>
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          Привет, {name}! 💐
        </h1>
        <p className="mt-1 text-muted">Тебе посылка!</p>
      </motion.div>

      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-lg">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
          Отслеживание
        </h2>

        <div className="relative space-y-0">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-pink-light" />

          <AnimatePresence>
            {timeline.slice(0, visibleCount).map((status, idx) => {
              const isLast = idx === timeline.length - 1;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative flex items-start gap-3 pb-5"
                >
                  <div
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      isLast ? "bg-green text-white" : "bg-pink-light text-pink-dark"
                    }`}
                  >
                    {status.icon}
                  </div>
                  <div className="pt-1.5">
                    <span className="mr-2 text-xs font-bold text-muted">
                      {status.time}
                    </span>
                    <span className={`text-sm ${isLast ? "font-bold text-green" : ""}`}>
                      {status.text}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {visibleCount < timeline.length && (
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="flex items-center gap-2 pl-12 text-sm text-muted"
            >
              Обновление...
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
