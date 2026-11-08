import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "AlgoAtlas — Personal DSA Learning OS",
  description:
    "Production-quality personal DSA Learning OS to manage your coding journey across LeetCode, Codeforces, AtCoder, CodeChef, HackerRank and GeeksforGeeks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
