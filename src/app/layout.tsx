import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const orbitron = Orbitron({
  variable: "--font-headline",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clickmee.vercel.app"),
  title: "ClickMe - The Ultimate Multiplayer Clicker Game",
  description: "Click your way to the top of the leaderboard! Join the arena, customize your identity, and dominate the rankings in the most professional clicker game online.",
  keywords: ["clicker game", "multiplayer", "leaderboard", "online game", "idle game"],
  authors: [{ name: "ClickMe Arena" }],
  creator: "ClickMe Team",
  themeColor: "#0066FF",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  alternates: {
    canonical: "https://clickmee.vercel.app",
  },
  openGraph: {
    title: "ClickMe - The Ultimate Multiplayer Clicker Game",
    description: "Compete with players worldwide! Click your way to #1.",
    url: "https://clickmee.vercel.app",
    siteName: "ClickMe",
    images: [
      {
        url: "https://ik.imagekit.io/DEMOPROJECT/clickme/og-image.png?updatedAt=1774962271934",
        width: 1200,
        height: 630,
        alt: "ClickMe Leaderboard Arena",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClickMe - The Ultimate Multiplayer Clicker Game",
    description: "Click your way to the top of the leaderboard! Join the arena and dominate.",
    images: ["https://ik.imagekit.io/DEMOPROJECT/clickme/og-image.png?updatedAt=1774962271934"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://ik.imagekit.io" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${orbitron.variable} ${rajdhani.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
