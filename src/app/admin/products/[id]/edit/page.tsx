'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { ArrowLeft, Loader2, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ImageUpload } from '@/components/admin/ImageUpload';

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
}

interface FormData {
    name: string;
    description: string;
    price: string;
    category: string;
    isAvailable: boolean;
}

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            name: '',
            description: '',
            price: '',
            category: '',
            isAvailable: true,
        },
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const [productRes, categoriesRes] = await Promise.all([
                    fetch(`/api/products/${productId}`),
                    fetch('/api/categories'),
                ]);

                if (!productRes.ok) {
                    if (productRes.status === 404) {
                        setNotFound(true);
                        return;
                    }
                    throw new Error('Failed to fetch product');
                }

                const product: Product = await productRes.json();
                const categoriesData = await categoriesRes.json();

                setCategories(Array.isArray(categoriesData) ? categoriesData : []);
                setImageUrl(product.image || '');

                reset({
                    name: product.name,
                    description: product.description || '',
                    price: product.price.toString(),
                    category: product.category?._id || '',
                    isAvailable: product.isAvailable,
                });
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load product data');
            } finally {
                setLoading(false);
            }
        }

        if (productId) {
            fetchData();
        }
    }, [productId, reset]);

    async function onSubmit(data: FormData) {
        setSaving(true);
        setError(null);

        try {
            const payload = {
                name: data.name,
                description: data.description,
                price: parseFloat(data.price),
                category: data.category,
                image: imageUrl,
                isAvailable: data.isAvailable,
            };

            const res = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to update product');
            }

            router.push('/admin/products');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update product');
        } finally {
            setSaving(false);
        }
    }

    if (notFound) {
        return (
            <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    <Link href="/admin/products">
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800 h-8 w-8 sm:h-10 sm:w-10">
                            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white">Product Not Found</h2>
                        <p className="text-sm sm:text-base text-zinc-400">The product you're looking for doesn't exist</p>
                    </div>
                </div>
                <Link href="/admin/products">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-sm sm:text-base">
                        Back to Products
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 sm:gap-4">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800 h-8 w-8 sm:h-10 sm:w-10">
                        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Edit Product</h2>
                    <p className="text-sm sm:text-base text-zinc-400">Update menu item details</p>
                </div>
            </div>

            {/* Form Card */}
            <Card className="bg-zinc-900 border-zinc-800 max-w-3xl">
                <CardHeader className="px-4 sm:px-6">
                    <CardTitle className="text-white flex items-center text-base sm:text-lg">
                        <UtensilsCrossed className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-orange-500" />
                        Product Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-8 sm:py-12">
                            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 animate-spin" />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm sm:text-base">Product Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Classic Burger"
                                        className="bg-zinc-800 border-zinc-700 text-white text-sm sm:text-base"
                                        {...register('name', { required: 'Product name is required' })}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs sm:text-sm">{errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-sm sm:text-base">Price (LKR)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="1"
                                        min="0"
                                        placeholder="1500"
                                        className="bg-zinc-800 border-zinc-700 text-white text-sm sm:text-base"
                                        {...register('price', {
                                            required: 'Price is required',
                                            min: { value: 0, message: 'Price must be positive' },
                                        })}
                                    />
                                    {errors.price && (
                                        <p className="text-red-500 text-xs sm:text-sm">{errors.price.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
                                <textarea
                                    id="description"
                                    placeholder="Describe your product..."
                                    rows={3}
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                                    {...register('description')}
                                />
                            </div>

                            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-sm sm:text-base">Category</Label>
                                    <Controller
                                        name="category"
                                        control={control}
                                        rules={{ required: 'Category is required' }}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white text-sm sm:text-base">
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                                    {categories.map((cat) => (
                                                        <SelectItem
                                                            key={cat._id}
                                                            value={cat._id}
                                                            className="text-white focus:bg-zinc-700"
                                                        >
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.category && (
                                        <p className="text-red-500 text-xs sm:text-sm">{errors.category.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm sm:text-base">Availability</Label>
                                    <div className="flex items-center space-x-2 h-10">
                                        <input
                                            type="checkbox"
                                            id="isAvailable"
                                            className="w-4 h-4 rounded bg-zinc-800 border-zinc-600 text-orange-500 focus:ring-orange-500"
                                            {...register('isAvailable')}
                                        />
                                        <Label htmlFor="isAvailable" className="text-zinc-300 font-normal cursor-pointer text-sm sm:text-base">
                                            Product is available for order
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm sm:text-base">Product Image</Label>
                                <ImageUpload value={imageUrl} onChange={setImageUrl} disabled={saving} />
                                {imageUrl && (
                                    <div className="mt-3 sm:mt-4">
                                        <p className="text-xs sm:text-sm text-zinc-400 mb-2">Current Image:</p>
                                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-zinc-800">
                                            <Image
                                                src={imageUrl}
                                                alt="Product preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <p className="text-red-500 text-xs sm:text-sm">{error}</p>
                                </div>
                            )}

                            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4 border-t border-zinc-800">
                                <Link href="/admin/products" className="w-full sm:w-auto">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 w-full"
                                    >
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
                                >
                                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    Update Product
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
