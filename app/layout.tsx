import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./components/header";
import Footer from "./components/footer";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dungeon Honor",
  description: "Site to track M+ player behavior",
  icons: {
    shortcut: "/favicon.png"
  }
};

export default function RootLayout({ children, }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-full min-h-screen w-full flex-col justify-between">
          <Header />
          <main className="mx-auto w-full max-w-3xl flex-auto px-4 py-4 sm:px-6 md:py-6">
            {children}
          </main>
          <SpeedInsights />
          <Footer />
        </div>
      </body>
    </html>
  );
}
