'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
    MapPin,
    Phone,
    Mail,
    User,
    Home,
    Building2,
    Hash,
    ShoppingBag,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Sparkles,
    Truck,
    Banknote,
    Clock,
    Shield,
    Package,
    Loader2,
    Store,
    MessageCircle,
} from 'lucide-react';

interface DeliveryForm {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
}

interface OrderConfirmation {
    _id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    itemCount: number;
}

const LocationMap = dynamic(() => import('@/components/checkout/LocationMap'), {
    ssr: false,
    loading: () => (
        <div className="h-[300px] w-full bg-zinc-800 animate-pulse rounded-xl flex items-center justify-center text-zinc-500">
            Loading Map...
        </div>
    )
});

export default function CheckoutPage() {
    const router = useRouter();
    const { items, cartTotal, refreshCart } = useCart();
    const { user, loading: authLoading, signInWithGoogle } = useAuth();
    const { showToast } = useToast();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'reserve'>('reserve');
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [formData, setFormData] = useState<DeliveryForm>({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
    });
    const [errors, setErrors] = useState<Partial<DeliveryForm>>({});

    // Auto-fill name from Google user
    useEffect(() => {
        if (user?.displayName && !formData.fullName) {
            setFormData(prev => ({ ...prev, fullName: user.displayName || '' }));
        }
    }, [user]);

    // Auto-send WhatsApp notification to admin when order is successful
    useEffect(() => {
        if (orderSuccess && orderConfirmation) {
            const adminPhone = '94782902200';

            const message = `🍔 *New Order Received - Burger House!*

📋 *Order #${orderConfirmation.orderNumber}*
💰 Total: LKR ${orderConfirmation.totalAmount.toLocaleString()}
📦 Items: ${orderConfirmation.itemCount}
💳 Payment: ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Order Reserve'}

👤 Customer: ${formData.fullName}
📱 Phone: ${formData.phone}`;

            const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;

            // Open WhatsApp in a new tab
            window.open(whatsappUrl, '_blank');
        }
    }, [orderSuccess, orderConfirmation]);

    const validateForm = (): boolean => {
        const newErrors: Partial<DeliveryForm> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        // Sri Lankan phone format validation
        const phoneRegex = /^(\+?94|0)?[0-9]{9}$/;
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Enter a valid Sri Lankan phone number';
        }

        // Only validate address fields if Cash on Delivery is selected
        if (paymentMethod === 'cod') {
            if (!formData.address.trim()) {
                newErrors.address = 'Address is required';
            }

            if (!formData.city.trim()) {
                newErrors.city = 'City is required';
            }

            if (!formData.postalCode.trim()) {
                newErrors.postalCode = 'Postal code is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name as keyof DeliveryForm]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast('Please fill in all required fields correctly', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user?.email,
                    phone: formData.phone,
                    orderType: paymentMethod, // 'cod' or 'reserve'
                    deliveryDetails: paymentMethod === 'cod' ? {
                        fullName: formData.fullName,
                        address: formData.address,
                        city: formData.city,
                        postalCode: formData.postalCode,
                        location: location // Include coordinates
                    } : {
                        // Send empty/dummy data for reserve to satisfy potential schematic requirements
                        fullName: formData.fullName, // Still capture name
                        address: 'Store Pickup/Reserve',
                        city: '-',
                        postalCode: '-',
                    },
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setOrderConfirmation(data.order);
                setOrderSuccess(true);
                await refreshCart(); // Refresh cart to show empty
                showToast('Order placed successfully!', 'success');
            } else {
                showToast(data.message || 'Failed to place order', 'error');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            showToast('Something went wrong. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading state
    if (authLoading) {
        return (
            <main className="min-h-screen bg-black">
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="w-20 h-20 border-4 border-zinc-800 rounded-full" />
                            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-orange-500 rounded-full border-t-transparent animate-spin" />
                        </div>
                        <p className="text-zinc-400 text-lg">Loading...</p>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    // Not authenticated
    if (!user) {
        return (
            <main className="min-h-screen bg-black">
                <Navbar />
                <div className="min-h-screen flex items-center justify-center px-6 pt-20 relative overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[150px] animate-pulse" />
                        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>

                    <div className="max-w-md w-full text-center relative z-10">
                        <div className="relative w-32 h-32 mx-auto mb-8">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl rotate-6 opacity-50" />
                            <div className="relative w-full h-full bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center">
                                <ShoppingBag className="w-16 h-16 text-orange-500" />
                            </div>
                        </div>

                        <h1 className="text-5xl font-black text-white mb-4">
                            Sign In to <span className="text-orange-500">Checkout</span>
                        </h1>
                        <p className="text-zinc-400 text-lg mb-10">
                            Please log in to complete your order.
                        </p>

                        <button
                            onClick={() => signInWithGoogle()}
                            className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-zinc-900 rounded-2xl font-bold text-lg hover:bg-zinc-100 transition-all shadow-2xl hover:scale-105"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Sign in with Google
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    // Empty cart
    if (items.length === 0 && !orderSuccess) {
        return (
            <main className="min-h-screen bg-black">
                <Navbar />
                <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 relative overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-zinc-900/50 rounded-full blur-[100px]" />
                    </div>

                    <div className="relative z-10">
                        <div className="w-32 h-32 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-8">
                            <ShoppingBag className="w-14 h-14 text-zinc-600" />
                        </div>
                        <h1 className="text-4xl font-black text-white mb-4">Your Cart is Empty</h1>
                        <p className="text-zinc-400 text-lg mb-10 max-w-md">
                            Add some delicious items to your cart before checkout!
                        </p>
                        <Link
                            href="/menu"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl font-bold text-lg text-white hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-105 transition-all"
                        >
                            <Sparkles className="w-5 h-5" />
                            Explore Menu
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    // Order success
    if (orderSuccess && orderConfirmation) {
        return (
            <main className="min-h-screen bg-black">
                <Navbar />
                <div className="min-h-screen flex items-center justify-center px-6 pt-20 relative overflow-hidden">
                    {/* Celebration Background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[200px] animate-pulse" />
                        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[200px] animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>

                    <div className="max-w-lg w-full text-center relative z-10">
                        {/* Success Icon */}
                        <div className="relative w-40 h-40 mx-auto mb-8">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full opacity-20 animate-ping" />
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full opacity-40" />
                            <div className="relative w-full h-full bg-zinc-900 border-4 border-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-20 h-20 text-green-500" />
                            </div>
                        </div>

                        <h1 className="text-5xl font-black text-white mb-4">
                            Order <span className="text-green-500">Received!</span>
                        </h1>
                        <p className="text-zinc-400 text-lg mb-8">
                            Thank you for your order. We're preparing your delicious food!
                        </p>

                        {/* Order Details Card */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8 text-left">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                                    <Package className="w-6 h-6 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-zinc-500 text-sm">Order Number</p>
                                    <p className="text-white font-bold text-lg">{orderConfirmation.orderNumber}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                                    <span className="text-zinc-400">Status</span>
                                    <span className="px-4 py-1.5 bg-green-500/10 text-green-500 rounded-full text-sm font-semibold capitalize">
                                        {orderConfirmation.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                                    <span className="text-zinc-400">Items</span>
                                    <span className="text-white font-semibold">{orderConfirmation.itemCount} items</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                                    <span className="text-zinc-400">Payment</span>
                                    <span className="text-white font-semibold flex items-center gap-2">
                                        {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Order Reserve'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-3">
                                    <span className="text-xl font-bold text-white">Total</span>
                                    <span className="text-3xl font-black text-orange-500">
                                        LKR {orderConfirmation.totalAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/menu"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-800 border border-zinc-700 rounded-2xl font-semibold text-white hover:bg-zinc-700 transition-all"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Continue Shopping
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl font-bold text-white hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-105 transition-all"
                            >
                                Back to Home
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    // Checkout form
    return (
        <main className="min-h-screen bg-black">
            <Navbar />
            <div className="pt-32 pb-20 px-6 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[150px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-700 rounded-full text-orange-400 text-sm font-medium mb-4">
                                <Truck className="w-4 h-4" />
                                Fast Delivery
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white">
                                <span className="text-orange-500">Checkout</span>
                            </h1>
                        </div>
                        <Link
                            href="/cart"
                            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Cart
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Delivery Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Contact Info */}
                                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                        <Mail className="w-6 h-6 text-orange-500" />
                                        Contact Information
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Email (Read-only) */}
                                        <div className="md:col-span-2">
                                            <label className="block text-zinc-400 text-sm font-medium mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                                <input
                                                    type="email"
                                                    value={user?.email || ''}
                                                    readOnly
                                                    className="w-full pl-12 pr-4 py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white font-medium cursor-not-allowed opacity-75"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                                                    Verified
                                                </span>
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="md:col-span-2">
                                            <label className="block text-zinc-400 text-sm font-medium mb-2">
                                                Phone Number <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    placeholder="077 123 4567"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className={`w-full pl-12 pr-4 py-4 bg-zinc-800 border ${errors.phone ? 'border-red-500' : 'border-zinc-700'} rounded-xl text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all`}
                                                />
                                            </div>
                                            {errors.phone && (
                                                <p className="text-red-500 text-sm mt-2">{errors.phone}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>


                                {/* Payment Method Selection */}
                                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                        <Banknote className="w-6 h-6 text-orange-500" />
                                        Payment Method
                                    </h2>

                                    <div className="space-y-4">
                                        {/* Option 1: Order Reserve */}
                                        <div
                                            onClick={() => setPaymentMethod('reserve')}
                                            className={`relative cursor-pointer transition-all ${paymentMethod === 'reserve'
                                                ? 'bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500'
                                                : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
                                                } border-2 rounded-2xl p-5 flex items-center gap-4`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === 'reserve' ? 'bg-orange-500' : 'bg-zinc-700'
                                                }`}>
                                                <div className="text-white">
                                                    <Store className="w-6 h-6" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-bold text-lg">Order Reserve</p>
                                                <p className="text-zinc-400 text-sm">Pick up directly from the store</p>
                                            </div>
                                            {paymentMethod === 'reserve' && (
                                                <CheckCircle2 className="w-6 h-6 text-orange-500" />
                                            )}
                                        </div>

                                        {/* Option 2: Cash on Delivery */}
                                        <div
                                            onClick={() => setPaymentMethod('cod')}
                                            className={`relative cursor-pointer transition-all ${paymentMethod === 'cod'
                                                ? 'bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500'
                                                : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
                                                } border-2 rounded-2xl p-5 flex items-center gap-4`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === 'cod' ? 'bg-orange-500' : 'bg-zinc-700'
                                                }`}>
                                                <Banknote className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-bold text-lg">Cash on Delivery</p>
                                                <p className="text-zinc-400 text-sm">Pay when you receive your order</p>
                                            </div>
                                            {paymentMethod === 'cod' && (
                                                <CheckCircle2 className="w-6 h-6 text-orange-500" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Details (Conditional) */}
                                {paymentMethod === 'cod' && (
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                            <MapPin className="w-6 h-6 text-orange-500" />
                                            Delivery Details
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Full Name field removed from here as it's now in Contact Info */}
                                            {/* Address */}
                                            <div className="md:col-span-2">
                                                <label className="block text-zinc-400 text-sm font-medium mb-2">
                                                    Delivery Address <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        placeholder="Street address, apartment, etc."
                                                        value={formData.address}
                                                        onChange={handleInputChange}
                                                        className={`w-full pl-12 pr-4 py-4 bg-zinc-800 border ${errors.address ? 'border-red-500' : 'border-zinc-700'} rounded-xl text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all`}
                                                    />
                                                </div>
                                                {errors.address && (
                                                    <p className="text-red-500 text-sm mt-2">{errors.address}</p>
                                                )}
                                            </div>

                                            {/* City */}
                                            <div>
                                                <label className="block text-zinc-400 text-sm font-medium mb-2">
                                                    City <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
                                                    <select
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={(e) => {
                                                            const { name, value } = e.target;
                                                            setFormData(prev => ({ ...prev, [name]: value }));
                                                            if (errors.city) setErrors(prev => ({ ...prev, city: undefined }));
                                                        }}
                                                        className={`w-full pl-12 pr-4 py-4 bg-zinc-800 border ${errors.city ? 'border-red-500' : 'border-zinc-700'} rounded-xl text-white appearance-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer`}
                                                    >
                                                        <option value="" disabled>Select your city</option>
                                                        <option value="Weligama">Weligama</option>
                                                        <option value="Mirissa">Mirissa</option>
                                                        <option value="Midigama">Midigama</option>
                                                        <option value="Ahangama">Ahangama</option>
                                                        <option value="Kamburugamuwa">Kamburugamuwa</option>
                                                        <option value="Denipitiya">Denipitiya</option>
                                                    </select>
                                                    {/* Custom Arrow Icon */}
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                        <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {errors.city && (
                                                    <p className="text-red-500 text-sm mt-2">{errors.city}</p>
                                                )}
                                            </div>

                                            {/* Postal Code */}
                                            <div>
                                                <label className="block text-zinc-400 text-sm font-medium mb-2">
                                                    Postal Code <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                                    <input
                                                        type="text"
                                                        name="postalCode"
                                                        placeholder="81700"
                                                        value={formData.postalCode}
                                                        onChange={handleInputChange}
                                                        className={`w-full pl-12 pr-4 py-4 bg-zinc-800 border ${errors.postalCode ? 'border-red-500' : 'border-zinc-700'} rounded-xl text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all`}
                                                    />
                                                </div>
                                                {errors.postalCode && (
                                                    <p className="text-red-500 text-sm mt-2">{errors.postalCode}</p>
                                                )}
                                            </div>

                                            {/* Location Map */}
                                            <div className="md:col-span-2 pt-4">
                                                <LocationMap onLocationSelect={(lat, lng) => setLocation({ lat, lng })} />
                                                {!location && isSubmitting && (
                                                    <p className="text-red-500 text-xs mt-2">Please pin your delivery location on the map</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}



                                {/* Submit Button (Mobile) */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="lg:hidden w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl font-bold text-lg text-white hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Place Order
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32 space-y-6">
                                {/* Summary Card */}
                                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                        <ShoppingBag className="w-6 h-6 text-orange-500" />
                                        Order Summary
                                    </h2>

                                    {/* Items List */}
                                    <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto scrollbar-hide">
                                        {items.map((item) => (
                                            <div key={item.product._id} className="flex gap-4">
                                                <div className="relative w-16 h-16 bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0">
                                                    {item.product.image && (
                                                        <Image
                                                            src={item.product.image}
                                                            alt={item.product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    )}
                                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                                        {item.quantity}
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-medium truncate">{item.product.name}</p>
                                                    <p className="text-zinc-500 text-sm">LKR {item.product.price.toLocaleString()}</p>
                                                </div>
                                                <p className="text-orange-500 font-bold">
                                                    LKR {(item.product.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="h-px bg-zinc-800 my-6" />

                                    {/* Totals */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-zinc-400">
                                            <span>Subtotal</span>
                                            <span className="text-white font-semibold">LKR {cartTotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-zinc-400">
                                            <span>Delivery</span>
                                            <span className="text-green-500 font-semibold">Free</span>
                                        </div>
                                    </div>

                                    <div className="h-px bg-zinc-800 my-6" />

                                    <div className="flex justify-between items-center mb-8">
                                        <span className="text-xl font-bold text-white">Total</span>
                                        <span className="text-3xl font-black text-orange-500">LKR {cartTotal.toLocaleString()}</span>
                                    </div>

                                    {/* Submit Button (Desktop) */}
                                    <button
                                        type="submit"
                                        form="checkout-form"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="hidden lg:flex w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl font-bold text-lg text-white hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-[1.02] transition-all items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Place Order
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Trust Badges */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { icon: Shield, text: "Secure Checkout" },
                                        { icon: Truck, text: "Fast Delivery" },
                                        { icon: Clock, text: "30 Min Ready" },
                                        { icon: Banknote, text: "Cash on Delivery" },
                                    ].map((badge, index) => (
                                        <div key={index} className="flex items-center gap-2 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                                            <badge.icon className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                            <span className="text-zinc-400 text-xs font-medium">{badge.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
            <Footer />
        </main >
    );
}
