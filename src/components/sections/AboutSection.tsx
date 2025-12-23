"use client";

import Image from "next/image";
import Link from "next/link";
import { ChefHat, ArrowRight, Flame, Users, Award, Clock, MapPin, Heart } from "lucide-react";

// Stats Data
const stats = [
    { icon: Flame, value: "10K+", label: "Burgers Served" },
    { icon: Users, value: "5K+", label: "Happy Customers" },
    { icon: Award, value: "5", label: "Years of Excellence" },
    { icon: Clock, value: "15", label: "Min Avg. Prep Time" },
];

// Values
const values = [
    { icon: Heart, title: "Passion", description: "Every burger is crafted with love and dedication." },
    { icon: Award, title: "Quality", description: "We source only the finest, freshest ingredients." },
    { icon: Users, title: "Community", description: "Building connections one meal at a time." },
];

export default function AboutSection() {
    return (
        <section id="about" className="relative overflow-hidden">
            {/* Hero Banner */}
            <div className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center bg-fixed" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
                <div className="relative z-10 text-center px-6">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900/80 backdrop-blur-md border border-zinc-700 rounded-full text-orange-400 text-sm font-medium mb-6">
                        <MapPin className="w-4 h-4" />
                        Weligama, Sri Lanka
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
                        Our <span className="text-orange-500">Story</span>
                    </h1>
                    <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
                        More than just burgers. It's a passion, a community, a legacy.
                    </p>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="relative z-20 -mt-16">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-500/10 rounded-xl mb-3 group-hover:bg-orange-500/20 transition-colors">
                                    <stat.icon className="w-6 h-6 text-orange-500" />
                                </div>
                                <p className="text-3xl md:text-4xl font-black text-white">{stat.value}</p>
                                <p className="text-zinc-400 text-sm mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Story Section */}
            <div className="py-24 bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Image Side */}
                        <div className="relative order-2 lg:order-1">
                            <div className="relative w-full aspect-[4/5] max-w-lg mx-auto">
                                {/* Decorative Elements */}
                                <div className="absolute -inset-4 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-[2.5rem] blur-2xl opacity-50" />
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-[2rem] rotate-3 scale-95" />

                                {/* Main Image */}
                                <div className="relative w-full h-full rounded-[2rem] overflow-hidden border-2 border-zinc-800">
                                    <Image
                                        src="/combo-meal.png"
                                        alt="Our Special Combo"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute -right-6 top-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-700 p-5 rounded-2xl shadow-2xl">
                                    <ChefHat className="w-10 h-10 text-orange-500" />
                                    <p className="text-white font-bold mt-2">Est.</p>
                                    <p className="text-orange-500 font-black text-2xl">2019</p>
                                </div>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="space-y-8 order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-medium">
                                <Flame className="w-4 h-4" />
                                The Beginning
                            </div>

                            <h2 className="text-4xl md:text-5xl font-black leading-tight">
                                <span className="text-white">From a Small Kitchen to </span>
                                <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                                    Weligama's Favorite
                                </span>
                            </h2>

                            <p className="text-zinc-400 text-lg leading-relaxed">
                                Nestled in the scenic coastal town of Weligama, Burger House was born from a simple dream: to create the perfect burger. What started as a passion project in a tiny kitchen has grown into a beloved destination for burger enthusiasts from all over Sri Lanka.
                            </p>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                Every patty is handcrafted, every bun is freshly baked, and every sauce follows our secret family recipe. We don't just make burgers—we create experiences.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    "100% Fresh Beef",
                                    "Local Ingredients",
                                    "Secret Sauces",
                                    "Made to Order",
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 group hover:border-orange-500/30 transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-zinc-300 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href="/menu" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300 text-white">
                                Explore Our Menu
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="py-24 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                            What We <span className="text-orange-500">Stand For</span>
                        </h2>
                        <p className="text-zinc-400 max-w-xl mx-auto">
                            These core values guide everything we do at Burger House.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="group p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-2">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <value.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">{value.title}</h3>
                                <p className="text-zinc-400">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
