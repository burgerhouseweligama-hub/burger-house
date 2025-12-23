'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB');
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            // Convert to base64
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            // Upload to Cloudinary via our API
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64 }),
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            onChange(data.url);
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={disabled || isUploading}
                className="hidden"
                id="image-upload"
            />

            {value ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700">
                    <Image
                        src={value}
                        alt="Uploaded image"
                        fill
                        className="object-cover"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemove}
                        disabled={disabled || isUploading}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <label
                    htmlFor="image-upload"
                    className={`
            flex flex-col items-center justify-center w-full aspect-video
            border-2 border-dashed border-zinc-600 rounded-lg
            bg-zinc-800/50 hover:bg-zinc-800 transition-colors cursor-pointer
            ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="h-10 w-10 text-orange-500 animate-spin mb-2" />
                            <span className="text-zinc-400 text-sm">Uploading...</span>
                        </>
                    ) : (
                        <>
                            <Upload className="h-10 w-10 text-zinc-500 mb-2" />
                            <span className="text-zinc-400 text-sm">Click to upload image</span>
                            <span className="text-zinc-500 text-xs mt-1">PNG, JPG, WEBP up to 5MB</span>
                        </>
                    )}
                </label>
            )}

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}
        </div>
    );
}
