import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-950 border-t border-gray-800 py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12">
                                <Image
                                    src="/logo.png"
                                    alt="Burger House Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                                    BURGER HOUSE
                                </h3>
                                <p className="text-xs text-gray-500">Weligama</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Crafting the finest burgers in Weligama since 2019. Experience
                            flame-grilled perfection.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                                >
                                    <Icon className="w-5 h-5 text-white" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Quick Links</h4>
                        <ul className="space-y-3 text-gray-400">
                            {[
                                { name: "Home", href: "/" },
                                { name: "Menu", href: "/menu" },
                                { name: "About Us", href: "/about" },
                                { name: "Contact", href: "/contact" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-orange-400 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Support</h4>
                        <ul className="space-y-3 text-gray-400">
                            {[
                                { name: "Support", href: "/support" },
                                { name: "FAQs", href: "/faqs" },
                                { name: "Delivery Info", href: "/delivery" },
                                { name: "Privacy Policy", href: "/privacy" },
                                { name: "Terms of Service", href: "/terms" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-orange-400 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Get Updates</h4>
                        <p className="text-gray-400 text-sm mb-4">
                            Subscribe to get special offers and updates.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-4 py-3 bg-gray-800 rounded-full text-sm border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                            />
                            <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-semibold hover:scale-105 transition-transform text-white">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                    <p>© 2024 Burger House Weligama. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
