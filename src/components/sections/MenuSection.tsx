"use client";

import { useState, useEffect, useCallback } from "react";
import { Flame, Loader2, Sparkles, ChevronDown } from "lucide-react";
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

interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const ITEMS_PER_PAGE = 12;

export default function MenuSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    // Fetch categories once
    useEffect(() => {
        fetch("/api/categories")
            .then((res) => res.json())
            .then((data) => setCategories(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    // Fetch products with pagination
    const fetchProducts = useCallback(async (page: number, append = false) => {
        try {
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);

            const params = new URLSearchParams({
                page: String(page),
                limit: String(ITEMS_PER_PAGE),
                available: "true",
            });

            if (selectedCategory) {
                params.set("category", selectedCategory);
            }

            const res = await fetch(`/api/products?${params}`);
            if (!res.ok) {
                throw new Error("Failed to fetch products");
            }

            const data: ProductsResponse = await res.json();

            if (append) {
                setProducts((prev) => [...prev, ...data.products]);
            } else {
                setProducts(data.products);
            }

            setTotalItems(data.total);
            setCurrentPage(data.page);
            setHasMore(data.page < data.totalPages);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to load menu. Please try again later.");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [selectedCategory]);

    // Initial fetch and when category changes
    useEffect(() => {
        setCurrentPage(1);
        setProducts([]);
        fetchProducts(1, false);
    }, [fetchProducts]);

    // Handle Load More
    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            fetchProducts(currentPage + 1, true);
        }
    };

    // Handle category change
    const handleCategoryChange = (categoryId: string | null) => {
        if (selectedCategory !== categoryId) {
            setSelectedCategory(categoryId);
        }
    };

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
                        <div className="flex flex-nowrap md:flex-wrap overflow-x-auto pb-4 md:pb-0 justify-start md:justify-center gap-3 px-4 md:px-0 scrollbar-hide snap-x">
                            <button
                                onClick={() => handleCategoryChange(null)}
                                className={`group relative px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 whitespace-nowrap snap-center flex-shrink-0 ${selectedCategory === null
                                    ? "text-white"
                                    : "text-zinc-400 hover:text-white bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700"
                                    }`}
                            >
                                {selectedCategory === null && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl" />
                                )}
                                <span className="relative flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    All Items
                                </span>
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category._id}
                                    onClick={() => handleCategoryChange(category._id)}
                                    className={`group relative px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 whitespace-nowrap snap-center flex-shrink-0 ${selectedCategory === category._id
                                        ? "text-white"
                                        : "text-zinc-400 hover:text-white bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700"
                                        }`}
                                >
                                    {selectedCategory === category._id && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl" />
                                    )}
                                    <span className="relative">{category.name}</span>
                                </button>
                            ))}
                        </div>
                        {/* Item Count */}
                        <p className="text-center text-zinc-500 text-sm mt-4">
                            Showing {products.length} of {totalItems} item{totalItems !== 1 ? 's' : ''}
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
                            onClick={() => fetchProducts(1, false)}
                            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all text-white"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && products.length === 0 && (
                    <div className="text-center py-24 bg-zinc-900/30 rounded-3xl border border-zinc-800">
                        <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Flame className="w-10 h-10 text-zinc-600" />
                        </div>
                        <p className="text-zinc-400 text-lg mb-2">No items found in this category.</p>
                        <p className="text-zinc-500 text-sm">Try selecting a different category or check back later.</p>
                    </div>
                )}

                {/* Menu Grid */}
                {!loading && !error && products.length > 0 && (
                    <>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product, index) => (
                                <div
                                    key={product._id}
                                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                                    style={{ animationDelay: `${Math.min(index, 11) * 50}ms` }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="flex justify-center mt-12">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="group relative px-8 py-4 bg-zinc-900 border border-zinc-700 rounded-full font-semibold text-white hover:bg-zinc-800 hover:border-zinc-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loadingMore ? (
                                        <span className="flex items-center gap-3">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Loading...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-3">
                                            Load More
                                            <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <ChevronDown className="w-4 h-4" />
                                            </span>
                                        </span>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* All Items Loaded Message */}
                        {!hasMore && products.length > ITEMS_PER_PAGE && (
                            <p className="text-center text-zinc-500 text-sm mt-8">
                                You&apos;ve seen all {totalItems} items ✓
                            </p>
                        )}
                    </>
                )}

                {/* View All Link (for homepage use) */}
                {!loading && !error && products.length > 0 && (
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
