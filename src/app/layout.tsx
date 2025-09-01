
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { ClerkProvider } from '@clerk/nextjs';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillPilot",
  description: "Learn new skills with SkillPilot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConditionalNavbar />
        <main className="relative overflow-hidden">
          {children}
        </main>
      </body>
    </html>
    </ClerkProvider>
  );
}
