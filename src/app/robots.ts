import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://whimsical-kelpie-80e090.netlify.app';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/cart/',
                    '/checkout/',
                    '/profile/',
                    '/login/',
                    '/signup/',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
