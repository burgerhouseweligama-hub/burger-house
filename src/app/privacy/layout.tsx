import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Read Burger House Weligama's privacy policy. Learn how we collect, use, and protect your personal information when using our services.",
    openGraph: {
        title: "Privacy Policy | Burger House Weligama",
        description: "How we protect your privacy and personal information.",
        images: ["/hero-burger.png"],
    },
};

export default function PrivacyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
