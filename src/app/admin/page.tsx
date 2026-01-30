'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Grid3X3, UtensilsCrossed, ArrowRight, Loader2, ShoppingBag, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
            title: 'Total Revenue',
            value: '$12,450', // Mock data for now
            subValue: '+15.3% from last month',
            icon: DollarSign,
            href: '/admin/orders',
            gradient: 'from-emerald-500 to-teal-600',
            iconColor: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
        },
        {
            title: 'Active Orders',
            value: stats.orders.toString(),
            subValue: '+5 new today',
            icon: ShoppingBag,
            href: '/admin/orders',
            gradient: 'from-orange-500 to-red-600',
            iconColor: 'text-orange-500',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/20'
        },
        {
            title: 'Menu Items',
            value: stats.products.toString(),
            subValue: `${stats.categories} categories active`,
            icon: UtensilsCrossed,
            href: '/admin/products',
            gradient: 'from-blue-500 to-indigo-600',
            iconColor: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            title: 'Total Customers',
            value: '1,205', // Mock data
            subValue: '+12% new users',
            icon: Users,
            href: '/admin/users', // Assuming this route might exist or be added
            gradient: 'from-purple-500 to-pink-600',
            iconColor: 'text-purple-500',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20'
        },
    ];

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="relative">
                <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Admin</span>
                </h2>
                <p className="text-zinc-400 text-lg">
                    Here's what's happening in your restaurant today.
                </p>

                {/* Decorative blob */}
                <div className="absolute top-1/2 right-10 -translate-y-1/2 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -z-10 pointer-events-none" />
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {dashboardCards.map((card, idx) => (
                    <Link href={card.href} key={idx} className="block group">
                        <div className={`
                            relative overflow-hidden
                            bg-zinc-900/40 backdrop-blur-md border border-white/5 
                            rounded-2xl p-6 transition-all duration-300
                            hover:bg-zinc-900/60 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20
                            hover:border-white/10
                        `}>
                            {/* Hover Gradient Glow */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${card.gradient} transition-opacity duration-500`} />

                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${card.bg} border ${card.border}`}>
                                        <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                                    </div>
                                    <div className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        +12%
                                    </div>
                                </div>

                                <div>
                                    <p className="text-zinc-400 text-sm font-medium mb-1">{card.title}</p>
                                    {loading ? (
                                        <Loader2 className="h-8 w-8 text-zinc-600 animate-spin" />
                                    ) : (
                                        <h3 className="text-3xl font-bold text-white tracking-tight mb-1">{card.value}</h3>
                                    )}
                                    <p className="text-zinc-500 text-xs">{card.subValue}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-orange-500 rounded-full" />
                    Quick Actions
                </h3>
                <div className="grid gap-6 md:grid-cols-3">
                    <Link href="/admin/orders" className="group">
                        <div className="h-full bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                <ShoppingBag className="h-24 w-24 text-orange-500" />
                            </div>

                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 text-orange-500">
                                    <ShoppingBag className="h-6 w-6" />
                                </div>
                                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">Manage Orders</h4>
                                <p className="text-zinc-400 text-sm mb-6">View and process incoming customer orders. Update statuses & track delivery.</p>

                                <div className="flex items-center text-sm font-medium text-white group-hover:translate-x-2 transition-transform duration-300">
                                    Go to Orders <ArrowRight className="h-4 w-4 ml-2 text-orange-500" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin/products" className="group">
                        <div className="h-full bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                <UtensilsCrossed className="h-24 w-24 text-blue-500" />
                            </div>

                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 text-blue-500">
                                    <UtensilsCrossed className="h-6 w-6" />
                                </div>
                                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Manage Menu</h4>
                                <p className="text-zinc-400 text-sm mb-6">Add new items, update prices, or change availability of your products.</p>

                                <div className="flex items-center text-sm font-medium text-white group-hover:translate-x-2 transition-transform duration-300">
                                    Go to Products <ArrowRight className="h-4 w-4 ml-2 text-blue-500" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin/categories" className="group">
                        <div className="h-full bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                <Grid3X3 className="h-24 w-24 text-purple-500" />
                            </div>

                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300 text-purple-500">
                                    <Grid3X3 className="h-6 w-6" />
                                </div>
                                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Categories</h4>
                                <p className="text-zinc-400 text-sm mb-6">Organize your menu structure. Create, edit, or remove food categories.</p>

                                <div className="flex items-center text-sm font-medium text-white group-hover:translate-x-2 transition-transform duration-300">
                                    Go to Categories <ArrowRight className="h-4 w-4 ml-2 text-purple-500" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
