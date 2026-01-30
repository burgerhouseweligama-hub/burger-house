"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ArrowRight, Flame } from "lucide-react";
import Link from "next/link";

// Total number of frames in the sequence (0-191)
const TOTAL_FRAMES = 192;
// Frames to advance/rewind per scroll event
const FRAMES_PER_SCROLL = 3;

// Generate frame paths
const getFramePath = (index: number): string => {
    const paddedIndex = index.toString().padStart(3, "0");
    // Delay pattern: frames with index % 3 === 1 have 0.041s, all others have 0.042s
    const delay = index % 3 === 1 ? "0.041s" : "0.042s";
    return `/burgerzip/frame_${paddedIndex}_delay-${delay}.jpg`;
};

export default function HeroSection() {
    const heroRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [isSequenceComplete, setIsSequenceComplete] = useState(false);
    const [progress, setProgress] = useState(0);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const animationRef = useRef<number | null>(null);
    const targetFrameRef = useRef(0);
    const currentFrameRef = useRef(0);

    // Floating Particles State
    const [particles, setParticles] = useState<
        Array<{ left: number; top: number; delay: number; duration: number }>
    >([]);

    useEffect(() => {
        // Generate particles only on client side to avoid hydration mismatch
        const newParticles = [...Array(20)].map(() => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 5 + Math.random() * 10,
        }));
        setParticles(newParticles);
    }, []);

    // Preload all images
    useEffect(() => {
        const images: HTMLImageElement[] = [];
        let loadedCount = 0;

        const handleImageLoad = () => {
            loadedCount++;
            if (loadedCount === TOTAL_FRAMES) {
                imagesRef.current = images;
                setImagesLoaded(true);
                // Draw the first frame
                drawFrame(0);
            }
        };

        for (let i = 0; i < TOTAL_FRAMES; i++) {
            const img = new window.Image();
            img.src = getFramePath(i);
            img.onload = handleImageLoad;
            img.onerror = handleImageLoad; // Count errors too to avoid hanging
            images[i] = img;
        }

        return () => {
            // Cleanup
            images.forEach((img) => {
                img.onload = null;
                img.onerror = null;
            });
        };
    }, []);

    // Draw frame to canvas
    const drawFrame = useCallback((frameIndex: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        const img = imagesRef.current[frameIndex];

        if (canvas && ctx && img) {
            // Set canvas size to match container
            const container = canvas.parentElement;
            if (container) {
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;
            }

            // Draw image covering the entire canvas
            const scale = Math.max(
                canvas.width / img.width,
                canvas.height / img.height
            );
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;

            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        }
    }, []);

    // Smooth animation to target frame
    const animateToFrame = useCallback(() => {
        const current = currentFrameRef.current;
        const target = targetFrameRef.current;

        if (current === target) {
            animationRef.current = null;
            return;
        }

        const direction = target > current ? 1 : -1;
        const newFrame = current + direction;

        currentFrameRef.current = newFrame;
        setCurrentFrame(newFrame);
        drawFrame(newFrame);

        // Update progress
        const newProgress = newFrame / (TOTAL_FRAMES - 1);
        setProgress(newProgress);
        setIsSequenceComplete(newFrame >= TOTAL_FRAMES - 1);

        animationRef.current = requestAnimationFrame(animateToFrame);
    }, [drawFrame]);

    // Handle scroll events
    useEffect(() => {
        if (!imagesLoaded) return;

        const handleWheel = (e: WheelEvent) => {
            // If user has scrolled past the hero section, allow normal scrolling
            if (window.scrollY > 100) return;

            const isScrollingDown = e.deltaY > 0;
            const isScrollingUp = e.deltaY < 0;
            const current = currentFrameRef.current;

            // Scrolling DOWN - advance frames
            if (isScrollingDown) {
                if (current < TOTAL_FRAMES - 1) {
                    e.preventDefault();
                    const newTarget = Math.min(
                        targetFrameRef.current + FRAMES_PER_SCROLL,
                        TOTAL_FRAMES - 1
                    );
                    targetFrameRef.current = newTarget;

                    if (!animationRef.current) {
                        animationRef.current = requestAnimationFrame(animateToFrame);
                    }
                }
            }
            // Scrolling UP - rewind frames
            else if (isScrollingUp) {
                if (current > 0) {
                    e.preventDefault();
                    const newTarget = Math.max(
                        targetFrameRef.current - FRAMES_PER_SCROLL,
                        0
                    );
                    targetFrameRef.current = newTarget;

                    if (!animationRef.current) {
                        animationRef.current = requestAnimationFrame(animateToFrame);
                    }
                }
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            window.removeEventListener("wheel", handleWheel);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [imagesLoaded, animateToFrame]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (imagesLoaded) {
                drawFrame(currentFrameRef.current);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [imagesLoaded, drawFrame]);

    const stats = [
        { value: "10K+", label: "Happy Customers" },
        { value: "50+", label: "Menu Items" }, // Static fallback or pass as prop
        { value: "4.9", label: "Rating" },
        { value: "5+", label: "Years Experience" },
    ];

    return (
        <section
            id="home"
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Frame Sequence Progress Indicator */}
            {!isSequenceComplete && imagesLoaded && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
                    <div className="text-xs text-white/70 font-medium">Scroll to explore</div>
                    <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-100"
                            style={{ width: `${progress * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Frame Sequence Background */}
            <div className="absolute inset-0">
                {/* Canvas for frame sequence */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                {/* Loading placeholder */}
                {!imagesLoaded && (
                    <div className="absolute inset-0 bg-black flex items-center justify-center">
                        <div className="text-orange-400 animate-pulse">Loading...</div>
                    </div>
                )}
                {/* Overlay gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_rgba(249,115,22,0.15)_0%,_transparent_50%)]" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/4 left-0 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
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

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
                <div className="flex flex-col items-center justify-center">
                    {/* Hero Content */}
                    <div className="text-center space-y-8 max-w-4xl mx-auto">
                        {/* Badge - appears at 5% progress */}
                        <div 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm transition-all duration-700 ease-out"
                            style={{
                                opacity: progress >= 0.05 ? 1 : 0,
                                transform: progress >= 0.05 ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
                            }}
                        >
                            <Flame className="w-4 h-4 animate-pulse" />
                            <span>Flame-Grilled Perfection</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black leading-tight overflow-hidden">
                            {/* Title line 1 - appears at 15% progress */}
                            <span 
                                className="block text-white transition-all duration-700 ease-out"
                                style={{
                                    opacity: progress >= 0.15 ? 1 : 0,
                                    transform: progress >= 0.15 ? 'translateY(0)' : 'translateY(50px)',
                                    filter: progress >= 0.15 ? 'blur(0px)' : 'blur(10px)',
                                }}
                            >
                                The Best
                            </span>
                            {/* Title line 2 - appears at 25% progress */}
                            <span 
                                className="block bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent animate-gradient transition-all duration-700 ease-out"
                                style={{
                                    opacity: progress >= 0.25 ? 1 : 0,
                                    transform: progress >= 0.25 ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.95)',
                                    filter: progress >= 0.25 ? 'blur(0px)' : 'blur(10px)',
                                }}
                            >
                                Burgers in Town
                            </span>
                        </h1>

                        {/* Description - appears at 40% progress */}
                        <p 
                            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto transition-all duration-700 ease-out"
                            style={{
                                opacity: progress >= 0.4 ? 1 : 0,
                                transform: progress >= 0.4 ? 'translateY(0)' : 'translateY(40px)',
                                filter: progress >= 0.4 ? 'blur(0px)' : 'blur(8px)',
                            }}
                        >
                            Located in the heart of{" "}
                            <strong className="text-white">Weligama</strong>, we craft
                            mouthwatering burgers using premium ingredients and secret recipes
                            passed down through generations.
                        </p>

                        {/* Buttons - appear at 55% progress */}
                        <div 
                            className="flex flex-col sm:flex-row items-center gap-4 justify-center transition-all duration-700 ease-out"
                            style={{
                                opacity: progress >= 0.55 ? 1 : 0,
                                transform: progress >= 0.55 ? 'translateY(0)' : 'translateY(40px)',
                            }}
                        >
                            <Link 
                                href="/cart" 
                                className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 text-white"
                                style={{
                                    transform: progress >= 0.55 ? 'scale(1)' : 'scale(0.8)',
                                    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                }}
                            >
                                Order Now
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/menu"
                                className="w-full sm:w-auto px-8 py-4 border-2 border-gray-700 rounded-full font-bold text-lg hover:border-orange-500 hover:text-orange-400 transition-all duration-300 text-center text-white"
                                style={{
                                    transform: progress >= 0.6 ? 'scale(1)' : 'scale(0.8)',
                                    opacity: progress >= 0.6 ? 1 : 0,
                                    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                }}
                            >
                                View Menu
                            </Link>
                        </div>

                        {/* Stats - appear staggered starting at 70% progress */}
                        <div 
                            className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-gray-800 transition-all duration-500"
                            style={{
                                opacity: progress >= 0.7 ? 1 : 0,
                                borderColor: progress >= 0.7 ? 'rgb(31 41 55)' : 'transparent',
                            }}
                        >
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="text-center transition-all duration-700 ease-out"
                                    style={{
                                        opacity: progress >= 0.7 + (index * 0.05) ? 1 : 0,
                                        transform: progress >= 0.7 + (index * 0.05) 
                                            ? 'translateY(0) scale(1)' 
                                            : 'translateY(30px) scale(0.8)',
                                    }}
                                >
                                    <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
