import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Product from '@/models/Product';
import connectToDatabase from '@/lib/db';
import { ArrowLeft, Star, Clock, Utensils } from 'lucide-react';
import Link from 'next/link';
import AddToCartButton from '@/components/ui/AddToCartButton'; // We will create this client component

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
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                <Link
                    href="/menu"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Menu
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Image Section */}
                    <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-zinc-900 border-2 border-zinc-800 shadow-2xl shadow-orange-500/10 order-1 lg:order-1">
                        {product.image ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                <Utensils className="w-20 h-20" />
                            </div>
                        )}
                        <div className="absolute top-6 left-6">
                            <span className="px-4 py-2 bg-black/60 backdrop-blur-md text-white rounded-full font-semibold border border-white/10">
                                {(product.category as any)?.name || 'Specialty'}
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col h-full justify-center order-2 lg:order-2">
                        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent mb-6">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-6 mb-8">
                            <span className="text-4xl font-bold text-orange-500">
                                LKR {(product.price).toLocaleString()}
                            </span>
                            <div className="h-8 w-px bg-zinc-800" />
                            <div className="flex items-center gap-1 text-yellow-400">
                                <Star className="w-5 h-5 fill-current" />
                                <span className="font-semibold text-white">4.8</span>
                                <span className="text-zinc-500 ml-1">(120+ reviews)</span>
                            </div>
                        </div>

                        <p className="text-zinc-400 text-lg leading-relaxed mb-10 border-l-4 border-orange-500 pl-6">
                            {product.description || "A delicious handcrafted burger made with premium ingredients and our signature secret sauce. Experience the perfect balance of flavors in every bite."}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
                                <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-zinc-500 text-sm">Preparation</p>
                                    <p className="font-semibold">15-20 Mins</p>
                                </div>
                            </div>
                            <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
                                <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
                                    <Utensils className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-zinc-500 text-sm">Serving</p>
                                    <p className="font-semibold">1 Person</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <AddToCartButton product={JSON.parse(JSON.stringify(product))} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
