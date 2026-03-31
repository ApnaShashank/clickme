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
  metadataBase: new URL("https://clickmeee.vercel.app"),
  title: "Click Me | The Viral Ad Arena 🚀",
  description: "Rank high, go viral! Join the global click race, connect via social handles, and use your rank to promote products globally through double-click advertisement interactions. The ultimate social clicker arena.",
  keywords: ["clicker game", "viral clicker", "social ads", "multiplayer leaderboard", "product promotion", "instagram arena", "click me to viral"],
  authors: [{ name: "ClickMe Arena" }],
  creator: "ClickMe Team",
  icons: {
    icon: "https://ik.imagekit.io/DEMOPROJECT/Click%20Me%20Button%20Icon.png",
  },
  alternates: {
    canonical: "https://clickmeee.vercel.app",
  },
  openGraph: {
    title: "Click Me | The Viral Ad Arena 🚀",
    description: "Rise to the top of the leaderboard and promote your brand! Connect with players worldwide.",
    url: "https://clickmeee.vercel.app",
    siteName: "Click Me",
    images: [
      {
        url: "https://ik.imagekit.io/DEMOPROJECT/Click%20Me%20Button%20Icon.png",
        width: 1200,
        height: 630,
        alt: "Click Me Official Button Icon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Click Me | The Viral Ad Arena 🚀",
    description: "Rank top. Connect with players. Advertise your products globally.",
    images: ["https://ik.imagekit.io/DEMOPROJECT/Click%20Me%20Button%20Icon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
