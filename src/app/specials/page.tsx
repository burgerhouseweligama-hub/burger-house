import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SpecialsSection from "@/components/sections/SpecialsSection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Special Offers",
    description: "Check out our special offers and deals at Burger House Weligama. Limited-time discounts, combo meals, and exclusive promotions on delicious burgers.",
    openGraph: {
        title: "Special Offers | Burger House Weligama",
        description: "Discover limited-time deals and exclusive promotions on our flame-grilled burgers.",
        images: ["/hero-burger.png"],
    },
};

export default function SpecialsPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="pt-20">
                <SpecialsSection />
            </div>
            <Footer />
        </main>
    );
}
