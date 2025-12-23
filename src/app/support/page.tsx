"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MessageCircle, Phone, Mail, Send, Headphones, Loader2, CheckCircle } from "lucide-react";

export default function SupportPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <main className="min-h-screen bg-black">
            <Navbar />
            <div className="pt-32 pb-20 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[150px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900/80 backdrop-blur-md border border-zinc-700 rounded-full text-orange-400 text-sm font-medium mb-6">
                            <Headphones className="w-4 h-4" />
                            We're Here to Help
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
                            Customer <span className="text-orange-500">Support</span>
                        </h1>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Have a question or need help? Our team is ready to assist you.
                        </p>
                    </div>

                    {/* Support Options */}
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {[
                            {
                                icon: Phone,
                                title: "Call Us",
                                description: "Speak directly with our team",
                                action: "071 306 5727",
                                link: "tel:+94713065727",
                            },
                            {
                                icon: Mail,
                                title: "Email Us",
                                description: "We'll respond within 24 hours",
                                action: "burgerhouseweligama@gmail.com",
                                link: "mailto:burgerhouseweligama@gmail.com",
                            },
                            {
                                icon: MessageCircle,
                                title: "Live Chat",
                                description: "Chat with us on WhatsApp",
                                action: "Start Chat",
                                link: "https://wa.me/94713065727",
                            },
                        ].map((option, index) => (
                            <a
                                key={index}
                                href={option.link}
                                className="group p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-orange-500/30 transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <option.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{option.title}</h3>
                                <p className="text-zinc-400 mb-4">{option.description}</p>
                                <span className="text-orange-500 font-semibold text-sm break-all">{option.action}</span>
                            </a>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>

                            {submitStatus === 'success' ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                    <p className="text-zinc-400 mb-6">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                                    <button
                                        onClick={() => setSubmitStatus('idle')}
                                        className="text-orange-500 font-semibold hover:text-orange-400 transition-colors"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-zinc-400 text-sm font-medium mb-2">Your Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-xl text-white focus:border-orange-500 focus:outline-none transition-colors"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-zinc-400 text-sm font-medium mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-xl text-white focus:border-orange-500 focus:outline-none transition-colors"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-zinc-400 text-sm font-medium mb-2">Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-xl text-white focus:border-orange-500 focus:outline-none transition-colors"
                                            placeholder="How can we help?"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-zinc-400 text-sm font-medium mb-2">Message</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-xl text-white focus:border-orange-500 focus:outline-none transition-colors resize-none"
                                            placeholder="Tell us more about your inquiry..."
                                        />
                                    </div>

                                    {submitStatus === 'error' && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                            Failed to send message. Please try again or contact us directly.
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold text-lg text-white hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="mt-16 text-center">
                        <p className="text-zinc-500 mb-4">Looking for something else?</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/faqs" className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-full text-white hover:border-orange-500/50 transition-colors">
                                FAQs
                            </Link>
                            <Link href="/delivery" className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-full text-white hover:border-orange-500/50 transition-colors">
                                Delivery Info
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
