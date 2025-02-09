"use client";
import { Plus, Zap, Lock, Sparkles, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FeatureCard } from "./feature-card"
import { useChatContext } from "@/contexts/chat";
import { AnimatePresence, motion } from "motion/react";

export function ChatHome() {
  const { handleNewChat } = useChatContext();

  return (
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-between h-full text-white"
        >
          <div className="mt-[5%] w-full max-w-4xl space-y-16">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold tracking-tight">Welcome to Nexus Spaces</h1>
              <p className="text-xl text-zinc-400">Unlock your potential, connect with creators and build together</p>
            </div>
            <div className="flex justify-center">
              <Button
                size="lg"
                variant="outline"
                className="group bg-transparent border-white text-white hover:bg-white hover:text-black px-8 py-6 rounded-md text-lg font-semibold transition-all duration-300"
                onClick={handleNewChat}
              >
                <Plus className="w-6 h-6 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Start a New Chat
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FeatureCard
                icon={Zap}
                title="Lightning Fast"
                description="Experience instant responses and seamless interactions"
              />
              <FeatureCard
                icon={Lock}
                title="Secure & Private"
                description="End-to-end encryption keeps your conversations confidential"
              />
              <FeatureCard
                icon={Sparkles}
                title="AI-Powered Insights"
                description="Get intelligent suggestions and analysis in real-time"
              />
              <FeatureCard
                icon={Rocket}
                title="Limitless Possibilities"
                description="Explore a wide range of topics and expand your knowledge"
              />
            </div>
          </div>
          <div className="mt-[5%] text-center text-zinc-500 text-sm">
            <p>© 2025 Nexus Spaces | Made by <a href="https://nexus.sjcetpalai.ac.in/" target="_blank"><u>The Nexus Project</u></a></p>
          </div>
        </motion.div>
      </AnimatePresence>
  );
}