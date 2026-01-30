'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    ShoppingBag,
    Search,
    Filter,
    Loader2,
    Eye,
    Calendar,
    DollarSign,
    User,
    ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Order {
    _id: string;
    orderNumber: string;
    user: {
        displayName?: string;
        email: string;
    };
    email: string;
    phone: string;
    totalAmount: number;
    status: string;
    paymentMethod: string;
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

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, searchQuery, statusFilter]);

    async function fetchOrders() {
        try {
            const res = await fetch('/api/admin/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            } else {
                console.error('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    }

    function filterOrders() {
        let filtered = [...orders];

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter((order) => order.status === statusFilter);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (order) =>
                    order.orderNumber.toLowerCase().includes(query) ||
                    order.email.toLowerCase().includes(query) ||
                    order.user?.email?.toLowerCase().includes(query) ||
                    order.user?.displayName?.toLowerCase().includes(query)
            );
        }

        setFilteredOrders(filtered);
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Orders Management</h2>
                <p className="text-zinc-400">
                    View and manage all customer orders
                </p>
            </div>

            {/* Filters */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                                placeholder="Search by order number, email, or customer..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="w-full md:w-48">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    <SelectItem value="all" className="text-white">All Orders</SelectItem>
                                    <SelectItem value="received" className="text-white">Received</SelectItem>
                                    <SelectItem value="preparing" className="text-white">Preparing</SelectItem>
                                    <SelectItem value="out_for_delivery" className="text-white">Out for Delivery</SelectItem>
                                    <SelectItem value="delivered" className="text-white">Delivered</SelectItem>
                                    <SelectItem value="cancelled" className="text-white">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Results count */}
                    <div className="mt-4 text-sm text-zinc-400">
                        Showing {filteredOrders.length} of {orders.length} orders
                    </div>
                </CardContent>
            </Card>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <ShoppingBag className="h-12 w-12 text-zinc-600 mb-4" />
                        <p className="text-zinc-400 text-center">
                            {searchQuery || statusFilter !== 'all'
                                ? 'No orders match your filters'
                                : 'No orders yet'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <Link key={order._id} href={`/admin/orders/${order._id}`}>
                            <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-800/50 transition-all cursor-pointer group">
                                <CardContent className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                        {/* Order Number & Status */}
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 rounded-lg bg-orange-500/20">
                                                    <ShoppingBag className="h-5 w-5 text-orange-500" />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-semibold text-lg">
                                                        {order.orderNumber}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[order.status] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/50'
                                                                }`}
                                                        >
                                                            {statusLabels[order.status] || order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Customer Info */}
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <User className="h-4 w-4 text-zinc-500" />
                                                <span className="text-zinc-300">
                                                    {order.user?.displayName || 'Customer'}
                                                </span>
                                            </div>
                                            <div className="text-sm text-zinc-400">
                                                {order.email}
                                            </div>
                                        </div>

                                        {/* Order Details */}
                                        <div className="flex-1 grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                                    <DollarSign className="h-4 w-4" />
                                                    <span>Total</span>
                                                </div>
                                                <p className="text-white font-semibold">
                                                    LKR {order.totalAmount.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Date</span>
                                                </div>
                                                <p className="text-white text-sm">
                                                    {formatDate(order.createdAt)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* View Button */}
                                        <div className="flex items-center">
                                            <div className="flex items-center gap-2 text-orange-500 group-hover:text-orange-400 transition-colors">
                                                <Eye className="h-5 w-5" />
                                                <span className="font-medium">View</span>
                                                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
