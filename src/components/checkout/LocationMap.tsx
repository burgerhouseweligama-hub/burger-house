'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Locate, MapPin } from 'lucide-react';

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

// Weligama coordinates
const DEFAULT_CENTER: [number, number] = [5.9728, 80.4288];

interface LocationMapProps {
    onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    const [position, setPosition] = useState<L.LatLng | null>(null);

    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
        },
        locationfound(e) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={icon}>
            <Popup>Delivery Location</Popup>
        </Marker>
    );
}

export default function LocationMap({ onLocationSelect }: LocationMapProps) {
    const [map, setMap] = useState<L.Map | null>(null);

    const handleLocateMe = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent form submission
        if (map) {
            map.locate();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-zinc-400 text-sm font-medium">
                    Pin Location <span className="text-red-500">*</span>
                </label>
                <button
                    onClick={handleLocateMe}
                    className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium text-orange-500 transition-colors"
                >
                    <Locate className="w-3 h-3" />
                    Use Current Location
                </button>
            </div>

            <div className="h-[300px] w-full rounded-xl overflow-hidden border border-zinc-700 relative z-0">
                <MapContainer
                    center={DEFAULT_CENTER}
                    zoom={15}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                    ref={setMap}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker onLocationSelect={onLocationSelect} />
                </MapContainer>
            </div>
            <p className="text-xs text-zinc-500 flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                Tap on the map to pin your exact delivery location
            </p>
        </div>
    );
}
