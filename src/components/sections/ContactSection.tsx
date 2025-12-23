"use client";

import { MapPin, Phone, Clock, Mail, Navigation, ExternalLink } from "lucide-react";

export default function ContactSection() {
    return (
        <section id="contact" className="py-24 md:py-32 relative overflow-hidden bg-black">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center space-y-6 mb-16">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900/80 backdrop-blur-md border border-zinc-700 rounded-full text-orange-400 text-sm font-medium">
                        <Navigation className="w-4 h-4" />
                        Find Us
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black">
                        <span className="text-white">Visit Our </span>
                        <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 bg-clip-text text-transparent">
                            Restaurant
                        </span>
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Come taste the best burgers in Weligama! We're excited to serve you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Contact Info Cards */}
                    <div className="space-y-6">
                        {/* Location Card */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
                            <div className="relative p-8 bg-zinc-900 border border-zinc-800 rounded-3xl group-hover:border-orange-500/30 transition-all duration-300">
                                <div className="flex items-start gap-5">
                                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <MapPin className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-3">Our Location</h3>
                                        <div className="space-y-1 text-zinc-400 text-lg">
                                            <p>No 2, Kurudu Watta</p>
                                            <p>Galle Road</p>
                                            <p className="text-orange-400 font-medium">Weligama, Sri Lanka</p>
                                        </div>
                                        <a
                                            href="https://maps.google.com/?q=Weligama+Sri+Lanka"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 mt-4 text-orange-500 hover:text-orange-400 font-semibold transition-colors"
                                        >
                                            Get Directions
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Phone Card */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
                            <div className="relative p-8 bg-zinc-900 border border-zinc-800 rounded-3xl group-hover:border-orange-500/30 transition-all duration-300">
                                <div className="flex items-start gap-5">
                                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <Phone className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-3">Call Us</h3>
                                        <div className="space-y-2">
                                            <a
                                                href="tel:+94713065727"
                                                className="block text-xl text-zinc-300 hover:text-orange-400 font-medium transition-colors"
                                            >
                                                071 306 5727
                                            </a>
                                            <a
                                                href="tel:+94740022625"
                                                className="block text-xl text-zinc-300 hover:text-orange-400 font-medium transition-colors"
                                            >
                                                074 002 2625
                                            </a>
                                        </div>
                                        <p className="text-zinc-500 text-sm mt-3">Tap to call directly</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hours Card */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
                            <div className="relative p-8 bg-zinc-900 border border-zinc-800 rounded-3xl group-hover:border-orange-500/30 transition-all duration-300">
                                <div className="flex items-start gap-5">
                                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <Clock className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-3">Opening Hours</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-zinc-400">Monday - Friday</span>
                                                <span className="text-white font-medium">10:00 AM - 10:00 PM</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-zinc-400">Saturday - Sunday</span>
                                                <span className="text-white font-medium">10:00 AM - 11:00 PM</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-green-400 text-sm font-medium">Open Now</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="relative h-full min-h-[500px] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 group">
                        {/* Decorative gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5" />

                        {/* Google Maps Embed */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31744.68454983!2d80.41!3d5.9666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae138cc8c0b3e7f%3A0x2d4e5f6a8b9c0d1e!2sWeligama%2C%20Sri%20Lanka!5e0!3m2!1sen!2s!4v1703323200000!5m2!1sen!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: 'grayscale(1) invert(1) contrast(1.1)' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0"
                        />

                        {/* Floating CTA */}
                        <div className="absolute bottom-6 left-6 right-6 bg-zinc-900/90 backdrop-blur-md rounded-2xl p-6 border border-zinc-700">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h4 className="text-white font-bold text-lg">Burger House Weligama</h4>
                                    <p className="text-zinc-400 text-sm">No 2, Kurudu Watta, Galle Road</p>
                                </div>
                                <a
                                    href="https://maps.google.com/?q=Weligama+Sri+Lanka"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-semibold text-white hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 transition-all text-center"
                                >
                                    Open in Maps
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 text-center">
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl">
                        <div className="text-left">
                            <p className="text-white font-bold text-lg">Have questions?</p>
                            <p className="text-zinc-400">We're happy to help!</p>
                        </div>
                        <a
                            href="tel:+94713065727"
                            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-bold text-lg text-white hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-105 transition-all"
                        >
                            Call Now
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
