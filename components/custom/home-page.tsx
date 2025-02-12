"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import SplitText from "../ui/split";
import TiltedCard from '../ui/titled';
import RotatingText from '../ui/rotateText';
export function HomePage() {
  const { data: session } = useSession();

  if (session) {
    return (
      // Create Home Page

      <div className="flex flex-col items-center justify-center h-screen w-full bg-black text-white">

        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="border-dashed border mb-3">
            <TiltedCard
              imageSrc="/nexus.webp"
              containerHeight="250px"
              containerWidth="250px"
              imageHeight="220px"
              imageWidth="220px"
              rotateAmplitude={20}
              scaleOnHover={1.2}
              showMobileWarning={false}
            />
          </div>
          <SplitText
            text="Nexus Spaces"
            className="text-5xl font-bold text-center"
            delay={150}
            onLetterAnimationComplete={() => null}
          />
          <div className="text-lg flex flex-col md:flex-row gap-2 items-center justify-center">
            <p className="text-2xl font-semibold">
          Nexus Spaces is a social media platform for 
          </p>
            <RotatingText
              texts={['developers', 'designers', 'skilled individuals']}
              mainClassName=" text-lg pt-0.5 uppercase bg-slate-200/10 min-w-64 font-semibold text-white overflow-hidden justify-center rounded-lg"
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
          <p className="text-lg">
            Join the community and connect with like-minded individuals.
          </p>
          <Link href="/chat">
            <Button className="rounded-md shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)]">Open Chat</Button>
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-black text-white">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-4xl font-bold">Nexus Spaces</h1>
          <p className="text-lg">
            Nexus Spaces is a social media platform for developers, designers and
            other skilled individuals.
          </p>
          <p className="text-lg">
            Join the community and connect with like-minded individuals.
          </p>
          <Link href="/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }
}