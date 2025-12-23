import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/seo/JsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://whimsical-kelpie-80e090.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Burger House Weligama | Best Burgers in Southern Sri Lanka",
    template: "%s | Burger House Weligama",
  },
  description: "Experience flame-grilled perfection at Burger House Weligama. Premium handcrafted burgers, fresh ingredients, and secret recipes. The ultimate burger destination in Weligama, Sri Lanka.",
  keywords: ["burger", "weligama", "restaurant", "sri lanka", "flame-grilled", "fast food", "best burgers", "southern province", "burger house", "food delivery", "chicken burger", "beef burger"],
  authors: [{ name: "Burger House Weligama" }],
  creator: "Burger House Weligama",
  publisher: "Burger House Weligama",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Burger House Weligama",
    title: "Burger House Weligama | Best Burgers in Southern Sri Lanka",
    description: "Experience flame-grilled perfection at Burger House Weligama. Premium handcrafted burgers, fresh ingredients, and secret recipes.",
    images: [
      {
        url: "/hero-burger.png",
        width: 1200,
        height: 630,
        alt: "Burger House Weligama - Delicious Flame-Grilled Burgers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Burger House Weligama | Best Burgers in Southern Sri Lanka",
    description: "Experience flame-grilled perfection at Burger House Weligama. Premium handcrafted burgers, fresh ingredients, and secret recipes.",
    images: ["/hero-burger.png"],
    creator: "@burgerhouseweligama",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
  category: "restaurant",
};

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <JsonLd />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );

}
