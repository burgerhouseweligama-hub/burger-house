'use client';

import { useState, useRef } from 'react';
import { Star, Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function ReviewForm({
    onReviewSubmitted,
    userImage,
    defaultName
}: {
    onReviewSubmitted: () => void;
    userImage?: string | null;
    defaultName?: string | null;
}) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewerName, setReviewerName] = useState(defaultName || '');
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        if (images.length + files.length > 5) {
            setError('You can upload a maximum of 5 images');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const newImages: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                const promise = new Promise<string>((resolve, reject) => {
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                });

                reader.readAsDataURL(file);
                const base64 = await promise;

                // Upload to API
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64 }),
                });

                if (!res.ok) throw new Error('Failed to upload image');
                const data = await res.json();
                newImages.push(data.url);
            }

            setImages([...images, ...newImages]);
        } catch (err) {
            console.error(err);
            setError('Failed to upload images');
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating) {
            setError('Please select a rating');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reviewerName,
                    rating,
                    comment,
                    images,
                    userImage,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to submit review');
            }

            // Reset form
            setRating(0);
            setComment('');
            setReviewerName('');
            setImages([]);
            onReviewSubmitted();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Write a Review</h3>

            {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                </div>
            )}

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Rating
                </label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="focus:outline-none"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                className={`h-8 w-8 transition-colors ${star <= (hoverRating || rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                </label>
                <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Your Name"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Review
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows={4}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Share your experience..."
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Photos (Max 5)
                </label>
                <div className="flex flex-wrap gap-4">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600">
                            <Image src={img} alt="preview" fill className="object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute right-0 top-0 bg-red-500 p-1 text-white hover:bg-red-600"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                    {images.length < 5 && (
                        <div className="relative flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500 dark:border-gray-600">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="absolute inset-0 cursor-pointer opacity-0"
                            />
                            {loading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                            ) : (
                                <Upload className="h-6 w-6 text-gray-400" />
                            )}
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-orange-600 py-3 font-semibold text-white transition-colors hover:bg-orange-700 disabled:opacity-50"
            >
                {loading ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
}
