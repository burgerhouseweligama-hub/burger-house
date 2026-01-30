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
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const sidebarItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
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
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 text-orange-500 animate-spin mx-auto mb-4" />
                    <p className="text-zinc-400">Loading...</p>
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
        <div className="min-h-screen bg-zinc-950">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-zinc-900 border-r border-zinc-800
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-zinc-800">
                    <Link href="/admin" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">BH</span>
                        </div>
                        <span className="text-white font-semibold text-lg">Admin</span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden text-zinc-400"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== '/admin' && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive
                                        ? 'bg-orange-500/20 text-orange-500'
                                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                                    }
                `}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                        <Home className="h-5 w-5" />
                        <span className="font-medium">Back to Site</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                        {loggingOut ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <LogOut className="h-5 w-5" />
                        )}
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main content area */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 h-16 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 flex items-center justify-between px-6">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden text-zinc-400 mr-4"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <h1 className="text-white font-semibold">Burger House Admin</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-red-400 transition-colors"
                    >
                        {loggingOut ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <LogOut className="h-4 w-4" />
                        )}
                        Logout
                    </button>
                </header>

                {/* Page content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
