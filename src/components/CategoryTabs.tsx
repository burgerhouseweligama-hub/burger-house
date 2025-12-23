'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface Category {
    _id: string;
    name: string;
    slug: string;
}

interface CategoryTabsProps {
    categories: Category[];
    activeCategory: string | null;
    onCategoryChange: (categoryId: string | null) => void;
    loading?: boolean;
}

export function CategoryTabs({
    categories,
    activeCategory,
    onCategoryChange,
    loading = false,
}: CategoryTabsProps) {
    if (loading) {
        return (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-10 w-24 rounded-full bg-zinc-800" />
                ))}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto pb-2 scrollbar-hide">
            <Tabs
                value={activeCategory || 'all'}
                onValueChange={(val) => onCategoryChange(val === 'all' ? null : val)}
                className="w-max"
            >
                <TabsList className="bg-zinc-900/50 border border-zinc-800 rounded-full p-1 h-auto">
                    <TabsTrigger
                        value="all"
                        className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=inactive]:text-zinc-400 transition-all"
                    >
                        All
                    </TabsTrigger>
                    {categories.map((category) => (
                        <TabsTrigger
                            key={category._id}
                            value={category._id}
                            className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=inactive]:text-zinc-400 transition-all"
                        >
                            {category.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    );
}
