import { Metadata } from "next";

export const metadata: Metadata = {
    title: "FAQs",
    description: "Find answers to frequently asked questions about Burger House Weligama. Learn about orders, delivery, menu, allergens, and more.",
    openGraph: {
        title: "FAQs | Burger House Weligama",
        description: "Find answers to common questions about orders, delivery, and our menu.",
        images: ["/hero-burger.png"],
    },
};

export default function FAQsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
