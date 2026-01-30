'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';

// Fix for Leaflet marker icons in Next.js
const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface LocationViewProps {
    lat: number;
    lng: number;
    customerName?: string;
}

export default function LocationView({ lat, lng, customerName }: LocationViewProps) {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    return (
        <div className="space-y-3">
            <div className="h-[250px] w-full rounded-xl overflow-hidden border border-zinc-700 relative z-0">
                <MapContainer
                    center={[lat, lng]}
                    zoom={16}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                    dragging={false}
                    zoomControl={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[lat, lng]} icon={icon}>
                        <Popup>
                            <div className="text-center">
                                <p className="font-semibold">{customerName || 'Delivery Location'}</p>
                                <p className="text-xs text-gray-500">
                                    {lat.toFixed(6)}, {lng.toFixed(6)}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>

            {/* Google Maps Navigation Button */}
            <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
                <Navigation className="w-4 h-4" />
                Open in Google Maps
            </a>

            <p className="text-xs text-zinc-500 flex items-center gap-2 justify-center">
                <MapPin className="w-3 h-3" />
                Coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}
            </p>
        </div>
    );
}
