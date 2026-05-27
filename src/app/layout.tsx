import type { Metadata, Viewport } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { GaarlandzProvider } from "@/context/GaarlandzContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Load Premium Fonts
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// Premium SEO Metadata
export const metadata: Metadata = {
  title: "Gaarlandz | Luxury Garden Venue & Celebrations Portal",
  description: "An operational venue booking, site tour scheduler, and celebration manager portal for Gaarlandz. Book weddings, receptions, and corporate meetings in Coimbatore.",
  keywords: ["Gaarlandz", "Wedding Venue", "Luxury Garden Venue", "Coimbatore Wedding", "Event Booking Platform"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <GaarlandzProvider>
          <Suspense fallback={<div style={{ height: "70px", backgroundColor: "var(--bg-cream)" }} />}>
            <Navbar />
          </Suspense>
          <main style={{ flex: 1, position: "relative" }}>
            {children}
          </main>
          <Footer />
        </GaarlandzProvider>
      </body>
    </html>
  );
}
