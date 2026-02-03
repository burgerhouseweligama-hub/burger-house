"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, User, ArrowRight, ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const { user, loading: authLoading } = useAuth();
    const { cartCount } = useCart();
    const pathname = usePathname();

    // Scroll handler
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Menu", href: "/menu" },
        { name: "Contact", href: "/contact" },
    ];

    const isActive = (path: string) => {
        if (path === "/" && pathname !== "/") return false;
        return pathname.startsWith(path);
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 || isMenuOpen
                ? "bg-black/90 backdrop-blur-xl shadow-lg shadow-orange-500/5"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative w-12 h-12 animate-pulse-slow">
                            <Image
                                src="/logo.png"
                                alt="Burger House Logo"
                                fill
                                className="object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                                BURGER HOUSE
                            </h1>
                            <p className="text-xs text-gray-400">Weligama</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`relative text-sm font-medium transition-colors duration-300 hover:text-orange-400 ${isActive(item.href) ? "text-orange-400" : "text-gray-300"
                                    }`}
                            >
                                {item.name}
                                {isActive(item.href) && (
                                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-scale-x" />
                                )}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {/* Cart Button */}
                        <Link href="/cart" className="relative p-2 hover:bg-white/10 rounded-full transition-colors group">
                            <ShoppingCart className="w-6 h-6 text-gray-300 group-hover:text-orange-400 transition-colors" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-in zoom-in">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        {/* Auth Buttons */}
                        {!authLoading && (
                            <>
                                {user ? (
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center overflow-hidden border border-orange-500/50">
                                            {user.photoURL ? (
                                                <Image
                                                    src={user.photoURL}
                                                    alt={user.displayName || "User"}
                                                    width={32}
                                                    height={32}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <User className="w-4 h-4 text-orange-400" />
                                            )}
                                        </div>
                                        <span className="hidden lg:inline">
                                            {user.displayName?.split(" ")[0]}
                                        </span>
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <Link
                                            href="/login"
                                            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/signup"
                                            className="text-sm font-medium px-4 py-2 rounded-full border border-orange-500/50 text-orange-400 hover:bg-orange-500/10 transition-all"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Order Button */}
                        <Link href="/cart" className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300 text-white">
                            Order Now
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-gray-800 animate-slide-down">
                        <div className="flex flex-col p-6 gap-4">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`text-lg font-medium transition-colors ${isActive(item.href)
                                        ? "text-orange-400"
                                        : "text-gray-300 hover:text-orange-400"
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            <div className="border-t border-gray-800 pt-4 flex flex-col gap-3">
                                <Link href="/cart" className="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-orange-400 transition-colors" onClick={() => setIsMenuOpen(false)}>
                                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/50">
                                        <ShoppingCart className="w-4 h-4 text-orange-400" />
                                    </div>
                                    Cart ({cartCount})
                                </Link>
                                {!authLoading && (
                                    <>
                                        {user ? (
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-orange-400 transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center overflow-hidden border border-orange-500/50">
                                                    {user.photoURL ? (
                                                        <Image
                                                            src={user.photoURL}
                                                            alt={user.displayName || "User"}
                                                            width={32}
                                                            height={32}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        <User className="w-4 h-4 text-orange-400" />
                                                    )}
                                                </div>
                                                My Profile
                                            </Link>
                                        ) : (
                                            <>
                                                <Link
                                                    href="/login"
                                                    className="text-lg font-medium text-gray-300 hover:text-orange-400 transition-colors"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    Sign In
                                                </Link>
                                                <Link
                                                    href="/signup"
                                                    className="text-lg font-medium text-gray-300 hover:text-orange-400 transition-colors"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    Sign Up
                                                </Link>
                                            </>
                                        )}
                                    </>
                                )}
                                <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="mt-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-semibold text-center w-full text-white block">
                                    Order Now
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
