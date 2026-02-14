"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function SpecialsSection() {
    return (
        <section id="specials" className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-orange-400 text-sm">
                            🎉 Today&apos;s Special
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black">
                            <span className="text-white">Get </span>
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                20% OFF
                            </span>
                            <span className="text-white"> on Combo Meals</span>
                        </h2>

                        <p className="text-gray-300 text-lg">
                            Order any combo meal and get 20% off! This limited-time offer
                            includes your choice of burger, loaded fries, and a refreshing
                            drink. Don&apos;t miss out!
                        </p>

                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <div className="text-4xl font-black text-orange-400">12</div>
                                <div className="text-sm text-gray-400">Hours</div>
                            </div>
                            <div className="text-2xl text-gray-600">:</div>
                            <div className="text-center">
                                <div className="text-4xl font-black text-orange-400">45</div>
                                <div className="text-sm text-gray-400">Minutes</div>
                            </div>
                            <div className="text-2xl text-gray-600">:</div>
                            <div className="text-center">
                                <div className="text-4xl font-black text-orange-400">30</div>
                                <div className="text-sm text-gray-400">Seconds</div>
                            </div>
                        </div>

                        <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300">
                            Claim Offer
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="relative">
                        <div className="relative w-full aspect-square max-w-md mx-auto animate-float-slow">
                            <Image
                                src="/combo-meal.png"
                                alt="Combo Meal"
                                fill
                                className="object-contain drop-shadow-[0_0_60px_rgba(249,115,22,0.4)]"
                                loading="lazy"
                                sizes="(max-width: 1024px) 90vw, 450px"
                                quality={80}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
