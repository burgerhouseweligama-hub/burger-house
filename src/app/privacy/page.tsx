"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Shield, Eye, Lock, Users, Database, Bell, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
    const lastUpdated = "December 23, 2024";

    const sections = [
        {
            icon: Database,
            title: "Information We Collect",
            content: `We collect information you provide directly to us, including:
                • Your name, email address, phone number, and delivery address when you create an account or place an order
                • Payment information when you make a purchase (processed securely by our payment partners)
                • Your order history and preferences
                • Any communications you have with our support team`,
        },
        {
            icon: Eye,
            title: "How We Use Your Information",
            content: `We use the information we collect to:
                • Process and deliver your orders
                • Send you order confirmations and updates
                • Respond to your inquiries and provide customer support
                • Send promotional offers and updates (you can opt out anytime)
                • Improve our services and develop new features
                • Protect against fraud and unauthorized activity`,
        },
        {
            icon: Users,
            title: "Information Sharing",
            content: `We do not sell your personal information. We may share your information with:
                • Delivery partners to fulfill your orders
                • Payment processors to complete transactions
                • Service providers who assist our operations
                • Law enforcement when required by law`,
        },
        {
            icon: Lock,
            title: "Data Security",
            content: `We implement industry-standard security measures to protect your data:
                • Encryption of sensitive information
                • Secure server infrastructure
                • Regular security audits
                • Employee access controls
                
However, no method of transmission over the internet is 100% secure.`,
        },
        {
            icon: Bell,
            title: "Your Choices",
            content: `You have control over your information:
                • Update your account information at any time
                • Opt out of promotional emails
                • Request deletion of your account
                • Access your order history and data`,
        },
    ];

    return (
        <main className="min-h-screen bg-black">
            <Navbar />
            <div className="pt-32 pb-20 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px]" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900/80 backdrop-blur-md border border-zinc-700 rounded-full text-orange-400 text-sm font-medium mb-6">
                            <Shield className="w-4 h-4" />
                            Your Privacy Matters
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
                            Privacy <span className="text-orange-500">Policy</span>
                        </h1>
                        <p className="text-zinc-400 text-lg">
                            Last updated: {lastUpdated}
                        </p>
                    </div>

                    {/* Introduction */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 mb-8">
                        <p className="text-zinc-300 leading-relaxed">
                            At Burger House, we respect your privacy and are committed to protecting your personal information.
                            This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and services.
                        </p>
                    </div>

                    {/* Sections */}
                    <div className="space-y-6">
                        {sections.map((section, index) => (
                            <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                                        <section.icon className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">{section.title}</h2>
                                </div>
                                <div className="text-zinc-400 leading-relaxed whitespace-pre-line">
                                    {section.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact */}
                    <div className="mt-12 text-center p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                        <Mail className="w-10 h-10 text-orange-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">Questions about Privacy?</h3>
                        <p className="text-zinc-400 mb-6">Contact us if you have any questions about this policy.</p>
                        <a href="/support" className="inline-flex px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-bold text-white hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 transition-all">
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
