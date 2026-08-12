import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { ClerkProvider } from '@clerk/nextjs';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ClerkProvider wraps every route, and the shared Navbar renders SignedIn /
// SignedOut on all of them, so static prerendering forced Clerk to initialise
// during the build. That turned a missing or wrong publishable key in the
// deploy environment into a failed build rather than a runtime problem.
// Nothing here is genuinely static anyway: every page's header depends on who
// is signed in, so rendering on demand costs nothing.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "SkillPilot",
  description:
    "Turn a skill into a week by week plan sized to the hours you actually have.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
          <ConditionalNavbar />
          <main className="relative overflow-hidden">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
