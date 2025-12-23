import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Support",
    description: "Get help from Burger House Weligama customer support. Contact us via phone, email, or WhatsApp. We're here to assist you with your orders and inquiries.",
    openGraph: {
        title: "Support | Burger House Weligama",
        description: "Get help from our customer support team. We're here to assist you.",
        images: ["/hero-burger.png"],
    },
};

export default function SupportLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
