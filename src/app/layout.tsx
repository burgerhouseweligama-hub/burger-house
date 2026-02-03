import type { Metadata } from "next";
import { Oswald, Open_Sans } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/seo/JsonLd";

// Heading font - Bold condensed sans-serif for impactful headings
const oswald = Oswald({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Body font - Clean readable sans-serif for body text
const openSans = Open_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
import ClientTrackers from "@/components/ClientTrackers";

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
         <body className={`${oswald.variable} ${openSans.variable} font-body antialiased`} suppressHydrationWarning>
           <ClientTrackers />
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
