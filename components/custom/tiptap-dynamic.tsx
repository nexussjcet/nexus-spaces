"use client";

import dynamic from "next/dynamic";

const Tiptap = dynamic(() => import("./tiptap"), { ssr: false });

export default Tiptap;
