'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Trash2, Pencil, Loader2, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Pagination from '@/components/admin/Pagination';
import SearchFilterBar from '@/components/admin/SearchFilterBar';

interface Category {
    _id: string;
    name: string;
    slug: string;
}

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: Category;
    image: string;
    isAvailable: boolean;
    createdAt: string;
}

interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Fetch categories once
    useEffect(() => {
        fetch('/api/categories')
            .then((res) => res.json())
            .then((data) => setCategories(Array.isArray(data) ? data : []))
            .catch((err) => console.error('Error fetching categories:', err));
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(currentPage),
                limit: String(pageSize),
            });

            if (categoryFilter !== 'all') {
                params.set('category', categoryFilter);
            }
            if (searchQuery) {
                params.set('search', searchQuery);
            }

            const res = await fetch(`/api/products?${params}`);
            const data: ProductsResponse = await res.json();
            setProducts(data.products || []);
            setTotalItems(data.total || 0);
            setTotalPages(data.totalPages || 0);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, categoryFilter, searchQuery]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleFilterChange = (key: string, value: string) => {
        if (key === 'category') {
            setCategoryFilter(value);
            setCurrentPage(1);
        }
    };

    const handleClearFilters = () => {
        setCategoryFilter('all');
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    async function deleteProduct(id: string) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        setDeleting(id);
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to delete product');
            }

            await fetchProducts();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete product');
        } finally {
            setDeleting(null);
        }
    }

    async function toggleAvailability(product: Product) {
        try {
            const res = await fetch(`/api/products/${product._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isAvailable: !product.isAvailable }),
            });

            if (!res.ok) throw new Error('Failed to update availability');

            await fetchProducts();
        } catch (err) {
            console.error('Error toggling availability:', err);
        }
    }

    // Build category filter options
    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        ...categories.map((cat) => ({ value: cat._id, label: cat.name })),
    ];

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Products</h2>
                    <p className="text-sm sm:text-base text-zinc-400">Manage your menu items</p>
                </div>

                <Link href="/admin/products/new">
                    <Button className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto text-sm sm:text-base">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </Link>
            </div>

            {/* Search & Filters */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4 sm:p-6">
                    <SearchFilterBar
                        searchPlaceholder="Search by product name..."
                        searchValue={searchQuery}
                        onSearchChange={handleSearchChange}
                        filters={[
                            {
                                key: 'category',
                                label: 'Category',
                                options: categoryOptions,
                                defaultValue: 'all',
                            },
                        ]}
                        filterValues={{ category: categoryFilter }}
                        onFilterChange={handleFilterChange}
                        onClear={handleClearFilters}
                        isLoading={loading}
                    />
                </CardContent>
            </Card>

            {/* Products Table */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="px-4 sm:px-6">
                    <CardTitle className="text-white flex items-center text-base sm:text-lg">
                        <UtensilsCrossed className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-orange-500" />
                        All Products
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-8 sm:py-12">
                            <UtensilsCrossed className="h-10 w-10 sm:h-12 sm:w-12 text-zinc-600 mx-auto mb-3 sm:mb-4" />
                            <p className="text-zinc-400 text-sm sm:text-base">
                                {searchQuery || categoryFilter !== 'all'
                                    ? 'No products match your filters'
                                    : 'No products yet'}
                            </p>
                            {!searchQuery && categoryFilter === 'all' && (
                                <>
                                    <p className="text-zinc-500 text-xs sm:text-sm mb-4">
                                        Create your first product to get started
                                    </p>
                                    <Link href="/admin/products/new">
                                        <Button className="bg-orange-500 hover:bg-orange-600 text-sm sm:text-base">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Your First Product
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Mobile Card View */}
                            <div className="block lg:hidden space-y-3">
                                {products.map((product) => (
                                    <div
                                        key={product._id}
                                        className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                                                {product.image ? (
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        width={56}
                                                        height={56}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <UtensilsCrossed className="h-5 w-5 text-zinc-600" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <p className="text-white font-medium truncate">{product.name}</p>
                                                        <span className="inline-block mt-1 px-2 py-0.5 bg-zinc-700 rounded-full text-[10px] text-zinc-300">
                                                            {product.category?.name || 'Uncategorized'}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => toggleAvailability(product)}
                                                        className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${product.isAvailable
                                                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                            }`}
                                                    >
                                                        {product.isAvailable ? 'Available' : 'Unavailable'}
                                                    </button>
                                                </div>
                                                {product.description && (
                                                    <p className="text-zinc-500 text-xs line-clamp-1 mt-1">
                                                        {product.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between mt-3">
                                                    <p className="text-white font-semibold text-sm">
                                                        LKR {product.price.toLocaleString()}
                                                    </p>
                                                    <div className="flex gap-1">
                                                        <Link href={`/admin/products/${product._id}/edit`}>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-700"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                            onClick={() => deleteProduct(product._id)}
                                                            disabled={deleting === product._id}
                                                        >
                                                            {deleting === product._id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-zinc-800 hover:bg-transparent">
                                            <TableHead className="text-zinc-400">Image</TableHead>
                                            <TableHead className="text-zinc-400">Name</TableHead>
                                            <TableHead className="text-zinc-400">Category</TableHead>
                                            <TableHead className="text-zinc-400">Price</TableHead>
                                            <TableHead className="text-zinc-400">Status</TableHead>
                                            <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.map((product) => (
                                            <TableRow
                                                key={product._id}
                                                className="border-zinc-800 hover:bg-zinc-800/50"
                                            >
                                                <TableCell>
                                                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-zinc-800">
                                                        {product.image ? (
                                                            <Image
                                                                src={product.image}
                                                                alt={product.name}
                                                                width={56}
                                                                height={56}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <UtensilsCrossed className="h-5 w-5 text-zinc-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="text-white font-medium">{product.name}</p>
                                                        {product.description && (
                                                            <p className="text-zinc-500 text-sm line-clamp-1">
                                                                {product.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="px-2 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">
                                                        {product.category?.name || 'Uncategorized'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-white font-medium">
                                                    LKR {product.price.toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <button
                                                        onClick={() => toggleAvailability(product)}
                                                        className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${product.isAvailable
                                                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                            }`}
                                                    >
                                                        {product.isAvailable ? 'Available' : 'Unavailable'}
                                                    </button>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/admin/products/${product._id}/edit`}>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                            onClick={() => deleteProduct(product._id)}
                                                            disabled={deleting === product._id}
                                                        >
                                                            {deleting === product._id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            <div className="mt-4 border-t border-zinc-800 pt-4">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={totalItems}
                                    pageSize={pageSize}
                                    onPageChange={handlePageChange}
                                    onPageSizeChange={handlePageSizeChange}
                                    isLoading={loading}
                                />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
