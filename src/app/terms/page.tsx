"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FileText, ShoppingBag, CreditCard, Truck, AlertTriangle, Scale, Mail } from "lucide-react";

export default function TermsPage() {
    const lastUpdated = "December 23, 2024";

    const sections = [
        {
            icon: ShoppingBag,
            title: "Orders & Payments",
            content: `By placing an order through our website, you agree to:
                • Provide accurate delivery information
                • Pay the full amount including applicable taxes and delivery fees
                • Accept responsibility for orders placed through your account
                
All prices are displayed in LKR (Sri Lankan Rupees). We reserve the right to modify prices without prior notice.`,
        },
        {
            icon: Truck,
            title: "Delivery Terms",
            content: `• Delivery times are estimates and may vary based on demand and distance
                • We are not responsible for delays caused by factors beyond our control (weather, traffic, etc.)
                • You must be available to receive your order at the specified address
                • If delivery cannot be completed due to incorrect information, additional charges may apply`,
        },
        {
            icon: CreditCard,
            title: "Cancellations & Refunds",
            content: `• Orders can be cancelled within 5 minutes of placement
                • After preparation begins, cancellations may not be possible
                • Refunds for quality issues will be processed within 7 business days
                • We reserve the right to refuse service or cancel orders at our discretion`,
        },
        {
            icon: AlertTriangle,
            title: "User Responsibilities",
            content: `As a user of our website, you agree to:
                • Use the service only for lawful purposes
                • Not attempt to interfere with the website's operation
                • Not create fake accounts or place fraudulent orders
                • Keep your account credentials secure`,
        },
        {
            icon: Scale,
            title: "Limitation of Liability",
            content: `Burger House shall not be liable for:
                • Any indirect, incidental, or consequential damages
                • Allergic reactions if allergen information was not disclosed by the customer
                • Delivery delays beyond our reasonable control
                • Any damages exceeding the value of your order`,
        },
    ];

    return (
        <main className="min-h-screen bg-black">
            <Navbar />
            <div className="pt-32 pb-20 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px]" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900/80 backdrop-blur-md border border-zinc-700 rounded-full text-orange-400 text-sm font-medium mb-6">
                            <FileText className="w-4 h-4" />
                            Legal Agreement
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
                            Terms of <span className="text-orange-500">Service</span>
                        </h1>
                        <p className="text-zinc-400 text-lg">
                            Last updated: {lastUpdated}
                        </p>
                    </div>

                    {/* Introduction */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 mb-8">
                        <p className="text-zinc-300 leading-relaxed">
                            Welcome to Burger House. By accessing or using our website and services, you agree to be bound by these Terms of Service.
                            Please read them carefully before placing any orders.
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

                    {/* Changes Notice */}
                    <div className="mt-8 p-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                        <p className="text-orange-400 text-sm">
                            <strong>Note:</strong> We may update these terms from time to time. Continued use of our services after changes constitutes acceptance of the new terms. We recommend reviewing this page periodically.
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="mt-12 text-center p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                        <Mail className="w-10 h-10 text-orange-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">Questions about Terms?</h3>
                        <p className="text-zinc-400 mb-6">Contact us if you need any clarification.</p>
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
