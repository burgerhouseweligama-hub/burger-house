import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Product from '@/models/Product';
import connectToDatabase from '@/lib/db';
import { ArrowLeft, Star, Clock, Utensils } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AddToCartButton from '@/components/ui/AddToCartButton';

async function getProduct(id: string) {
    try {
        await connectToDatabase();
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
        const product = await Product.findById(id).populate('category');
        return product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Navbar - hidden on mobile for app-like feel */}
            <div className="hidden sm:block">
                <Navbar />
            </div>

            {/* Mobile Header - app-like top bar */}
            <div className="sm:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50">
                <Link
                    href="/menu"
                    className="w-10 h-10 flex items-center justify-center bg-zinc-900 rounded-full border border-zinc-800 active:scale-90 transition-transform"
                >
                    <ArrowLeft className="w-5 h-5 text-white" />
                </Link>
                <h2 className="text-sm font-semibold text-white truncate max-w-[200px]">
                    {product.name}
                </h2>
                <div className="w-10" /> {/* Spacer for centering */}
            </div>

            <div className="sm:pt-24 pb-0 sm:pb-12">
                <div className="sm:max-w-7xl sm:mx-auto sm:px-6">
                    {/* Desktop back button */}
                    <Link
                        href="/menu"
                        className="hidden sm:inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Menu
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 sm:gap-12 lg:gap-20 items-start">
                        {/* Image Section */}
                        <div className="relative w-full aspect-[4/3] sm:aspect-square sm:rounded-3xl overflow-hidden bg-zinc-900 sm:border-2 sm:border-zinc-800 sm:shadow-2xl sm:shadow-orange-500/10 order-1 lg:order-1">
                            {product.image ? (
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover sm:hover:scale-105 transition-transform duration-700"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                    <Utensils className="w-16 h-16 sm:w-20 sm:h-20" />
                                </div>
                            )}
                            {/* Category badge */}
                            <div className="absolute top-14 left-4 sm:top-6 sm:left-6">
                                <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-black/60 backdrop-blur-md text-white rounded-full text-xs sm:text-sm font-semibold border border-white/10">
                                    {(product.category as any)?.name || 'Specialty'}
                                </span>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex flex-col h-full justify-center order-2 lg:order-2 px-4 sm:px-0 pt-5 sm:pt-0">
                            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent mb-3 sm:mb-6">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-3 sm:gap-6 mb-5 sm:mb-8 flex-wrap">
                                <span className="text-2xl sm:text-4xl font-bold text-orange-500">
                                    LKR {(product.price).toLocaleString()}
                                </span>
                                <div className="h-6 sm:h-8 w-px bg-zinc-800" />
                                <div className="flex items-center gap-1 text-yellow-400">
                                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                                    <span className="font-semibold text-white text-sm sm:text-base">4.8</span>
                                    <span className="text-zinc-500 text-xs sm:text-base ml-1">(120+ reviews)</span>
                                </div>
                            </div>

                            <p className="text-zinc-400 text-sm sm:text-lg leading-relaxed mb-6 sm:mb-10 border-l-4 border-orange-500 pl-4 sm:pl-6">
                                {product.description || "A delicious handcrafted burger made with premium ingredients and our signature secret sauce. Experience the perfect balance of flavors in every bite."}
                            </p>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-10">
                                <div className="bg-zinc-900/50 p-3 sm:p-4 rounded-xl border border-zinc-800 flex items-center gap-3 sm:gap-4">
                                    <div className="p-2 sm:p-3 bg-orange-500/10 rounded-lg text-orange-500">
                                        <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <div>
                                        <p className="text-zinc-500 text-xs sm:text-sm">Preparation</p>
                                        <p className="font-semibold text-xs sm:text-base">15-20 Mins</p>
                                    </div>
                                </div>
                                <div className="bg-zinc-900/50 p-3 sm:p-4 rounded-xl border border-zinc-800 flex items-center gap-3 sm:gap-4">
                                    <div className="p-2 sm:p-3 bg-green-500/10 rounded-lg text-green-500">
                                        <Utensils className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <div>
                                        <p className="text-zinc-500 text-xs sm:text-sm">Serving</p>
                                        <p className="font-semibold text-xs sm:text-base">1 Person</p>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Add to Cart */}
                            <div className="hidden sm:flex items-center gap-4">
                                <div className="flex-1">
                                    <AddToCartButton product={JSON.parse(JSON.stringify(product))} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Add to Cart */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-zinc-800 px-4 pt-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
                <AddToCartButton product={JSON.parse(JSON.stringify(product))} />
            </div>

            {/* Spacer for mobile sticky bar */}
            <div className="sm:hidden h-24" />

            {/* Footer - hidden on mobile for cleaner app feel */}
            <div className="hidden sm:block">
                <Footer />
            </div>
        </div>
    );
}
