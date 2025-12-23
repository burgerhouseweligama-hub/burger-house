import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Delivery Info",
    description: "Learn about Burger House Weligama delivery options. Delivery zones, fees, timing, and coverage areas in Weligama and surrounding locations.",
    openGraph: {
        title: "Delivery Info | Burger House Weligama",
        description: "Fast and fresh delivery to Weligama and surrounding areas.",
        images: ["/hero-burger.png"],
    },
};

export default function DeliveryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
