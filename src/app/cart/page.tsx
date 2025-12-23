'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Sparkles, Shield, Truck, Clock, Gift } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, cartTotal, isLoading } = useCart();
    const { user, loading: authLoading, signInWithGoogle } = useAuth();
    const { showToast } = useToast();

    const handleQuantityChange = async (productId: string, action: 'increase' | 'decrease') => {
        await updateQuantity(productId, action);
    };

    const handleRemove = async (productId: string) => {
        await removeFromCart(productId);
        showToast('Item removed from cart', 'info');
    };

    // Show loading while checking auth
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
                        <p className="text-zinc-400 text-lg">Loading your cart...</p>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    // Show login prompt if not authenticated
    if (!user) {
        return (
            <main className="min-h-screen bg-black">
                <Navbar />
                <div className="min-h-screen flex items-center justify-center px-6 pt-20 relative overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[150px] animate-pulse" />
                        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>

                    <div className="max-w-md w-full text-center relative z-10">
                        {/* Icon */}
                        <div className="relative w-32 h-32 mx-auto mb-8">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl rotate-6 opacity-50" />
                            <div className="relative w-full h-full bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center">
                                <ShoppingBag className="w-16 h-16 text-orange-500" />
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl font-black text-white mb-4">
                            Sign In to <span className="text-orange-500">Continue</span>
                        </h1>
                        <p className="text-zinc-400 text-lg mb-10">
                            Please log in to view your cart and place orders. It only takes a moment!
                        </p>

                        {/* Login Button */}
                        <button
                            onClick={() => signInWithGoogle()}
                            className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-zinc-900 rounded-2xl font-bold text-lg hover:bg-zinc-100 transition-all shadow-2xl hover:scale-105 mb-8"
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

                        {/* Or continue browsing */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex-1 h-px bg-zinc-800" />
                            <span className="text-zinc-500 text-sm">or</span>
                            <div className="flex-1 h-px bg-zinc-800" />
                        </div>

                        <Link
                            href="/menu"
                            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 font-semibold transition-colors text-lg"
                        >
                            Continue Browsing Menu
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    // Empty cart state
    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-black">
                <Navbar />
                <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 relative overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-zinc-900/50 rounded-full blur-[100px]" />
                    </div>

                    <div className="relative z-10">
                        <div className="w-32 h-32 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-8">
                            <ShoppingBag className="w-14 h-14 text-zinc-600" />
                        </div>
                        <h1 className="text-4xl font-black text-white mb-4">Your Cart is Empty</h1>
                        <p className="text-zinc-400 text-lg mb-10 max-w-md">
                            Looks like you haven't added any delicious burgers to your cart yet. Let's fix that!
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
                                <ShoppingBag className="w-4 h-4" />
                                {items.length} {items.length === 1 ? 'Item' : 'Items'}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white">
                                Your <span className="text-orange-500">Cart</span>
                            </h1>
                        </div>
                        <Link href="/menu" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-medium">
                            <ArrowRight className="w-4 h-4 rotate-180" />
                            Continue Shopping
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item, index) => (
                                <div
                                    key={item.product._id}
                                    className="group relative animate-in fade-in slide-in-from-left-4 duration-500"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Glow Effect */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500" />

                                    <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-5 flex flex-col sm:flex-row items-center gap-6 group-hover:border-orange-500/30 transition-all duration-300">
                                        {/* Image */}
                                        <div className="relative w-full sm:w-36 h-36 flex-shrink-0 bg-zinc-800 rounded-2xl overflow-hidden">
                                            {item.product.image ? (
                                                <Image
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 w-full">
                                            <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors mb-1">
                                                {item.product.name}
                                            </h3>
                                            <p className="text-zinc-500 text-sm mb-4">Unit Price: LKR {item.product.price.toLocaleString()}</p>

                                            <div className="flex flex-wrap items-center gap-4">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-1 bg-zinc-800 rounded-2xl p-1">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.product._id, 'decrease')}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                                        disabled={isLoading}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="font-bold text-lg min-w-[40px] text-center text-white">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.product._id, 'increase')}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                                        disabled={isLoading}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => handleRemove(item.product._id)}
                                                    className="flex items-center gap-2 px-4 py-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Remove</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Subtotal */}
                                        <div className="text-right">
                                            <p className="text-zinc-500 text-xs mb-1">Subtotal</p>
                                            <p className="text-2xl font-black text-orange-500">
                                                LKR {(item.product.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32 space-y-6">
                                {/* Summary Card */}
                                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                        <Sparkles className="w-6 h-6 text-orange-500" />
                                        Order Summary
                                    </h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-zinc-400">
                                            <span>Subtotal ({items.length} items)</span>
                                            <span className="text-white font-semibold">LKR {cartTotal.toLocaleString()}</span>
                                        </div>
                                        <div className="h-px bg-zinc-800" />
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-bold text-white">Total</span>
                                            <span className="text-3xl font-black text-orange-500">LKR {cartTotal.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <Link
                                        href="/checkout"
                                        className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl font-bold text-lg text-white hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                    >
                                        Proceed to Checkout
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>

                                {/* Trust Badges */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { icon: Shield, text: "Secure Checkout" },
                                        { icon: Truck, text: "Fast Delivery" },
                                        { icon: Clock, text: "30 Min Ready" },
                                        { icon: Gift, text: "Fresh & Hot" },
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
                </div>
            </div>
            <Footer />
        </main>
    );
}
