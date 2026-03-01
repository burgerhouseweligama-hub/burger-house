'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UtensilsCrossed, Loader2, Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

interface Category {
    _id: string;
    name: string;
}

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: Category;
    image: string;
    isAvailable: boolean;
}

interface MobileProductCardProps {
    product: Product;
}

export function MobileProductCard({ product }: MobileProductCardProps) {
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsLoading(true);
        try {
            await addToCart(product._id);
            showToast(`Added ${product.name} to cart`);
        } catch {
            showToast("Failed to add to cart", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="group relative h-full">
            {/* Desktop glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl opacity-0 group-hover:opacity-15 blur-xl transition-opacity duration-500 hidden sm:block" />

            {/* Card Container */}
            <div className="relative h-full bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all duration-300 active:scale-[0.96] sm:active:scale-100">
                {/* Mobile: Horizontal layout | Desktop: Vertical layout */}
                <div className="flex flex-row sm:flex-col">
                    {/* Image Container */}
                    <div className="relative w-[104px] h-[104px] m-2 rounded-xl sm:w-full sm:h-auto sm:aspect-[4/3] sm:m-0 sm:rounded-none flex-shrink-0 overflow-hidden bg-zinc-800">
                        {/* Shimmer placeholder */}
                        {!imageLoaded && product.image && (
                            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%]" />
                        )}

                        {product.image ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                loading="lazy"
                                className={`object-cover transition-all duration-500 sm:group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                onLoad={() => setImageLoaded(true)}
                                sizes="(max-width: 640px) 104px, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <UtensilsCrossed className="h-8 w-8 sm:h-12 sm:w-12 text-zinc-700" />
                            </div>
                        )}

                        {/* Sold Out Overlay */}
                        {!product.isAvailable && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Sold Out
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
                        {/* Top: Name & Description */}
                        <div className="min-w-0">
                            <Link href={`/menu/${product._id}`} className="block">
                                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                                    {product.name}
                                </h3>
                            </Link>

                            {product.description && (
                                <p className="text-zinc-500 text-xs sm:text-sm line-clamp-1 sm:line-clamp-2 mt-1 leading-relaxed">
                                    {product.description}
                                </p>
                            )}
                        </div>

                        {/* Bottom: Price & Actions */}
                        <div className="flex items-center justify-between gap-2 mt-2 sm:mt-3 sm:pt-3 sm:border-t sm:border-zinc-800">
                            <span className="text-base sm:text-lg font-black text-orange-500 whitespace-nowrap">
                                LKR {product.price.toLocaleString()}
                            </span>

                            <div className="flex items-center gap-2">
                                {/* View Details - visible on desktop */}
                                <Link
                                    href={`/menu/${product._id}`}
                                    className="hidden sm:flex w-9 h-9 bg-zinc-800 rounded-xl items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                </Link>

                                {/* Add to Cart - always visible */}
                                {product.isAvailable ? (
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isLoading}
                                        className="w-10 h-10 sm:w-auto sm:h-auto flex items-center justify-center sm:gap-1.5 sm:px-4 sm:py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full sm:rounded-xl text-xs sm:text-sm font-semibold hover:shadow-lg hover:shadow-orange-500/25 active:scale-90 transition-all duration-200 disabled:opacity-70 touch-manipulation"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
                                                <span className="hidden sm:inline">Add</span>
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <span className="text-xs text-red-400 font-medium">Unavailable</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
