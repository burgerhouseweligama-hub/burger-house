'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Grid3X3, UtensilsCrossed, ArrowRight, Loader2, ShoppingBag, TrendingUp, Users, DollarSign, Mail, Calendar, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Stats {
    categories: number;
    products: number;
    orders: number;
    customers: number;
    revenue: number;
    activeOrders: number;
    todayOrders: number;
    todayCustomers: number;
}

interface VisitorPoint {
    date: string;
    count: number;
}

interface VisitorData {
    series: VisitorPoint[];
    today: number;
    total: number;
}

interface UserSummary {
    _id: string;
    name: string;
    email: string;
    role: string;
    authProvider?: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        categories: 0,
        products: 0,
        orders: 0,
        customers: 0,
        revenue: 0,
        activeOrders: 0,
        todayOrders: 0,
        todayCustomers: 0
    });
    const [recentUsers, setRecentUsers] = useState<UserSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
    const [visitorLoading, setVisitorLoading] = useState(true);

    const fetchStats = React.useCallback(async () => {
        try {
            const [categoriesRes, productsRes, ordersRes, usersRes] = await Promise.all([
                fetch('/api/categories'),
                fetch('/api/products'),
                fetch('/api/admin/orders'),
                fetch('/api/admin/users?limit=6'),
            ]);

            if (!categoriesRes.ok || !productsRes.ok || !ordersRes.ok || !usersRes.ok) {
                throw new Error('Failed to fetch admin stats');
            }

            const [categories, products, orders, usersData] = await Promise.all([
                categoriesRes.json(),
                productsRes.json(),
                ordersRes.json(),
                usersRes.json(),
            ]);

            const ordersArray = Array.isArray(orders) ? orders : (orders.orders || []);
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            const totalRevenue = ordersArray.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
            const activeOrders = ordersArray.filter((order: any) => order.status !== 'delivered' && order.status !== 'cancelled').length;
            const todayOrders = ordersArray.filter((order: any) => order.createdAt && new Date(order.createdAt) >= todayStart).length;

            setStats({
                categories: Array.isArray(categories) ? categories.length : 0,
                products: Array.isArray(products) ? products.length : 0,
                orders: ordersArray.length,
                customers: typeof usersData?.total === 'number' ? usersData.total : 0,
                revenue: totalRevenue,
                activeOrders,
                todayOrders,
                todayCustomers: typeof usersData?.todayNew === 'number' ? usersData.todayNew : 0,
            });
            setRecentUsers(Array.isArray(usersData?.users) ? usersData.users : []);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchStats();
    }, [fetchStats]);

    useEffect(() => {
        async function fetchVisitors() {
            try {
                setVisitorLoading(true);
                const res = await fetch('/api/admin/analytics/visitors');
                if (!res.ok) {
                    console.error('Visitor fetch error:', res.status, res.statusText);
                    const text = await res.text();
                    console.error('Visitor response body:', text);
                    throw new Error(`Failed to load visitors: ${res.status} ${res.statusText}`);
                }
                const data = await res.json();
                setVisitorData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setVisitorLoading(false);
            }
        }

        fetchVisitors();
    }, []);

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) {
            return '—';
        }

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }

    const safeNumber = (value: number | undefined | null) => Number.isFinite(value) ? Number(value) : 0;

    // Poll for order updates every 15 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchStats();
        }, 15000);

        return () => clearInterval(interval);
    }, [fetchStats]);

    const dashboardCards = [
        {
            title: 'Total Revenue',
            value: `LKR ${safeNumber(stats.revenue).toLocaleString()}`,
            subValue: `${safeNumber(stats.orders)} orders total`,
            badgeText: safeNumber(stats.todayOrders) ? `+${safeNumber(stats.todayOrders)} today` : 'Live',
            icon: DollarSign,
            href: '/admin/orders',
            gradient: 'from-emerald-500 to-teal-600',
            iconColor: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
        },
        {
            title: 'Active Orders',
            value: safeNumber(stats.activeOrders).toString(),
            subValue: `${safeNumber(stats.todayOrders)} new today`,
            badgeText: safeNumber(stats.todayOrders) ? `+${safeNumber(stats.todayOrders)} today` : 'Live',
            icon: ShoppingBag,
            href: '/admin/orders',
            gradient: 'from-orange-500 to-red-600',
            iconColor: 'text-orange-500',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/20'
        },
        {
            title: 'Menu Items',
            value: safeNumber(stats.products).toString(),
            subValue: `${safeNumber(stats.categories)} categories active`,
            badgeText: 'Live',
            icon: UtensilsCrossed,
            href: '/admin/products',
            gradient: 'from-blue-500 to-indigo-600',
            iconColor: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            title: 'Total Customers',
            value: safeNumber(stats.customers).toLocaleString(),
            subValue: `${recentUsers.length} recent signups`,
            badgeText: safeNumber(stats.todayCustomers) ? `+${safeNumber(stats.todayCustomers)} today` : 'Live',
            icon: Users,
            href: '/admin/users', // Assuming this route might exist or be added
            gradient: 'from-purple-500 to-pink-600',
            iconColor: 'text-purple-500',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20'
        },
    ];

    function VisitorsSparkline({ points }: { points: VisitorPoint[] }) {
        if (!points.length) return null;

        const max = Math.max(...points.map(p => p.count), 1);
        const width = 320;
        const height = 96;
        const step = width / Math.max(points.length - 1, 1);

        const coords = points.map((p, i) => {
            const x = i * step;
            const y = height - (p.count / max) * height;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full text-emerald-400">
                <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={coords}
                    className="drop-shadow-[0_4px_12px_rgba(16,185,129,0.25)]"
                />
                {points.map((p, i) => {
                    const x = i * step;
                    const y = height - (p.count / max) * height;
                    return (
                        <circle key={p.date} cx={x} cy={y} r={3} fill="currentColor" className="opacity-80" />
                    );
                })}
            </svg>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Header Section */}
            <div className="relative">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 tracking-tight">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Admin</span>
                </h2>
                <p className="text-zinc-400 text-base sm:text-lg">
                    Here's what's happening in your restaurant today.
                </p>

                {/* Decorative blob */}
                <div className="absolute top-1/2 right-10 -translate-y-1/2 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-orange-500/20 rounded-full blur-3xl -z-10 pointer-events-none hidden sm:block" />
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {dashboardCards.map((card, idx) => (
                    <Link href={card.href} key={idx} className="block group">
                        <div className={`
                            relative overflow-hidden
                            bg-zinc-900/40 backdrop-blur-md border border-white/5 
                            rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 transition-all duration-300
                            hover:bg-zinc-900/60 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20
                            hover:border-white/10
                        `}>
                            {/* Hover Gradient Glow */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${card.gradient} transition-opacity duration-500`} />

                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-3 sm:mb-4">
                                    <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${card.bg} border ${card.border}`}>
                                        <card.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${card.iconColor}`} />
                                    </div>
                                    <div className="flex items-center text-[10px] sm:text-xs font-medium text-emerald-400 bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-emerald-500/20">
                                        <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                                        {card.badgeText}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-zinc-400 text-xs sm:text-sm font-medium mb-0.5 sm:mb-1">{card.title}</p>
                                    {loading ? (
                                        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-zinc-600 animate-spin" />
                                    ) : (
                                        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-0.5 sm:mb-1">{card.value}</h3>
                                    )}
                                    <p className="text-zinc-500 text-[10px] sm:text-xs">{card.subValue}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Customers */}
            <Card className="bg-zinc-900/50 border-white/5">
                <CardContent className="p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-white">Recent Customers</h3>
                            <p className="text-zinc-500 text-xs sm:text-sm">Live data from the database</p>
                        </div>
                        <Link href="/admin/users" className="text-xs sm:text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors">
                            View all customers
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 text-orange-500 animate-spin" />
                        </div>
                    ) : recentUsers.length === 0 ? (
                        <p className="text-zinc-500 text-sm">No customers found yet.</p>
                    ) : (
                        <div className="space-y-3 sm:space-y-4">
                            {recentUsers.map((user) => (
                                <div key={user._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-zinc-900/80 border border-white/5">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                                            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-white font-semibold text-sm sm:text-base truncate">{user.name || 'Customer'}</p>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-zinc-400">
                                                <span className="inline-flex items-center gap-1 truncate"><Mail className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" /><span className="truncate max-w-[120px] sm:max-w-none">{user.email}</span></span>
                                                <span className="inline-flex items-center gap-1 text-amber-400/90 capitalize">{user.authProvider || 'local'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs sm:text-sm text-zinc-400 flex items-center gap-1.5 sm:gap-2 ml-10 sm:ml-0">
                                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-zinc-500 flex-shrink-0" />
                                        <span>Joined {formatDate(user.createdAt)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Daily Visitors */}
            <Card className="bg-gradient-to-br from-zinc-900 via-zinc-900/70 to-zinc-900 border border-white/5 overflow-hidden">
                <CardContent className="p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-zinc-400">Daily Visitors</p>
                                <p className="text-xl sm:text-2xl font-bold text-white">
                                    {visitorLoading ? '—' : visitorData?.today ?? 0}
                                    <span className="text-xs sm:text-sm text-zinc-500 font-medium ml-1 sm:ml-2">today</span>
                                </p>
                            </div>
                        </div>
                        <div className="text-left sm:text-right ml-10 sm:ml-0">
                            <p className="text-[10px] sm:text-xs text-zinc-500">Last 14 days</p>
                            <p className="text-xs sm:text-sm text-white font-semibold">{visitorLoading ? '—' : visitorData?.total ?? 0} visits</p>
                        </div>
                    </div>

                    <div className="relative h-24 sm:h-28 lg:h-32">
                        {visitorLoading || !visitorData?.series?.length ? (
                            <div className="flex items-center justify-center h-full text-zinc-600 text-sm">Loading...</div>
                        ) : (
                            <VisitorsSparkline points={visitorData.series} />
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                    <span className="w-1 h-5 sm:h-6 bg-orange-500 rounded-full" />
                    Quick Actions
                </h3>
                <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <Link href="/admin/orders" className="group">
                        <div className="h-full bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                <ShoppingBag className="h-16 sm:h-20 lg:h-24 w-16 sm:w-20 lg:w-24 text-orange-500" />
                            </div>

                            <div className="relative z-10">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 text-orange-500">
                                    <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <h4 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2 group-hover:text-orange-400 transition-colors">Manage Orders</h4>
                                <p className="text-zinc-400 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2">View and process incoming customer orders. Update statuses & track delivery.</p>

                                <div className="flex items-center text-xs sm:text-sm font-medium text-white group-hover:translate-x-2 transition-transform duration-300">
                                    Go to Orders <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 text-orange-500" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin/products" className="group">
                        <div className="h-full bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                <UtensilsCrossed className="h-16 sm:h-20 lg:h-24 w-16 sm:w-20 lg:w-24 text-blue-500" />
                            </div>

                            <div className="relative z-10">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 text-blue-500">
                                    <UtensilsCrossed className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <h4 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2 group-hover:text-blue-400 transition-colors">Manage Menu</h4>
                                <p className="text-zinc-400 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2">Add new items, update prices, or change availability of your products.</p>

                                <div className="flex items-center text-xs sm:text-sm font-medium text-white group-hover:translate-x-2 transition-transform duration-300">
                                    Go to Products <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 text-blue-500" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin/categories" className="group sm:col-span-2 lg:col-span-1">
                        <div className="h-full bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                <Grid3X3 className="h-16 sm:h-20 lg:h-24 w-16 sm:w-20 lg:w-24 text-purple-500" />
                            </div>

                            <div className="relative z-10">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300 text-purple-500">
                                    <Grid3X3 className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <h4 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2 group-hover:text-purple-400 transition-colors">Categories</h4>
                                <p className="text-zinc-400 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2">Organize your menu structure. Create, edit, or remove food categories.</p>

                                <div className="flex items-center text-xs sm:text-sm font-medium text-white group-hover:translate-x-2 transition-transform duration-300">
                                    Go to Categories <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 text-purple-500" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
