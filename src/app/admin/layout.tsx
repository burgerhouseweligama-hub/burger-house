'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Grid3X3,
    UtensilsCrossed,
    Home,
    Menu,
    X,
    LogOut,
    Loader2,
    Star,
    ShoppingBag,
    Bell,
    Search,
    User,
    Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/context/ToastContext';

const sidebarItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Categories', href: '/admin/categories', icon: Grid3X3 },
    { name: 'Products', href: '/admin/products', icon: UtensilsCrossed },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
];

// Pages that don't require authentication
const publicPaths = ['/admin/login', '/admin/forgot-password', '/admin/reset-password'];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);
    const { showToast } = useToast();

    // Check if current path is a public path
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

    useEffect(() => {
        async function checkAuth() {
            // Skip auth check for public paths
            if (isPublicPath) {
                setIsLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/auth/verify');
                const data = await res.json();

                if (data.authenticated) {
                    setIsAuthenticated(true);
                } else {
                    router.push('/admin/login');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                router.push('/admin/login');
            } finally {
                setIsLoading(false);
            }
        }

        checkAuth();
    }, [pathname, router, isPublicPath]);

    // Listen for new orders via SSE and show toast to admin
    useEffect(() => {
        if (!isAuthenticated || isPublicPath) return;

        const eventSource = new EventSource('/api/admin/orders/stream');

        const onOrderCreated = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                const amount = typeof data.totalAmount === 'number' ? data.totalAmount.toLocaleString() : '0';
                const itemsText = Array.isArray(data.items)
                    ? data.items.map((item: any) => `${item.name || 'Item'} x ${item.quantity || 1}`).join(', ')
                    : '';
                const customer = data.customerName ? ` • ${data.customerName}` : '';

                showToast(
                    `New order ${data.orderNumber || ''} - LKR ${amount}${itemsText ? ` • ${itemsText}` : ''}${customer}`,
                    'info'
                );
            } catch (error) {
                console.error('Failed to parse order event', error);
            }
        };

        eventSource.addEventListener('order_created', onOrderCreated);

        eventSource.onerror = () => {
            eventSource.close();
        };

        return () => {
            eventSource.removeEventListener('order_created', onOrderCreated);
            eventSource.close();
        };
    }, [isAuthenticated, isPublicPath, showToast]);

    async function handleLogout() {
        setLoggingOut(true);
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/admin/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setLoggingOut(false);
        }
    }

    // Show loading for protected routes
    if (isLoading && !isPublicPath) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-8">
                        <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
                        <div className="relative bg-zinc-900 rounded-full p-4 border border-zinc-800">
                            <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // For public paths (login, forgot password, reset password), show just the children
    if (isPublicPath) {
        return <>{children}</>;
    }

    // For protected routes, show the full admin layout
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-black selection:bg-orange-500/30">
            {/* Background ambient glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[50vh] bg-[radial-gradient(ellipse_at_top,_rgba(249,115,22,0.15)_0%,_transparent_60%)]" />
            </div>

            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-zinc-900/50 backdrop-blur-xl border-r border-white/5
          transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                {/* Logo */}
                <div className="h-24 flex items-center px-8 border-b border-white/5">
                    <Link href="/admin" className="flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
                            <span className="text-white font-bold text-lg">BH</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-lg tracking-wide group-hover:text-orange-400 transition-colors">Admin</span>
                            <span className="text-xs text-zinc-500 font-medium">Dashboard</span>
                        </div>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden ml-auto text-zinc-400 hover:text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation */}
                <div className="flex flex-col h-[calc(100%-6rem)] justify-between p-6">
                    <nav className="space-y-2">
                        <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Menu</p>
                        {sidebarItems.map((item) => {
                            const isActive =
                                pathname === item.href ||
                                (item.href !== '/admin' && pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                      relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group
                                      ${isActive
                                            ? 'bg-gradient-to-r from-orange-500/10 to-transparent text-orange-400 font-medium'
                                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                        }
                                    `}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 w-1 h-6 bg-orange-500 rounded-r-full shadow-[0_0_12px_rgba(249,115,22,0.5)]" />
                                    )}
                                    <item.icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-orange-500' : 'text-zinc-500 group-hover:text-white'}`} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom section */}
                    <div className="space-y-2 pt-6 border-t border-white/5">
                        <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Systems</p>
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors group"
                        >
                            <Home className="h-5 w-5 text-zinc-500 group-hover:text-white transition-colors" />
                            <span className="font-medium">Back to Website</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all group"
                        >
                            {loggingOut ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            )}
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content area */}
            <div className="lg:pl-72 transition-all duration-300">
                {/* Top bar */}
                <header className="sticky top-0 z-30 h-20 bg-black/50 backdrop-blur-xl border-b border-white/5">
                    <div className="flex items-center justify-between h-full px-8">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden text-zinc-400 hover:text-white hover:bg-white/5"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="h-5 w-5" />
                            </Button>

                            {/* Search (Visual Only) */}
                            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-zinc-900/50 rounded-full border border-white/5 w-64 focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/50 transition-all">
                                <Search className="h-4 w-4 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent border-none outline-none text-sm text-zinc-200 placeholder:text-zinc-600 w-full"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-black" />
                            </button>

                            <div className="h-8 w-px bg-white/10 mx-2" />

                            <div className="flex items-center gap-3 pl-2">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-white">Admin User</p>
                                    <p className="text-xs text-zinc-500">Super Admin</p>
                                </div>
                                <Avatar className="h-10 w-10 border-2 border-orange-500/20">
                                    <AvatarImage src="/avatars/admin.png" />
                                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold">
                                        <User className="h-5 w-5" />
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-8">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
