"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import SplitText from "../ui/split"
import TiltedCard from "../ui/titled"
import RotatingText from "../ui/rotateText"
import { BoxReveal } from "../ui/box"

export function HomePage() {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-black text-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
      />

      <div className="relative z-10 flex flex-col items-center justify-center gap-8 text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border-2 border-white/20 rounded-full p-1 mb-3"
        >
          <TiltedCard
            imageSrc="/nexus.webp"
            containerHeight="200px"
            containerWidth="200px"
            imageHeight="180px"
            imageWidth="180px"
            rotateAmplitude={15}
            scaleOnHover={1.1}
            showMobileWarning={false}
          />
        </motion.div>

        <BoxReveal boxColor={"rgba(255,255,255,0.1)"} duration={0.7}>
          <SplitText
            text="Nexus Spaces"
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-white"
            delay={100}
            onLetterAnimationComplete={() => null}
          />
        </BoxReveal>

        <BoxReveal boxColor={"rgba(255,255,255,0.05)"} duration={0.7}>
          <div className="text-lg sm:text-xl md:text-2xl flex flex-col sm:flex-row gap-2 items-center justify-center">
            <p className="font-semibold">Nexus Spaces is a social media platform for</p>
            <RotatingText
              texts={["developers", "designers", "innovators"]}
              mainClassName="text-lg sm:text-xl md:text-2xl pt-0.5 uppercase bg-white/10 min-w-64 font-semibold text-white overflow-hidden justify-center rounded-lg"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </div>
        </BoxReveal>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-lg sm:text-xl text-gray-300 max-w-2xl"
        >
          Join the community and connect with like-minded individuals in a space designed for collaboration and growth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Link href={session ? "/chat" : "/signin"}>
            <Button className="rounded-full px-8 py-6 text-lg font-semibold bg-white text-black hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform">
              {session ? "Open Chat" : "Get Started"}
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-4 left-4 right-4 flex justify-between text-sm text-gray-400"
      >
       <a href="https://github.com/nexussjcet"><span>© 2025 Nexus Spaces</span></a> 
        <span>AI-driven social media platform</span>
      </motion.div>
    </div>
  )
}

