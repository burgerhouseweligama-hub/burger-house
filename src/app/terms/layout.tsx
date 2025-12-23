import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Read Burger House Weligama's terms of service. Understand our policies on orders, delivery, payments, and user responsibilities.",
    openGraph: {
        title: "Terms of Service | Burger House Weligama",
        description: "Our terms and conditions for using our services.",
        images: ["/hero-burger.png"],
    },
};

export default function TermsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
