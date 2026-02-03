'use client';

import { useEffect } from 'react';

export default function AnalyticsTracker() {
    useEffect(() => {
        const sendPing = () => {
            fetch('/api/analytics/visit', {
                method: 'POST',
                keepalive: true,
            }).catch(() => {
                // Ignore failures; best-effort
            });
        };

        sendPing();
    }, []);

    return null;
}
