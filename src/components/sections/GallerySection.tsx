"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn, X, Instagram } from "lucide-react";

// Gallery Images (Placeholders)
// Tiny 16px base64 blur placeholder for Unsplash images
const BLUR_PLACEHOLDER =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q==";

const galleryImages = [
    {
        id: 1,
        src: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800&auto=format&fit=crop",
        alt: "Juicy Classic Burger",
        category: "Burgers",
        size: "large" // spans 2 rows
    },
    {
        id: 2,
        src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop",
        alt: "Restaurant Interior",
        category: "Vibe",
        size: "normal"
    },
    {
        id: 3,
        src: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800&auto=format&fit=crop",
        alt: "Crispy Fries",
        category: "Sides",
        size: "normal"
    },
    {
        id: 4,
        src: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop",
        alt: "Double Cheeseburger",
        category: "Burgers",
        size: "wide" // spans 2 columns
    },
    {
        id: 5,
        src: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop",
        alt: "Refreshing Drinks",
        category: "Drinks",
        size: "normal"
    },
    {
        id: 6,
        src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop",
        alt: "BBQ Specail",
        category: "Specials",
        size: "large"
    },
    {
        id: 7,
        src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
        alt: "Gourmet Burger",
        category: "Burgers",
        size: "normal"
    },
    {
        id: 8,
        src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
        alt: "Restaurant Ambience",
        category: "Vibe",
        size: "normal"
    }
];

export default function GallerySection() {
    const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

    return (
        <section className="py-24 bg-zinc-950 relative overflow-hidden" id="gallery">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.05),_transparent_40%)]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-orange-400 text-sm font-medium">
                        <Instagram className="w-4 h-4" />
                        @BurgerHouseWeligama
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white">
                        Capture the <span className="text-orange-500">Moment</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        A glimpse into our world of flavor. From sizzling grills to satisfied smiles, see what makes Burger House the talk of the town.
                    </p>
                </div>

                {/* Masonry Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
                    {galleryImages.map((image, index) => (
                        <div
                            key={image.id}
                            className={`group relative rounded-2xl overflow-hidden cursor-zoom-in border border-zinc-800 bg-zinc-900
                                ${image.size === 'large' ? 'md:row-span-2' : ''}
                                ${image.size === 'wide' ? 'md:col-span-2' : ''}
                            `}
                            onClick={() => setSelectedImage(image)}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                placeholder="blur"
                                blurDataURL={BLUR_PLACEHOLDER}
                                quality={75}
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <ZoomIn className="w-8 h-8 text-white mx-auto mb-2" />
                                    <p className="text-white font-bold text-lg">{image.category}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-zinc-400 hover:text-white p-2"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div
                        className="relative max-w-5xl w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/10"
                        onClick={e => e.stopPropagation()} // Prevent close on image click
                    >
                        <div className="relative aspect-[16/9] w-full h-full">
                            <Image
                                src={selectedImage.src}
                                alt={selectedImage.alt}
                                fill
                                className="object-contain"
                                priority
                                sizes="(max-width: 1280px) 100vw, 1280px"
                                quality={85}
                            />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                            <h3 className="text-2xl font-bold text-white mb-1">{selectedImage.category}</h3>
                            <p className="text-zinc-300">{selectedImage.alt}</p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
