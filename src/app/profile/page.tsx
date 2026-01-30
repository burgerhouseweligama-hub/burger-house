
"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, LogOut, User as UserIcon, ShoppingBag, Calendar, Package } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Order {
    _id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: any[];
}

const statusColors: Record<string, string> = {
    received: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    preparing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    out_for_delivery: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    delivered: 'bg-green-500/20 text-green-400 border-green-500/50',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/50',
};

const statusLabels: Record<string, string> = {
    received: 'Received',
    preparing: 'Preparing',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

export default function ProfilePage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    async function fetchOrders() {
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoadingOrders(false);
        }
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white">My Profile</h1>
                    <Button
                        variant="outline"
                        onClick={logout}
                        className="border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                    </Button>
                </div>

                {/* Profile Card */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar */}
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-800">
                            {user.photoURL ? (
                                <Image
                                    src={user.photoURL}
                                    alt={user.displayName || "User"}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                    <UserIcon className="h-12 w-12 text-zinc-500" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h2 className="text-2xl font-bold text-white">
                                {user.displayName || "Burger Lover"}
                            </h2>
                            <p className="text-zinc-400">
                                {user.email}
                            </p>
                            <div className="pt-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                    Member
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
                    {loadingOrders ? (
                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8 flex justify-center">
                            <Loader2 className="h-6 w-6 text-orange-500 animate-spin" />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8 text-center">
                            <p className="text-zinc-500">No recent orders found.</p>
                            <Button variant="link" asChild className="text-orange-400 mt-2">
                                <Link href="/menu">Browse Menu</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {orders.map((order) => (
                                <div
                                    key={order._id}
                                    className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-orange-500/30 transition-colors"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        {/* Order Icon */}
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 rounded-xl bg-orange-500/20">
                                                <ShoppingBag className="h-5 w-5 text-orange-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">
                                                    {order.orderNumber}
                                                </h3>
                                                <p className="text-sm text-zinc-400 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(order.createdAt)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Order Details */}
                                        <div className="flex-1 flex flex-wrap items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-zinc-500" />
                                                <span className="text-sm text-zinc-400">
                                                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                                </span>
                                            </div>
                                            <span className="text-white font-semibold">
                                                LKR {order.totalAmount.toFixed(2)}
                                            </span>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[order.status] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/50'
                                                    }`}
                                            >
                                                {statusLabels[order.status] || order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
