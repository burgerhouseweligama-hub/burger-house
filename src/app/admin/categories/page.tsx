'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Loader2, Grid3X3, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
    createdAt: string;
}

interface FormData {
    name: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    }

    async function onSubmit(data: FormData) {
        setSaving(true);
        setError(null);

        try {
            const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
            const method = editingCategory ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    image: imageUrl,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `Failed to ${editingCategory ? 'update' : 'create'} category`);
            }

            await fetchCategories();
            reset({ name: '' });
            setImageUrl('');
            setEditingCategory(null);
            setDialogOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : `Failed to ${editingCategory ? 'update' : 'create'} category`);
        } finally {
            setSaving(false);
        }
    }

    function handleDialogOpenChange(open: boolean) {
        setDialogOpen(open);
        if (!open) {
            setEditingCategory(null);
            reset({ name: '' });
            setImageUrl('');
            setError(null);
        }
    }

    async function deleteCategory(id: string) {
        if (!confirm('Are you sure you want to delete this category?')) return;

        setDeleting(id);
        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to delete category');
            }

            await fetchCategories();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete category');
        } finally {
            setDeleting(null);
        }
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Categories</h2>
                    <p className="text-sm sm:text-base text-zinc-400">Manage your menu categories</p>
                </div>

                <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                    <DialogTrigger asChild>
                        <Button className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto text-sm sm:text-base">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-900 border-zinc-800 text-white mx-4 sm:mx-auto max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Category Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Burgers, Drinks, Sides"
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                    {...register('name', { required: 'Category name is required' })}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Category Image</Label>
                                <ImageUpload value={imageUrl} onChange={setImageUrl} disabled={saving} />
                            </div>

                            {error && (
                                <p className="text-red-500 text-xs sm:text-sm">{error}</p>
                            )}

                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
                                >
                                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    {editingCategory ? 'Update Category' : 'Create Category'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="px-4 sm:px-6">
                    <CardTitle className="text-white flex items-center text-base sm:text-lg">
                        <Grid3X3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-orange-500" />
                        All Categories
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-8 sm:py-12">
                            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 animate-spin" />
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-8 sm:py-12">
                            <Grid3X3 className="h-10 w-10 sm:h-12 sm:w-12 text-zinc-600 mx-auto mb-3 sm:mb-4" />
                            <p className="text-zinc-400 text-sm sm:text-base">No categories yet</p>
                            <p className="text-zinc-500 text-xs sm:text-sm">
                                Create your first category to get started
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile Card View */}
                            <div className="block lg:hidden space-y-3">
                                {categories.map((category) => (
                                    <div
                                        key={category._id}
                                        className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                                                {category.image ? (
                                                    <Image
                                                        src={category.image}
                                                        alt={category.name}
                                                        width={48}
                                                        height={48}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Grid3X3 className="h-5 w-5 text-zinc-600" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-medium truncate">{category.name}</p>
                                                <p className="text-zinc-500 text-xs truncate">{category.slug}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 flex-shrink-0"
                                                    onClick={() => {
                                                        setEditingCategory(category);
                                                        reset({ name: category.name });
                                                        setImageUrl(category.image || '');
                                                        setDialogOpen(true);
                                                    }}
                                                    disabled={deleting === category._id}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0"
                                                    onClick={() => deleteCategory(category._id)}
                                                    disabled={deleting === category._id}
                                                >
                                                    {deleting === category._id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                </Button>
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
                                            <TableHead className="text-zinc-400">Slug</TableHead>
                                            <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {categories.map((category) => (
                                            <TableRow
                                                key={category._id}
                                                className="border-zinc-800 hover:bg-zinc-800/50"
                                            >
                                                <TableCell>
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-800">
                                                        {category.image ? (
                                                            <Image
                                                                src={category.image}
                                                                alt={category.name}
                                                                width={48}
                                                                height={48}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Grid3X3 className="h-5 w-5 text-zinc-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-white font-medium">
                                                    {category.name}
                                                </TableCell>
                                                <TableCell className="text-zinc-400">
                                                    {category.slug}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
                                                            onClick={() => {
                                                                setEditingCategory(category);
                                                                reset({ name: category.name });
                                                                setImageUrl(category.image || '');
                                                                setDialogOpen(true);
                                                            }}
                                                            disabled={deleting === category._id}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                            onClick={() => deleteCategory(category._id)}
                                                            disabled={deleting === category._id}
                                                        >
                                                            {deleting === category._id ? (
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
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
