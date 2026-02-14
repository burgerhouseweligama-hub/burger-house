import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileMenuSection from "@/components/sections/MobileMenuSection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Menu",
    description: "Explore our full menu of flame-grilled burgers, chicken burgers, sides, and combo meals at Burger House Weligama. Fresh ingredients, bold flavors, and something for everyone.",
    openGraph: {
        title: "Our Menu | Burger House Weligama",
        description: "Explore our full menu of flame-grilled burgers, chicken burgers, sides, and combo meals.",
        images: ["/hero-burger.png"],
    },
};

export default function MenuPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="pt-20">
                <MobileMenuSection />
            </div>
            <Footer />
        </main>
    );
}
