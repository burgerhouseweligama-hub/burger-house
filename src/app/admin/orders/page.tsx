'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
    ShoppingBag,
    Loader2,
    Eye,
    Calendar,
    DollarSign,
    User,
    ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Pagination from '@/components/admin/Pagination';
import SearchFilterBar from '@/components/admin/SearchFilterBar';

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
    items: unknown[];
}

interface OrdersResponse {
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const statusColors: Record<string, string> = {
    order_received: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    pending_confirmation: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    preparing: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
    ready_for_pickup: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50',
    picked_up: 'bg-green-500/20 text-green-400 border-green-500/50',
    out_for_delivery: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/50',
};

const statusLabels: Record<string, string> = {
    order_received: 'Order Received',
    pending_confirmation: 'Pending Confirmation',
    preparing: 'Preparing',
    ready_for_pickup: 'Ready for Pickup',
    picked_up: 'Picked Up',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

const statusFilterOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'order_received', label: 'Order Received' },
    { value: 'pending_confirmation', label: 'Pending Confirmation' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready_for_pickup', label: 'Ready for Pickup' },
    { value: 'picked_up', label: 'Picked Up' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
];

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(currentPage),
                limit: String(pageSize),
            });

            if (statusFilter !== 'all') {
                params.set('status', statusFilter);
            }
            if (searchQuery) {
                params.set('search', searchQuery);
            }

            const res = await fetch(`/api/admin/orders?${params}`);
            if (res.ok) {
                const data: OrdersResponse = await res.json();
                setOrders(data.orders);
                setTotalItems(data.total);
                setTotalPages(data.totalPages);
            } else {
                console.error('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, statusFilter, searchQuery]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Reset to page 1 when filters change
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleFilterChange = (key: string, value: string) => {
        if (key === 'status') {
            setStatusFilter(value);
            setCurrentPage(1);
        }
    };

    const handleClearFilters = () => {
        setStatusFilter('all');
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

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

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Orders Management</h2>
                <p className="text-sm sm:text-base text-zinc-400">
                    View and manage all customer orders
                </p>
            </div>

            {/* Search & Filters */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4 sm:p-6">
                    <SearchFilterBar
                        searchPlaceholder="Search by order number, email..."
                        searchValue={searchQuery}
                        onSearchChange={handleSearchChange}
                        filters={[
                            {
                                key: 'status',
                                label: 'Status',
                                options: statusFilterOptions,
                                defaultValue: 'all',
                            },
                        ]}
                        filterValues={{ status: statusFilter }}
                        onFilterChange={handleFilterChange}
                        onClear={handleClearFilters}
                        isLoading={loading}
                    />
                </CardContent>
            </Card>

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
                </div>
            ) : orders.length === 0 ? (
                /* Empty State */
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                        <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-zinc-600 mb-3 sm:mb-4" />
                        <p className="text-sm sm:text-base text-zinc-400 text-center px-4">
                            {searchQuery || statusFilter !== 'all'
                                ? 'No orders match your filters'
                                : 'No orders yet'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                /* Orders List */
                <>
                    <div className="space-y-3 sm:space-y-4">
                        {orders.map((order) => (
                            <Link key={order._id} href={`/admin/orders/${order._id}`}>
                                <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-800/50 transition-all cursor-pointer group">
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="flex flex-col gap-4">
                                            {/* Order Number & Status */}
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-start gap-2 sm:gap-3">
                                                    <div className="p-1.5 sm:p-2 rounded-lg bg-orange-500/20 flex-shrink-0">
                                                        <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="text-white font-semibold text-base sm:text-lg truncate">
                                                            {order.orderNumber}
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            <span
                                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border ${statusColors[order.status] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/50'
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
                                                <div className="flex items-center gap-2 text-xs sm:text-sm">
                                                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-zinc-500 flex-shrink-0" />
                                                    <span className="text-zinc-300 truncate">
                                                        {order.user?.displayName || 'Customer'}
                                                    </span>
                                                </div>
                                                <div className="text-xs sm:text-sm text-zinc-400 truncate pl-5 sm:pl-6">
                                                    {order.email}
                                                </div>
                                            </div>

                                            {/* Order Details */}
                                            <div className="flex-1 grid grid-cols-2 gap-2 sm:gap-4">
                                                <div className="space-y-0.5 sm:space-y-1">
                                                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-sm text-zinc-400">
                                                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        <span>Total</span>
                                                    </div>
                                                    <p className="text-white font-semibold text-sm sm:text-base">
                                                        LKR {order.totalAmount.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="space-y-0.5 sm:space-y-1">
                                                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-sm text-zinc-400">
                                                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        <span>Date</span>
                                                    </div>
                                                    <p className="text-white text-xs sm:text-sm">
                                                        {formatDate(order.createdAt)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* View Button */}
                                            <div className="flex items-center justify-end sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                                                <div className="flex items-center gap-1.5 sm:gap-2 text-orange-500 group-hover:text-orange-400 transition-colors">
                                                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    <span className="font-medium text-sm sm:text-base">View</span>
                                                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardContent className="px-4 sm:px-6 py-2">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                pageSize={pageSize}
                                onPageChange={handlePageChange}
                                onPageSizeChange={handlePageSizeChange}
                                isLoading={loading}
                            />
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
