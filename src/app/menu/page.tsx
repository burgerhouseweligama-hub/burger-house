import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MenuSection from "@/components/sections/MenuSection";

export default function MenuPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="pt-20">
                <MenuSection />
            </div>
            <Footer />
        </main>
    );
}
