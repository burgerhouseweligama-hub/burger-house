"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowRight, Flame } from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
    // Add any props if needed
}

export default function HeroSection() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isVideoComplete, setIsVideoComplete] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0);

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

    // Scroll-controlled video logic
    const isRewindingRef = useRef(false);
    const rewindFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let interactionTimeout: NodeJS.Timeout;
        let isPlaying = false;

        // Helper to safely stop playback/rewind
        const stopPlayback = () => {
            // Cancel any pending rewind frame
            if (rewindFrameRef.current) {
                cancelAnimationFrame(rewindFrameRef.current);
                rewindFrameRef.current = null;
            }
            isRewindingRef.current = false;

            // Pause video if playing
            if (!video.paused) {
                video.pause();
                isPlaying = false;
            }
        };

        // Helper to safely play video
        const startPlayback = () => {
            if (video.paused && !isPlaying) {
                isPlaying = true;
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch((error) => {
                        // Auto-play was prevented or interrupted
                        console.log("Video play interrupted:", error);
                        isPlaying = false;
                    });
                }
            }
        };

        // Rewind loop using requestAnimationFrame
        const rewindVideo = () => {
            if (!isRewindingRef.current) return;

            // Rewind speed: 0.02s per frame (approx 1.2x speed at 60fps)
            // Slowed down for better effect
            video.currentTime = Math.max(0, video.currentTime - 0.02);
            // Update progress relative to 4s
            setVideoProgress(Math.min(video.currentTime / 4, 1));

            if (video.currentTime > 0) {
                rewindFrameRef.current = requestAnimationFrame(rewindVideo);
            } else {
                stopPlayback();
            }
        };

        const handleWheel = (e: WheelEvent) => {
            // 1. If user has scrolled past the hero section significantly, allow normal scrolling.
            //    We use 100px threshold to catch them "coming back" early.
            if (window.scrollY > 100) return;

            const isScrollingDown = e.deltaY > 0;
            const isScrollingUp = e.deltaY < 0;

            // 2. Logic for scrolling DOWN
            if (isScrollingDown) {
                // If video is NOT finished (played less than 4s), we hijack to play it.
                if (video.currentTime < 4) {
                    e.preventDefault();

                    if (isRewindingRef.current) {
                        if (rewindFrameRef.current) cancelAnimationFrame(rewindFrameRef.current);
                        isRewindingRef.current = false;
                    }

                    startPlayback();
                }
            }

            // 3. Logic for scrolling UP
            else if (isScrollingUp) {
                // If video is NOT at start, we hijack to rewind it.
                // Even if slightly played (0.1s), we catch it to ensure clean reset.
                if (video.currentTime > 0.1) {
                    e.preventDefault();

                    // Pause forward playback if active
                    if (!video.paused) {
                        video.pause();
                        isPlaying = false;
                    }

                    // Start rewind if not already rewinding
                    if (!isRewindingRef.current) {
                        isRewindingRef.current = true;
                        rewindVideo(); // Start the loop
                    }
                }
            }

            // 4. Reset "Stop" timer
            clearTimeout(interactionTimeout);
            interactionTimeout = setTimeout(() => {
                stopPlayback();
            }, 150);
        };

        const handleTimeUpdate = () => {
            // Update progress relative to 4s (the interactive part)
            setVideoProgress(Math.min(video.currentTime / 4, 1));

            // If we reached the 4s mark while playing, ensure we stop so scroll unlocks naturally next time
            if (video.currentTime >= 4) {
                setIsVideoComplete(true);
            } else {
                setIsVideoComplete(false);
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        video.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            window.removeEventListener("wheel", handleWheel);
            video.removeEventListener("timeupdate", handleTimeUpdate);
            clearTimeout(interactionTimeout);
            stopPlayback();
        };
    }, [isVideoLoaded]);

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
            {/* Video Progress Indicator */}
            {!isVideoComplete && isVideoLoaded && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
                    <div className="text-xs text-white/70 font-medium">Scroll to explore</div>
                    <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-100"
                            style={{ width: `${videoProgress * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Video Background */}
            <div className="absolute inset-0">
                {/* Video */}
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                    muted
                    playsInline
                    preload="auto"
                    onLoadedMetadata={() => setIsVideoLoaded(true)}
                >
                    <source src="/Burger_Video_Generation_Complete.mp4" type="video/mp4" />
                </video>
                {/* Overlay gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
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
                    <div className="text-center space-y-8 animate-fade-in-up max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm">
                            <Flame className="w-4 h-4 animate-pulse" />
                            <span>Flame-Grilled Perfection</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black leading-tight">
                            <span className="block text-white">The Best</span>
                            <span className="block bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent animate-gradient">
                                Burgers in Town
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                            Located in the heart of{" "}
                            <strong className="text-white">Weligama</strong>, we craft
                            mouthwatering burgers using premium ingredients and secret recipes
                            passed down through generations.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                            <Link href="/cart" className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 text-white">
                                Order Now
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/menu"
                                className="w-full sm:w-auto px-8 py-4 border-2 border-gray-700 rounded-full font-bold text-lg hover:border-orange-500 hover:text-orange-400 transition-all duration-300 text-center text-white"
                            >
                                View Menu
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-gray-800">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="text-center animate-fade-in-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
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

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                <span className="text-xs text-gray-500">Scroll Down</span>
                <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-2">
                    <div className="w-1 h-2 bg-orange-400 rounded-full animate-scroll-down" />
                </div>
            </div>
        </section>
    );
}
