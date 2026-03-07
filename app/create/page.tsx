"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, PawPrint, Send, Gift } from "lucide-react";
import { encodeGift } from "@/app/lib/gift";

export default function CreatePage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [certificate, setCertificate] = useState("");
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    if (!name.trim() || !message.trim() || !certificate.trim()) return;
    const encoded = encodeGift({
      n: name.trim(),
      m: message.trim(),
      c: certificate.trim(),
    });
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    setLink(`${origin}/?gift=${encoded}`);
    setCopied(false);
  }, [name, message, certificate]);

  const copyToClipboard = useCallback(async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [link]);

  const isValid = name.trim() && message.trim() && certificate.trim();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-2 text-pink">
            <PawPrint size={28} />
            <span className="text-xl font-bold tracking-wide">КотоПочта</span>
          </div>
          <h1 className="text-2xl font-bold">Создать посылку 📦</h1>
          <p className="mt-1 text-sm text-muted">
            Заполни форму — получи ссылку — отправь девушке
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-card p-6 shadow-lg">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-muted">
                Имя получательницы
              </label>
              <input
                type="text"
                placeholder="Алиса"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-pink-light bg-background px-4 py-3 text-foreground outline-none transition-all focus:border-pink focus:ring-2 focus:ring-pink-light"
              />
            </div>

            {/* Message */}
            <div>
              <label className="mb-1 block text-sm font-medium text-muted">
                Поздравление
              </label>
              <textarea
                placeholder="С 8 Марта! Барсик сбил лапки, пока нёс это..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-pink-light bg-background px-4 py-3 text-foreground outline-none transition-all focus:border-pink focus:ring-2 focus:ring-pink-light"
              />
            </div>

            {/* Gift */}
            <div>
              <label className="mb-1 block text-sm font-medium text-muted">
                Подарок / Сертификат
              </label>
              <div className="relative">
                <Gift
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="text"
                  placeholder="Безлимитный массаж плеч"
                  value={certificate}
                  onChange={(e) => setCertificate(e.target.value)}
                  className="w-full rounded-xl border border-pink-light bg-background py-3 pl-10 pr-4 text-foreground outline-none transition-all focus:border-pink focus:ring-2 focus:ring-pink-light"
                />
              </div>
            </div>

            {/* Generate Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={generate}
              disabled={!isValid}
              className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-md transition-all ${
                isValid
                  ? "bg-pink hover:bg-pink-dark hover:shadow-lg"
                  : "cursor-not-allowed bg-pink/40"
              }`}
            >
              <Send size={16} />
              Создать посылку
            </motion.button>
          </div>
        </div>

        {/* Result */}
        <AnimatePresence>
          {link && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 rounded-2xl bg-green-light p-5 shadow-md"
            >
              <p className="mb-2 text-sm font-semibold text-foreground">
                Ссылка готова! 🎉
              </p>
              <div className="rounded-lg bg-background p-3">
                <p className="break-all text-xs text-muted">{link}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={copyToClipboard}
                className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-95"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Скопировано!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Скопировать ссылку
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
