import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutSection from "@/components/sections/AboutSection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about Burger House Weligama - our story, mission, and commitment to serving the best flame-grilled burgers in Southern Sri Lanka since day one.",
    openGraph: {
        title: "About Us | Burger House Weligama",
        description: "Learn about Burger House Weligama - our story, mission, and commitment to quality.",
        images: ["/hero-burger.png"],
    },
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="pt-20">
                <AboutSection />
            </div>
            <Footer />
        </main>
    );
}
