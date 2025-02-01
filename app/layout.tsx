import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConversationContextProvider from "@/context/conversation";
import { QueryProvider } from "@/components/custom/query-provider";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexus Spaces",
  description:
    "Nexus spaces is a AI driven social media platform where SJCET students can find and connect with developers, designers and other skilled individuals.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <QueryProvider session={session}>
          <ConversationContextProvider>
            {children}
          </ConversationContextProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
