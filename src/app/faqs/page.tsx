"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { HelpCircle, ChevronDown, Search, Sparkles } from "lucide-react";

const faqs = [
    {
        category: "Orders",
        questions: [
            {
                q: "How do I place an order?",
                a: "You can place an order through our website or by calling us directly at 071 306 5727. Simply browse our menu, add items to your cart, and proceed to checkout.",
            },
            {
                q: "Can I modify my order after placing it?",
                a: "Yes, you can modify your order within 5 minutes of placing it by calling us. After that, the order goes into preparation and cannot be changed.",
            },
            {
                q: "What payment methods do you accept?",
                a: "We accept cash on delivery, and soon we'll support card payments and online banking.",
            },
        ],
    },
    {
        category: "Delivery",
        questions: [
            {
                q: "What areas do you deliver to?",
                a: "We deliver to Weligama and surrounding areas within a 10km radius. Contact us to check if we deliver to your location.",
            },
            {
                q: "How long does delivery take?",
                a: "Typical delivery time is 30-45 minutes depending on your location and current order volume.",
            },
            {
                q: "Is there a delivery fee?",
                a: "Delivery is free for orders above LKR 2,000. For orders below that, a small delivery fee of LKR 200 applies.",
            },
        ],
    },
    {
        category: "Menu & Allergens",
        questions: [
            {
                q: "Do you have vegetarian options?",
                a: "Yes! We offer delicious veggie burgers and sides. Check our menu for items marked with the vegetarian label.",
            },
            {
                q: "How can I check for allergens?",
                a: "All our menu items list their ingredients. If you have specific allergies, please inform us when ordering and we'll guide you to safe options.",
            },
        ],
    },
];

export default function FAQsPage() {
    const [openIndex, setOpenIndex] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleQuestion = (id: string) => {
        setOpenIndex(openIndex === id ? null : id);
    };

    const filteredFaqs = faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
            q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    return (
        <main className="min-h-screen bg-black">
            <Navbar />
            <div className="pt-32 pb-20 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[150px]" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900/80 backdrop-blur-md border border-zinc-700 rounded-full text-orange-400 text-sm font-medium mb-6">
                            <HelpCircle className="w-4 h-4" />
                            Got Questions?
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
                            Frequently Asked <span className="text-orange-500">Questions</span>
                        </h1>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Find answers to common questions about orders, delivery, and more.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative mb-12">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search FAQs..."
                            className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white focus:border-orange-500 focus:outline-none transition-colors"
                        />
                    </div>

                    {/* FAQ Accordion */}
                    <div className="space-y-8">
                        {filteredFaqs.map((category, catIndex) => (
                            <div key={catIndex}>
                                <h2 className="text-xl font-bold text-orange-500 mb-4">{category.category}</h2>
                                <div className="space-y-3">
                                    {category.questions.map((faq, qIndex) => {
                                        const id = `${catIndex}-${qIndex}`;
                                        const isOpen = openIndex === id;
                                        return (
                                            <div
                                                key={id}
                                                className={`bg-zinc-900 border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-orange-500/50' : 'border-zinc-800'}`}
                                            >
                                                <button
                                                    onClick={() => toggleQuestion(id)}
                                                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                                                >
                                                    <span className="text-white font-semibold pr-4">{faq.q}</span>
                                                    <ChevronDown className={`w-5 h-5 text-orange-500 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                <div className={`px-6 overflow-hidden transition-all duration-300 ${isOpen ? 'pb-5 max-h-96' : 'max-h-0'}`}>
                                                    <p className="text-zinc-400 leading-relaxed">{faq.a}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Still have questions */}
                    <div className="mt-16 text-center p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                        <Sparkles className="w-10 h-10 text-orange-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">Still have questions?</h3>
                        <p className="text-zinc-400 mb-6">Can't find the answer you're looking for? Our support team is here to help.</p>
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
