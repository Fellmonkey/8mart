"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, Truck, PawPrint, Package } from "lucide-react";
import { type ReactNode, useEffect, useState, useMemo } from "react";

interface TrackingTimelineProps {
  name: string;
  onComplete: () => void;
}

interface Status {
  time: string;
  text: string;
  icon: ReactNode;
}

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

function playSound(src: string) {
  try {
    const audio = new Audio(src);
    audio.volume = 0.6;
    audio.play().catch(() => {});
  } catch {
    // ignore
  }
}

function generateTimeline(): Status[] {
  const now = new Date();
  const m = now.getMinutes();

    const count = 5;
    const maxSpanMinutes = 6 * 60; // don't span more than 6 hours
    const defaultSpanMinutes = 4 * 60; // default 4 hours

    const midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);

    // available minutes since midnight
    const availableSinceMidnight = Math.max(0, Math.floor((now.getTime() - midnight.getTime()) / 60000));

    // If the day has progressed more than maxSpanMinutes, we'll randomize minutes for
    // each status (user asked for random minutes when > 6 hours have passed).
    const useRandomMinutes = availableSinceMidnight > maxSpanMinutes;

    let spanMinutes = Math.min(defaultSpanMinutes, maxSpanMinutes);
    if (availableSinceMidnight > 0 && availableSinceMidnight < spanMinutes) spanMinutes = availableSinceMidnight;
    // if nothing is available (shouldn't happen), fall back to small span
    if (spanMinutes <= 0) spanMinutes = Math.max(5, Math.floor(m || 5));

    let start = new Date(now.getTime() - spanMinutes * 60000);
    if (start < midnight) start = midnight;

    const interval = Math.max(1, Math.round(spanMinutes / (count - 1)));

    const times: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = new Date(start.getTime() + i * interval * 60000);
      const hh = String(t.getHours()).padStart(2, "0");
      let mm: string;
      if (useRandomMinutes) {
        const rnd = Math.floor(Math.random() * 60);
        // if generated time would be in the future, clamp to current minute
        if (t.getHours() === now.getHours() && rnd > now.getMinutes()) {
          mm = String(now.getMinutes()).padStart(2, "0");
        } else {
          mm = String(rnd).padStart(2, "0");
        }
      } else {
        mm = String(t.getMinutes()).padStart(2, "0");
      }
      times.push(`${hh}:${mm}`);
    }

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
  const isDone = visibleCount >= timeline.length;

  useEffect(() => {
    if (visibleCount >= timeline.length) {
      vibrate([100, 50, 100, 50, 200]);
      return;
    }

    const delay = visibleCount === timeline.length - 1 ? 1000 : 700;
    const t = setTimeout(() => {
      vibrate(30);
      playSound("/notification.mp3");
      setVisibleCount((c) => c + 1);
    }, delay);

    return () => clearTimeout(t);
  }, [visibleCount, timeline.length]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
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
                  key={status.time}
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

      {isDone && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          onClick={onComplete}
          className="mt-6 cursor-pointer rounded-full bg-pink px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-pink-dark hover:shadow-lg active:scale-95"
        >
          Дальше →
        </motion.button>
      )}
    </div>
  );
}
