export default function JsonLd() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": "Burger House Weligama",
        "description": "Experience flame-grilled perfection at Burger House Weligama. Premium handcrafted burgers, fresh ingredients, and secret recipes. The ultimate burger destination in Weligama, Sri Lanka.",
        "url": process.env.NEXT_PUBLIC_APP_URL || "https://whimsical-kelpie-80e090.netlify.app",
        "logo": `${process.env.NEXT_PUBLIC_APP_URL || "https://whimsical-kelpie-80e090.netlify.app"}/logo.png`,
        "image": `${process.env.NEXT_PUBLIC_APP_URL || "https://whimsical-kelpie-80e090.netlify.app"}/hero-burger.png`,
        "telephone": "+94-XX-XXX-XXXX",
        "email": "burgerhouseweligama@gmail.com",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Main Street",
            "addressLocality": "Weligama",
            "addressRegion": "Southern Province",
            "postalCode": "81700",
            "addressCountry": "LK"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 5.9747,
            "longitude": 80.4295
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "10:00",
                "closes": "22:00"
            }
        ],
        "servesCuisine": ["American", "Fast Food", "Burgers"],
        "priceRange": "$$",
        "paymentAccepted": "Cash",
        "currenciesAccepted": "LKR",
        "menu": `${process.env.NEXT_PUBLIC_APP_URL || "https://whimsical-kelpie-80e090.netlify.app"}/menu`,
        "acceptsReservations": false,
        "hasDeliveryMethod": {
            "@type": "DeliveryMethod",
            "name": "Home Delivery"
        },
        "sameAs": [
            "https://www.facebook.com/burgerhouseweligama",
            "https://www.instagram.com/burgerhouseweligama"
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
