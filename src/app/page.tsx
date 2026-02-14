import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import MenuSection from "@/components/sections/MenuSection";
import SpecialsSection from "@/components/sections/SpecialsSection";
import ContactSection from "@/components/sections/ContactSection";
import ReviewSection from "@/components/reviews/ReviewSection";
import GallerySection from "@/components/sections/GallerySection";

export default function Home() {
  return (
    <main className="bg-black">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MenuSection showViewAllButton={true} />
      <SpecialsSection />
      <ReviewSection />
      <GallerySection />
      <ContactSection />
      <Footer />
    </main>
  );
}
