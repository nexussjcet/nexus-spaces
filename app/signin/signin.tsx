"use client"

import { SignInButton } from "@/components/custom/sign-in"
import Image from "next/image"
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { motion } from "framer-motion"

export default function SignInClient() {
  return (
    <div className="flex flex-col w-full h-screen bg-black text-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
        className="fixed inset-0 pointer-events-none z-[10]"
      >
        <InteractiveGridPattern
          className={cn("[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]", "opacity-50")}
        />
      </motion.div>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 flex flex-row items-center border-b border-white/20"
      >
        <Link href="/" title="Home" className="flex flex-row items-center gap-2 hover:opacity-80 transition-opacity">
          <Image src="/nexus.webp" width={70} height={70} alt="Nexus" className="rounded-full" />
          <h2 className="text-md md:text-xl font-bold tracking-wider">NEXUS SPACES</h2>
        </Link>
      </motion.nav>
      <div className="flex flex-col justify-center items-center w-full h-full">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-6 items-center border border-white/20 p-8 md:p-12 rounded-lg backdrop-blur-sm bg-white/5"
        >
          <motion.div
            initial={{ rotate: -5 }}
            animate={{ rotate: 5 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
          >
            <Image src="/nexus.webp" width={180} height={180} alt="Nexus" className="rounded-full shadow-lg" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-3xl font-bold"
          >
            Hey there!
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-lg text-gray-300"
          >
            Your dream team is one click away!
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <SignInButton />
          </motion.div>
        </motion.div>
      </div>
     <footer className="flex flex-row justify-center items-center p-4 border-t border-white/20">
        <p className="text-md md:text-lg text-gray-400">
          © 2025{" "}
          <a href="https://github.com/nexussjcet/nexus-spaces" className="hover:text-white transition-colors">
            Nexus Spaces
          </a>
          : Built by students for students
        </p>
      </footer>
    </div>
  )
}