import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Burger House Weligama | Best Burgers in Southern Sri Lanka",
  description: "Experience flame-grilled perfection at Burger House Weligama. Premium handcrafted burgers, fresh ingredients, and secret recipes. The ultimate burger destination in Weligama, Sri Lanka.",
  keywords: ["burger", "weligama", "restaurant", "sri lanka", "flame-grilled", "fast food", "best burgers", "southern province"],
};

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";

// ... existing imports ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
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
