import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SpecialsSection from "@/components/sections/SpecialsSection";

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
