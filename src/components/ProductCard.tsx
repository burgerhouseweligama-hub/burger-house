'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UtensilsCrossed, Loader2, ShoppingCart, Eye } from 'lucide-react';
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

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsLoading(true);
        try {
            await addToCart(product._id);
            showToast(`Added ${product.name} to cart`);
        } catch (error) {
            showToast("Failed to add to cart", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="group relative h-full">
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

            <div className="relative h-full bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden group-hover:border-orange-500/30 transition-all duration-500 flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-800">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <UtensilsCrossed className="h-16 w-16 text-zinc-700" />
                        </div>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Quick Actions on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                        <Link
                            href={`/menu/${product._id}`}
                            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                        >
                            <Eye className="w-5 h-5" />
                        </Link>
                        {product.isAvailable && (
                            <button
                                onClick={handleAddToCart}
                                disabled={isLoading}
                                className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition-colors disabled:opacity-70"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
                            </button>
                        )}
                    </div>

                    {/* Sold Out Badge */}
                    {!product.isAvailable && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <span className="bg-red-500 text-white px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                                Sold Out
                            </span>
                        </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                        <span className="bg-black/50 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-semibold border border-white/10">
                            {product.category?.name}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                    <Link href={`/menu/${product._id}`}>
                        <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1 mb-2">
                            {product.name}
                        </h3>
                    </Link>

                    {product.description && (
                        <p className="text-zinc-500 text-sm line-clamp-2 mb-4 flex-1">
                            {product.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800">
                        <div>
                            <p className="text-xs text-zinc-500 mb-0.5">Price</p>
                            <span className="text-xl font-black text-orange-500">
                                LKR {product.price.toLocaleString()}
                            </span>
                        </div>
                        {product.isAvailable && (
                            <button
                                onClick={handleAddToCart}
                                disabled={isLoading}
                                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100 flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <ShoppingCart className="w-4 h-4" />
                                        Add
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
