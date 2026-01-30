'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Grid3X3, UtensilsCrossed, ArrowRight, Loader2, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Stats {
    categories: number;
    products: number;
    orders: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({ categories: 0, products: 0, orders: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const [categoriesRes, productsRes, ordersRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch('/api/products'),
                    fetch('/api/admin/orders'),
                ]);

                const categories = await categoriesRes.json();
                const products = await productsRes.json();
                const orders = await ordersRes.json();

                setStats({
                    categories: Array.isArray(categories) ? categories.length : 0,
                    products: Array.isArray(products) ? products.length : 0,
                    orders: Array.isArray(orders) ? orders.length : 0,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    const dashboardCards = [
        {
            title: 'Orders',
            value: stats.orders,
            icon: ShoppingBag,
            href: '/admin/orders',
            color: 'from-green-500 to-green-600',
        },
        {
            title: 'Categories',
            value: stats.categories,
            icon: Grid3X3,
            href: '/admin/categories',
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Products',
            value: stats.products,
            icon: UtensilsCrossed,
            href: '/admin/products',
            color: 'from-orange-500 to-orange-600',
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Dashboard</h2>
                <p className="text-zinc-400">
                    Welcome to Burger House Admin Panel. Manage your categories and products.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {dashboardCards.map((card) => (
                    <Card
                        key={card.title}
                        className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors"
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">
                                {card.title}
                            </CardTitle>
                            <div
                                className={`p-2 rounded-lg bg-gradient-to-br ${card.color}`}
                            >
                                <card.icon className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Loader2 className="h-6 w-6 text-zinc-400 animate-spin" />
                            ) : (
                                <div className="text-3xl font-bold text-white">{card.value}</div>
                            )}
                            <Link
                                href={card.href}
                                className="flex items-center text-sm text-orange-500 hover:text-orange-400 mt-2 group"
                            >
                                View all
                                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Link href="/admin/orders">
                        <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-800/50 transition-all cursor-pointer group">
                            <CardContent className="flex items-center p-6">
                                <div className="p-3 rounded-xl bg-green-500/20 mr-4">
                                    <ShoppingBag className="h-6 w-6 text-green-500" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-medium">Manage Orders</h4>
                                    <p className="text-zinc-400 text-sm">
                                        View and update customer orders
                                    </p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/categories">
                        <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-800/50 transition-all cursor-pointer group">
                            <CardContent className="flex items-center p-6">
                                <div className="p-3 rounded-xl bg-blue-500/20 mr-4">
                                    <Grid3X3 className="h-6 w-6 text-blue-500" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-medium">Manage Categories</h4>
                                    <p className="text-zinc-400 text-sm">
                                        Create and organize menu categories
                                    </p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/products">
                        <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-800/50 transition-all cursor-pointer group">
                            <CardContent className="flex items-center p-6">
                                <div className="p-3 rounded-xl bg-orange-500/20 mr-4">
                                    <UtensilsCrossed className="h-6 w-6 text-orange-500" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-medium">Manage Products</h4>
                                    <p className="text-zinc-400 text-sm">
                                        Add and edit menu items
                                    </p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}
