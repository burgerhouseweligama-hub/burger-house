"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ArrowRight, Flame } from "lucide-react";
import Link from "next/link";
import { getHeroFrames, areFramesCached, TOTAL_FRAMES } from "@/lib/heroFrameCache";

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imagesLoaded, setImagesLoaded] = useState(() => areFramesCached());
    const [loadProgress, setLoadProgress] = useState(() => areFramesCached() ? 100 : 0);
    const [progress, setProgress] = useState(0);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const [particles, setParticles] = useState<
        Array<{ left: number; top: number; delay: number; duration: number }>
    >([]);

    // Initialize particles
    useEffect(() => {
        const newParticles = [...Array(20)].map(() => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 5 + Math.random() * 10,
        }));
        setParticles(newParticles);
    }, []);

    const drawFrame = useCallback((frameIndex: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        const img = imagesRef.current[frameIndex];

        if (canvas && ctx && img) {
            const container = canvas.parentElement;
            if (container) {
                const dpr = window.devicePixelRatio || 1;
                const rect = container.getBoundingClientRect();

                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;

                ctx.scale(dpr, dpr);

                const scale = Math.max(
                    rect.width / img.width,
                    rect.height / img.height
                );

                const x = (rect.width - img.width * scale) / 2;
                const y = (rect.height - img.height * scale) / 2;

                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            }
        }
    }, []);

    // Load frames from the singleton cache
    useEffect(() => {
        let cancelled = false;

        getHeroFrames((loaded, total) => {
            if (!cancelled) {
                setLoadProgress(Math.round((loaded / total) * 100));
            }
        }).then((frames) => {
            if (!cancelled) {
                imagesRef.current = frames;
                setImagesLoaded(true);
                drawFrame(0);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [drawFrame]);

    // Handle scroll
    useEffect(() => {
        let ticking = false;

        const update = () => {
            ticking = false;
            if (!containerRef.current || !imagesLoaded) return;

            const container = containerRef.current;
            const viewportHeight = window.innerHeight;

            const containerTop = container.offsetTop;
            const containerHeight = Math.max(container.offsetHeight, viewportHeight);
            const start = containerTop;
            const end = containerTop + containerHeight - viewportHeight;
            const scrollY = window.scrollY || window.pageYOffset || 0;

            const rawProgress = (scrollY - start) / Math.max(end - start, 1);
            const scrollProgress = Math.max(0, Math.min(1, rawProgress));
            setProgress(scrollProgress);

            const frameIndex = Math.floor(scrollProgress * (TOTAL_FRAMES - 1));
            requestAnimationFrame(() => drawFrame(frameIndex));
        };

        const handleScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll, { passive: true });

        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, [imagesLoaded, drawFrame]);

    const stats = [
        { value: "10K+", label: "Happy Customers" },
        { value: "50+", label: "Menu Items" },
        { value: "4.9", label: "Rating" },
        { value: "5+", label: "Years Experience" },
    ];

    return (
        <section
            id="home"
            ref={containerRef}
            className="relative bg-black"
            style={{ height: "450vh", minHeight: "260vh" }}
        >
            <div className="sticky top-0 h-[100dvh] overflow-hidden flex items-center justify-center">
                {/* Background Frame Sequence */}
                <div className="absolute inset-0">
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                        style={{ width: '100%', height: '100%' }}
                    />
                    {!imagesLoaded && (
                        <div className="absolute inset-0 bg-black flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4">
                                <Flame className="w-8 h-8 text-orange-500 animate-bounce" />
                                <div className="text-orange-400 font-medium">
                                    Loading Experience... {loadProgress}%
                                </div>
                                {/* Progress bar */}
                                <div className="w-48 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-300 ease-out"
                                        style={{ width: `${loadProgress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Overlay gradients for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_rgba(249,115,22,0.15)_0%,_transparent_50%)] pointer-events-none" />
                </div>

                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {particles.map((particle, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-orange-400/30 rounded-full animate-float"
                            style={{
                                left: `${particle.left}%`,
                                top: `${particle.top}%`,
                                animationDelay: `${particle.delay}s`,
                                animationDuration: `${particle.duration}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Scroll Indicator */}
                <div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 transition-opacity duration-300 pointer-events-none"
                    style={{ opacity: progress > 0.9 ? 0 : 1 }}
                >
                    <div className="text-xs text-white/50 font-medium uppercase tracking-widest">Scroll to Explore</div>
                    <div className="w-px h-12 bg-gradient-to-b from-orange-500 to-transparent animate-pulse" />
                </div>

                {/* Content Container */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="space-y-8 max-w-5xl mx-auto">
                            {/* Badge */}
                            <div
                                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm transition-all duration-700 ease-out backdrop-blur-sm"
                                style={{
                                    opacity: progress >= 0.05 ? 1 : 0,
                                    transform: progress >= 0.05 ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
                                }}
                            >
                                <Flame className="w-4 h-4 animate-pulse" />
                                <span>Flame-Grilled Perfection</span>
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight">
                                <span
                                    className="block text-white transition-all duration-700 ease-out"
                                    style={{
                                        opacity: progress >= 0.15 ? 1 : 0,
                                        transform: progress >= 0.15 ? 'translateY(0)' : 'translateY(40px)',
                                        filter: progress >= 0.15 ? 'blur(0px)' : 'blur(10px)',
                                    }}
                                >
                                    The Best
                                </span>
                                <span
                                    className="block bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent animate-gradient transition-all duration-700 ease-out"
                                    style={{
                                        opacity: progress >= 0.25 ? 1 : 0,
                                        transform: progress >= 0.25 ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
                                        filter: progress >= 0.25 ? 'blur(0px)' : 'blur(10px)',
                                    }}
                                >
                                    Burgers in Town
                                </span>
                            </h1>

                            {/* Description */}
                            <p
                                className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed transition-all duration-700 ease-out"
                                style={{
                                    opacity: progress >= 0.4 ? 1 : 0,
                                    transform: progress >= 0.4 ? 'translateY(0)' : 'translateY(30px)',
                                }}
                            >
                                Located in the heart of <strong className="text-white">Weligama</strong>, we craft
                                mouthwatering burgers using premium ingredients and secret recipes.
                            </p>

                            {/* Buttons */}
                            <div
                                className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-4 transition-all duration-700 ease-out"
                                style={{
                                    opacity: progress >= 0.55 ? 1 : 0,
                                    transform: progress >= 0.55 ? 'translateY(0)' : 'translateY(30px)',
                                }}
                            >
                                <Link
                                    href="/cart"
                                    className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 text-white"
                                >
                                    Order Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/menu"
                                    className="w-full sm:w-auto px-8 py-4 border-2 border-white/20 rounded-full font-bold text-lg hover:border-orange-500 hover:text-orange-400 transition-all duration-300 text-center text-white backdrop-blur-sm hover:bg-white/5"
                                >
                                    View Menu
                                </Link>
                            </div>

                            {/* Stats */}
                            <div
                                className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-12 border-t border-white/10 transition-all duration-700 ease-out"
                                style={{
                                    opacity: progress >= 0.7 ? 1 : 0,
                                    transform: progress >= 0.7 ? 'translateY(0)' : 'translateY(40px)',
                                }}
                            >
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-3xl md:text-4xl font-black text-white mb-1">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-gray-400 uppercase tracking-wider font-medium">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
