import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactSection from "@/components/sections/ContactSection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with Burger House Weligama. Find our location, opening hours, phone number, and send us a message. We'd love to hear from you!",
    openGraph: {
        title: "Contact Us | Burger House Weligama",
        description: "Get in touch with Burger House Weligama. Find our location and opening hours.",
        images: ["/hero-burger.png"],
    },
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="pt-20">
                <ContactSection />
            </div>
            <Footer />
        </main>
    );
}
