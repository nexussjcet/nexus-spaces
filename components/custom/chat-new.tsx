"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";

export function ChatNew() {
  const textIndex = useMotionValue(0);
  const texts = [
    "How can I help you today?",
    "What can I do for you?",
    "What can I assist you with?",
  ];

  const baseText = useTransform(textIndex, (latest) => texts[latest] || "");
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) =>
    baseText.get().slice(0, latest)
  );
  const updatedThisRound = useMotionValue(true);

  useEffect(() => {
    animate(count, 60, {
      type: "tween",
      duration: 2,
      ease: "easeIn",
      repeat: Infinity,
      repeatType: "reverse",
      repeatDelay: 1,
      onUpdate(latest) {
        if (updatedThisRound.get() === true && latest > 0) {
          updatedThisRound.set(false);
        } else if (updatedThisRound.get() === false && latest === 0) {
          if (textIndex.get() === texts.length - 1) {
            textIndex.set(0);
          } else {
            textIndex.set(textIndex.get() + 1);
          }
          updatedThisRound.set(true);
        }
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-black text-white flex items-center justify-center h-full">
      <h1 className="text-4xl font-bold">
        <motion.span className="inline">{displayText}</motion.span>
        <motion.span
          className="ml-1"
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror"
          }}
        >
          |
        </motion.span>
      </h1>
    </div>
  );
}