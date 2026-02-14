"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Flame, Loader2, Sparkles, Search, X } from "lucide-react";
import Image from "next/image";
import { MobileProductCard } from "@/components/MobileProductCard";

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

interface GroupedProducts {
    category: Category;
    products: Product[];
}

interface GroupedProducts {
    category: Category;
    products: Product[];
}

export default function MobileMenuSection() {
    const [groupedProducts, setGroupedProducts] = useState<GroupedProducts[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Refs
    const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
    const tabsContainerRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
    const isClickScrolling = useRef(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Fetch all data on mount
    const fetchData = useCallback(async () => {
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

            const categoriesData: Category[] = await categoriesRes.json();
            const productsData: Product[] = await productsRes.json();

            setCategories(categoriesData);

            // Group products by category
            const grouped: GroupedProducts[] = [];
            for (const cat of categoriesData) {
                const catProducts = productsData.filter(
                    (p) => p.category?._id === cat._id
                );
                if (catProducts.length > 0) {
                    grouped.push({ category: cat, products: catProducts });
                }
            }

            setGroupedProducts(grouped);

            // Set initial active category
            if (grouped.length > 0) {
                setActiveCategory(grouped[0].category._id);
            }
        } catch (err) {
            console.error("Error fetching menu data:", err);
            setError("Failed to load menu. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // IntersectionObserver for scroll spy
    useEffect(() => {
        if (loading || groupedProducts.length === 0) return;

        // Small delay to ensure DOM sections are rendered
        const timeout = setTimeout(() => {
            observerRef.current = new IntersectionObserver(
                (entries) => {
                    if (isClickScrolling.current) return;

                    // Find the topmost visible section
                    const visibleEntries = entries.filter((e) => e.isIntersecting);
                    if (visibleEntries.length > 0) {
                        // Pick the one closest to the top
                        const topEntry = visibleEntries.reduce((prev, curr) =>
                            prev.boundingClientRect.top < curr.boundingClientRect.top
                                ? prev
                                : curr
                        );
                        const catId = topEntry.target.getAttribute("data-category-id");
                        if (catId) {
                            setActiveCategory(catId);
                            scrollTabIntoView(catId);
                        }
                    }
                },
                {
                    rootMargin: "-140px 0px -60% 0px",
                    threshold: 0,
                }
            );

            sectionRefs.current.forEach((el) => {
                observerRef.current?.observe(el);
            });
        }, 100);

        return () => {
            clearTimeout(timeout);
            observerRef.current?.disconnect();
        };
    }, [loading, groupedProducts]);

    // Scroll the active tab into view in the horizontal tab bar
    const scrollTabIntoView = (categoryId: string) => {
        const tab = tabRefs.current.get(categoryId);
        if (tab && tabsContainerRef.current) {
            tab.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
            });
        }
    };

    // Handle tab click — smooth scroll to section
    const handleTabClick = (categoryId: string) => {
        setActiveCategory(categoryId);
        scrollTabIntoView(categoryId);

        const section = sectionRefs.current.get(categoryId);
        if (section) {
            isClickScrolling.current = true;

            const yOffset = -140; // account for navbar (80px) + sticky tabs (~44px)
            const y = section.getBoundingClientRect().top + window.scrollY + yOffset;

            window.scrollTo({ top: y, behavior: "smooth" });

            // Re-enable scroll spy after animation
            setTimeout(() => {
                isClickScrolling.current = false;
            }, 800);
        }
    };

    // Filter products by search
    const filteredGroups = searchQuery.trim()
        ? groupedProducts
            .map((g) => ({
                ...g,
                products: g.products.filter(
                    (p) =>
                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
                ),
            }))
            .filter((g) => g.products.length > 0)
        : groupedProducts;

    const totalItems = filteredGroups.reduce((sum, g) => sum + g.products.length, 0);

    return (
        <section className="relative min-h-screen bg-black">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-orange-500/8 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-red-500/8 rounded-full blur-[100px]" />
            </div>

            {/* Page Header */}
            <div className="relative z-10 pt-6 pb-4 px-4 sm:px-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-700 rounded-full text-orange-400 text-xs font-medium mb-4">
                    <Flame className="w-3.5 h-3.5" />
                    Freshly Made Daily
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black">
                    <span className="text-white">Our </span>
                    <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
                        Menu
                    </span>
                </h1>
                <p className="text-zinc-500 text-sm sm:text-base mt-2 max-w-md mx-auto">
                    Handcrafted with premium ingredients, grilled to perfection.
                </p>

                {/* Search Toggle + Bar */}
                <div className="mt-4 max-w-md mx-auto">
                    {isSearchOpen ? (
                        <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-700 rounded-full px-4 py-2.5 backdrop-blur-md animate-fade-in-up">
                            <Search className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search menu items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                className="flex-1 bg-transparent text-white text-sm placeholder-zinc-500 outline-none"
                            />
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setIsSearchOpen(false);
                                }}
                                className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-full text-zinc-500 text-sm hover:border-zinc-700 hover:text-zinc-400 transition-all"
                        >
                            <Search className="w-4 h-4" />
                            Search menu...
                        </button>
                    )}
                </div>
            </div>

            {/* Sticky Category Tabs */}
            {categories.length > 0 && !loading && (
                <div className="sticky top-20 z-30 bg-black/90 backdrop-blur-lg border-b border-zinc-800/50">
                    <div className="max-w-7xl mx-auto">
                        <div
                            ref={tabsContainerRef}
                            className="flex overflow-x-auto scrollbar-hide gap-1 px-3 sm:px-6 py-2.5 md:justify-center"
                        >
                            {filteredGroups.map((group) => {
                                const isActive = activeCategory === group.category._id;
                                return (
                                    <button
                                        key={group.category._id}
                                        ref={(el) => {
                                            if (el) tabRefs.current.set(group.category._id, el);
                                        }}
                                        onClick={() => handleTabClick(group.category._id)}
                                        className={`relative flex-shrink-0 pl-1.5 pr-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap touch-manipulation ${isActive
                                            ? "text-white"
                                            : "text-zinc-500 hover:text-zinc-300 active:text-white"
                                            }`}
                                    >
                                        {isActive && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-full animate-scale-x" />
                                        )}
                                        <span className="relative flex items-center gap-2">
                                            {/* Dynamic Category Image */}
                                            <div className={`relative w-8 h-8 rounded-full overflow-hidden border flex-shrink-0 ${isActive ? 'border-white/20' : 'border-zinc-700/50'}`}>
                                                {group.category.image ? (
                                                    <Image
                                                        src={group.category.image}
                                                        alt={group.category.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="32px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                                        <Sparkles className="w-4 h-4 text-zinc-500" />
                                                    </div>
                                                )}
                                            </div>
                                            {group.category.name}
                                            <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full ml-0.5 ${isActive
                                                ? "bg-white/20 text-white"
                                                : "bg-zinc-800 text-zinc-500"
                                                }`}>
                                                {group.products.length}
                                            </span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-24">
                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col justify-center items-center py-32 gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 border-4 border-zinc-800 rounded-full" />
                            <div className="absolute top-0 left-0 w-14 h-14 border-4 border-orange-500 rounded-full border-t-transparent animate-spin" />
                        </div>
                        <p className="text-zinc-400 text-sm">Loading delicious items...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800 mx-1">
                        <p className="text-red-400 text-base mb-4">{error}</p>
                        <button
                            onClick={fetchData}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-semibold text-white text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && totalItems === 0 && (
                    <div className="text-center py-24 bg-zinc-900/30 rounded-2xl border border-zinc-800 mx-1">
                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Flame className="w-8 h-8 text-zinc-600" />
                        </div>
                        {searchQuery ? (
                            <>
                                <p className="text-zinc-400 text-base mb-1">
                                    No results for &ldquo;{searchQuery}&rdquo;
                                </p>
                                <p className="text-zinc-500 text-sm">Try a different search term.</p>
                            </>
                        ) : (
                            <>
                                <p className="text-zinc-400 text-base mb-1">No items available right now.</p>
                                <p className="text-zinc-500 text-sm">Check back later!</p>
                            </>
                        )}
                    </div>
                )}

                {/* Menu Sections by Category */}
                {!loading && !error && filteredGroups.length > 0 && (
                    <div className="space-y-8 sm:space-y-12 mt-4">
                        {filteredGroups.map((group, groupIndex) => (
                            <section
                                key={group.category._id}
                                ref={(el) => {
                                    if (el) sectionRefs.current.set(group.category._id, el);
                                }}
                                data-category-id={group.category._id}
                                id={`category-${group.category.slug}`}
                                className="scroll-mt-[140px]"
                            >
                                {/* Category Header */}
                                <div className="flex items-center gap-3 mb-4 sm:mb-6 px-1">
                                    <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full" />
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold text-white">
                                            {group.category.name}
                                        </h2>
                                        <p className="text-zinc-500 text-xs sm:text-sm">
                                            {group.products.length} item{group.products.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>

                                {/* Products Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                                    {group.products.map((product, index) => (
                                        <div
                                            key={product._id}
                                            className="animate-fade-in-up"
                                            style={{
                                                animationDelay: `${Math.min(index, 8) * 60 + groupIndex * 100}ms`,
                                                animationFillMode: 'backwards',
                                            }}
                                        >
                                            <MobileProductCard product={product} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}

                {/* Total Items Count */}
                {!loading && !error && totalItems > 0 && (
                    <div className="text-center mt-10 pb-4">
                        <p className="text-zinc-600 text-xs">
                            Showing all {totalItems} items across {filteredGroups.length} categories
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
