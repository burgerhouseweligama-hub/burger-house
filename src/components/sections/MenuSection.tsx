"use client";

import { useState, useEffect } from "react";
import { Flame, Loader2, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";

// Types
interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
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

export default function MenuSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch products and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [categoriesRes, productsRes] = await Promise.all([
                    fetch("/api/categories"),
                    fetch("/api/products?available=true"),
                ]);

                if (!categoriesRes.ok || !productsRes.ok) {
                    throw new Error("Failed to fetch data");
                }

                const categoriesData = await categoriesRes.json();
                const productsData = await productsRes.json();

                setCategories(categoriesData);
                setProducts(productsData);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load menu. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter products by category
    const filteredProducts = selectedCategory
        ? products.filter((p) => p.category?._id === selectedCategory)
        : products;

    return (
        <section id="menu" className="py-24 md:py-32 relative overflow-hidden bg-black">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center space-y-6 mb-16">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900/80 backdrop-blur-md border border-zinc-700 rounded-full text-orange-400 text-sm font-medium">
                        <Flame className="w-4 h-4" />
                        Freshly Made Daily
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black">
                        <span className="text-white">Explore Our </span>
                        <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
                            Delicious Menu
                        </span>
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Every burger is handcrafted with premium ingredients and grilled to perfection.
                        Experience the taste that keeps customers coming back for more.
                    </p>
                </div>

                {/* Category Filter Tabs */}
                {categories.length > 0 && (
                    <div className="mb-12">
                        <div className="flex flex-wrap justify-center gap-3">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`group relative px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 overflow-hidden ${selectedCategory === null
                                        ? "text-white"
                                        : "text-zinc-400 hover:text-white bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700"
                                    }`}
                            >
                                {selectedCategory === null && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600" />
                                )}
                                <span className="relative flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    All Items
                                </span>
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category._id}
                                    onClick={() => setSelectedCategory(category._id)}
                                    className={`group relative px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 overflow-hidden ${selectedCategory === category._id
                                            ? "text-white"
                                            : "text-zinc-400 hover:text-white bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700"
                                        }`}
                                >
                                    {selectedCategory === category._id && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600" />
                                    )}
                                    <span className="relative">{category.name}</span>
                                </button>
                            ))}
                        </div>
                        {/* Active Filter Count */}
                        <p className="text-center text-zinc-500 text-sm mt-4">
                            Showing {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col justify-center items-center py-24 gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-zinc-800 rounded-full" />
                            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-orange-500 rounded-full border-t-transparent animate-spin" />
                        </div>
                        <p className="text-zinc-400">Loading delicious items...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-zinc-800">
                        <p className="text-red-400 text-lg mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all text-white"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredProducts.length === 0 && (
                    <div className="text-center py-24 bg-zinc-900/30 rounded-3xl border border-zinc-800">
                        <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Flame className="w-10 h-10 text-zinc-600" />
                        </div>
                        <p className="text-zinc-400 text-lg mb-2">No items found in this category.</p>
                        <p className="text-zinc-500 text-sm">Try selecting a different category or check back later.</p>
                    </div>
                )}

                {/* Menu Grid */}
                {!loading && !error && filteredProducts.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product, index) => (
                            <div
                                key={product._id}
                                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}

                {/* View All Link */}
                {!loading && !error && filteredProducts.length > 0 && (
                    <div className="text-center mt-16">
                        <Link
                            href="/menu"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-900 border border-zinc-700 rounded-full font-semibold text-white hover:bg-zinc-800 hover:border-zinc-600 transition-all group"
                        >
                            View Full Menu
                            <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
