'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
    ArrowLeft,
    Loader2,
    Package,
    MapPin,
    Phone,
    Mail,
    Calendar,
    CreditCard,
    Save,
    CheckCircle,
    Navigation,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Dynamic import for leaflet map (client-side only)
const LocationView = dynamic(() => import('@/components/admin/LocationView'), {
    ssr: false,
    loading: () => (
        <div className="h-[250px] w-full bg-zinc-800 animate-pulse rounded-xl flex items-center justify-center text-zinc-500">
            Loading Map...
        </div>
    )
});

interface OrderItem {
    product: {
        _id: string;
        name: string;
        image?: string;
        price: number;
    };
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface Order {
    _id: string;
    orderNumber: string;
    user: {
        displayName?: string;
        email: string;
        photoURL?: string;
    };
    email: string;
    phone: string;
    deliveryDetails: {
        fullName: string;
        address: string;
        city: string;
        postalCode: string;
        location?: {
            lat: number;
            lng: number;
        };
    };
    items: OrderItem[];
    totalAmount: number;
    status: string;
    paymentMethod: string;
    createdAt: string;
    updatedAt: string;
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

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    async function fetchOrder() {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data);
                setNewStatus(data.status);
            } else {
                console.error('Failed to fetch order');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateStatus() {
        if (!order || newStatus === order.status) return;

        setUpdating(true);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                const data = await res.json();
                setOrder(data.order);
                setUpdateSuccess(true);
                setTimeout(() => setUpdateSuccess(false), 3000);
            } else {
                console.error('Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order:', error);
        } finally {
            setUpdating(false);
        }
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
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

    if (!order) {
        return (
            <div className="text-center py-12">
                <p className="text-zinc-400">Order not found</p>
                <Button
                    variant="outline"
                    onClick={() => router.push('/admin/orders')}
                    className="mt-4"
                >
                    Back to Orders
                </Button>
            </div>
        );
    }

    const isPickup = order.paymentMethod === 'order_reserve';

    // Status options split by order type to avoid irrelevant steps
    const pickupStatuses = [
        { value: 'order_received', label: 'Order Received' },
        { value: 'preparing', label: 'Preparing' },
        { value: 'ready_for_pickup', label: 'Ready for Pickup' },
        { value: 'picked_up', label: 'Picked Up' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    const deliveryStatuses = [
        { value: 'pending_confirmation', label: 'Pending Confirmation' },
        { value: 'preparing', label: 'Preparing' },
        { value: 'out_for_delivery', label: 'Out for Delivery' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/admin/orders')}
                        className="text-zinc-400 hover:text-white h-8 w-8 sm:h-10 sm:w-10"
                    >
                        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white">
                            Order {order.orderNumber}
                        </h2>
                        <p className="text-zinc-400 text-xs sm:text-sm">
                            Placed on {formatDate(order.createdAt)}
                        </p>
                    </div>
                </div>
                <span
                    className={`inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border self-start sm:self-auto ml-11 sm:ml-0 ${statusColors[order.status]
                        }`}
                >
                    {statusLabels[order.status]}
                </span>
            </div>

            <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                {/* Left Column - Order Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="px-4 sm:px-6 py-4">
                            <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg">
                                <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                                Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
                            {order.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-zinc-800/50 border border-zinc-700"
                                >
                                    {/* Product Image */}
                                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                                        {item.image || item.product?.image ? (
                                            <Image
                                                src={item.image || item.product?.image || ''}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-600" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-medium text-sm sm:text-base truncate">{item.name}</h4>
                                        <p className="text-xs sm:text-sm text-zinc-400">
                                            LKR {item.price.toFixed(2)} × {item.quantity}
                                        </p>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-white font-semibold text-sm sm:text-base">
                                            LKR {(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Total */}
                            <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-zinc-700">
                                <span className="text-base sm:text-lg font-semibold text-white">Total</span>
                                <span className="text-xl sm:text-2xl font-bold text-orange-500">
                                    LKR {order.totalAmount.toFixed(2)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Delivery Details */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="px-4 sm:px-6 py-4">
                            <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg">
                                <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                                Delivery Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
                            <div className="grid gap-2 sm:gap-3">
                                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                                    <span className="text-zinc-400 text-xs sm:text-sm sm:min-w-[100px]">Name:</span>
                                    <span className="text-white font-medium text-sm sm:text-base">
                                        {order.deliveryDetails.fullName}
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                                    <span className="text-zinc-400 text-xs sm:text-sm sm:min-w-[100px]">Address:</span>
                                    <span className="text-white text-sm sm:text-base">
                                        {order.deliveryDetails.address}
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                                    <span className="text-zinc-400 text-xs sm:text-sm sm:min-w-[100px]">City:</span>
                                    <span className="text-white text-sm sm:text-base">{order.deliveryDetails.city}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                                    <span className="text-zinc-400 text-xs sm:text-sm sm:min-w-[100px]">Postal Code:</span>
                                    <span className="text-white text-sm sm:text-base">
                                        {order.deliveryDetails.postalCode}
                                    </span>
                                </div>
                            </div>

                            {/* Customer's Pinned Location Map */}
                            {order.deliveryDetails.location && (
                                <div className="pt-3 sm:pt-4 border-t border-zinc-700">
                                    <h4 className="text-white font-medium text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                                        <Navigation className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                                        Customer&apos;s Pinned Location
                                    </h4>
                                    <LocationView
                                        lat={order.deliveryDetails.location.lat}
                                        lng={order.deliveryDetails.location.lng}
                                        customerName={order.deliveryDetails.fullName}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Customer & Status */}
                <div className="space-y-4 sm:space-y-6">
                    {/* Customer Information */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="px-4 sm:px-6 py-4">
                            <CardTitle className="text-white text-base sm:text-lg">Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center gap-2 text-xs sm:text-sm">
                                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-zinc-500 flex-shrink-0" />
                                    <span className="text-zinc-300 truncate">{order.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs sm:text-sm">
                                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-zinc-500 flex-shrink-0" />
                                    <span className="text-zinc-300">{order.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs sm:text-sm">
                                    <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-zinc-500 flex-shrink-0" />
                                    <span className="text-zinc-300">
                                        {order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Order Reserve'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs sm:text-sm">
                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-zinc-500 flex-shrink-0" />
                                    <span className="text-zinc-300 text-[10px] sm:text-xs">
                                        {formatDate(order.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Status Management */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="px-4 sm:px-6 py-4">
                            <CardTitle className="text-white text-base sm:text-lg">Update Order Status</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
                            <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white text-sm sm:text-base">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    {(isPickup ? pickupStatuses : deliveryStatuses).map((s) => (
                                        <SelectItem key={s.value} value={s.value} className="text-white">
                                            {s.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button
                                onClick={handleUpdateStatus}
                                disabled={updating || newStatus === order.status}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base"
                            >
                                {updating ? (
                                    <>
                                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                        Update Status
                                    </>
                                )}
                            </Button>

                            {updateSuccess && (
                                <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 text-xs sm:text-sm">
                                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                    <span>Status updated successfully!</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
