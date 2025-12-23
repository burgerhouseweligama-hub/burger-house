'use client';

import React, { useEffect, useState } from 'react';
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

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    }

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Products</h2>
                    <p className="text-zinc-400">Manage your menu items</p>
                </div>

                <Link href="/admin/products/new">
                    <Button className="bg-orange-500 hover:bg-orange-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </Link>
            </div>

            {/* Products Table */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center">
                        <UtensilsCrossed className="h-5 w-5 mr-2 text-orange-500" />
                        All Products
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12">
                            <UtensilsCrossed className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                            <p className="text-zinc-400">No products yet</p>
                            <p className="text-zinc-500 text-sm mb-4">
                                Create your first product to get started
                            </p>
                            <Link href="/admin/products/new">
                                <Button className="bg-orange-500 hover:bg-orange-600">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Product
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
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
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
