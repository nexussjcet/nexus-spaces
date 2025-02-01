"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );
}
