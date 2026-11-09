import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AlgoAtlas — Personal DSA Learning OS",
  description:
    "Production-grade personal DSA Learning OS to manage your coding journey across LeetCode, Codeforces, AtCoder, CodeChef, HackerRank and GeeksforGeeks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased font-sans bg-[#0f0f0f] text-[#f0f0f0] min-h-screen selection:bg-neutral-800 selection:text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
