import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./components/header";
import Footer from "./components/footer";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Dungeon Honor",
    template: "%s | dungeonhonor.com",
  },
  description: "A site to rate teammates after Mythic+ runs",
  openGraph: {
    title: "dungeonhonor.com",
    description:
      "A site to rate teammates after Mythic+ runs",
    url: "https://dungeonhonor.com",
    siteName: "dungeonhonor.com",
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <div className="flex h-full min-h-screen w-full flex-col justify-between">
          <Header />
          <main className="mx-auto w-full max-w-5xl flex-auto px-6 py-8 sm:px-8 md:py-12 bg-gradient-to-b from-gray-800 via-gray-900 to-black shadow-lg rounded-lg">
            {children}
          </main>
          <SpeedInsights />
          <Footer />
        </div>
      </body>
    </html>
  );
}
