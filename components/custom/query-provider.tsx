"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
export function QueryProvider({ children, session }: { children: React.ReactNode, session: Session | null }) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={new QueryClient()}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}
