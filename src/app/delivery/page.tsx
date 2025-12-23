"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Truck, Clock, MapPin, CreditCard, Package, CheckCircle } from "lucide-react";

export default function DeliveryPage() {
    return (
        <main className="min-h-screen bg-black">
            <Navbar />
            <div className="pt-32 pb-20 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/3 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-red-500/10 rounded-full blur-[150px]" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900/80 backdrop-blur-md border border-zinc-700 rounded-full text-orange-400 text-sm font-medium mb-6">
                            <Truck className="w-4 h-4" />
                            Fast & Fresh
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
                            Delivery <span className="text-orange-500">Information</span>
                        </h1>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            We bring delicious burgers right to your doorstep, hot and fresh every time.
                        </p>
                    </div>

                    {/* Key Info Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {[
                            { icon: Clock, title: "Delivery Time", value: "30-45 mins", desc: "Average delivery time" },
                            { icon: MapPin, title: "Delivery Area", value: "10 km", desc: "Radius from Weligama" },
                            { icon: CreditCard, title: "Min Order", value: "LKR 500", desc: "For delivery orders" },
                        ].map((item, index) => (
                            <div key={index} className="text-center p-8 bg-zinc-900 border border-zinc-800 rounded-3xl group hover:border-orange-500/30 transition-all">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-zinc-400 text-sm mb-1">{item.title}</h3>
                                <p className="text-3xl font-black text-white mb-1">{item.value}</p>
                                <p className="text-zinc-500 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Delivery Process */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-white text-center mb-10">How It Works</h2>
                        <div className="grid md:grid-cols-4 gap-6">
                            {[
                                { step: 1, title: "Browse Menu", desc: "Explore our delicious selection" },
                                { step: 2, title: "Add to Cart", desc: "Choose your favorites" },
                                { step: 3, title: "Checkout", desc: "Confirm your order" },
                                { step: 4, title: "Enjoy!", desc: "Delivered to your door" },
                            ].map((item, index) => (
                                <div key={index} className="relative text-center">
                                    <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-black">
                                        {item.step}
                                    </div>
                                    <h3 className="text-white font-bold mb-2">{item.title}</h3>
                                    <p className="text-zinc-400 text-sm">{item.desc}</p>
                                    {index < 3 && (
                                        <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-0.5 bg-zinc-800" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Zones */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-16">
                        <h2 className="text-2xl font-bold text-white mb-6">Delivery Zones & Fees</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-zinc-800">
                                        <th className="text-left py-4 text-zinc-400 font-medium">Zone</th>
                                        <th className="text-left py-4 text-zinc-400 font-medium">Distance</th>
                                        <th className="text-left py-4 text-zinc-400 font-medium">Delivery Fee</th>
                                        <th className="text-left py-4 text-zinc-400 font-medium">Est. Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { zone: "Weligama Town", distance: "0-3 km", fee: "FREE", time: "20-30 mins" },
                                        { zone: "Mirissa", distance: "3-6 km", fee: "LKR 150", time: "30-40 mins" },
                                        { zone: "Matara", distance: "6-10 km", fee: "LKR 250", time: "40-50 mins" },
                                    ].map((row, index) => (
                                        <tr key={index} className="border-b border-zinc-800/50">
                                            <td className="py-4 text-white font-medium">{row.zone}</td>
                                            <td className="py-4 text-zinc-400">{row.distance}</td>
                                            <td className="py-4 text-orange-500 font-semibold">{row.fee}</td>
                                            <td className="py-4 text-zinc-400">{row.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-4 text-zinc-500 text-sm">* Free delivery on orders above LKR 2,000 for all zones</p>
                    </div>

                    {/* Features */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { icon: Package, title: "Secure Packaging", desc: "Your food arrives hot and fresh with our special thermal packaging" },
                            { icon: CheckCircle, title: "Order Tracking", desc: "Track your order in real-time from preparation to delivery" },
                        ].map((item, index) => (
                            <div key={index} className="flex items-start gap-4 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <item.icon className="w-6 h-6 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">{item.title}</h3>
                                    <p className="text-zinc-400 text-sm">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
