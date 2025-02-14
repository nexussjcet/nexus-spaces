"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useChatContext } from "@/contexts/chat";
import { AnimatePresence, motion } from "motion/react";

export function ChatHeader({ showTitle }: { showTitle: boolean }) {
  const { title } = useChatContext();

  return (
    <>
      <AnimatePresence>
        {!showTitle ? (
          <div className="flex flex-row h-14 w-full justify-start items-center border border-transparent">
            <SidebarTrigger className="p-6" />
          </div>
        ) : (
          <div className="relative flex flex-row h-16 w-full justify-between items-center border border-neutral-800">
            <SidebarTrigger className="p-6" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute left-1/2 transform -translate-x-1/2"
            >
              <span className="text-ellipsis whitespace-nowrap">{title}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}