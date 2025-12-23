'use client';

import { useState, useEffect } from 'react';
import { Trash2, Star, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Review {
    _id: string;
    reviewerName: string;
    rating: number;
    comment: string;
    status: string;
    images: string[];
    createdAt: string;
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await fetch('/api/reviews');
            if (!response.ok) throw new Error('Failed to fetch reviews');
            const data = await response.json();
            setReviews(data);
        } catch (err) {
            setError('Error loading reviews');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        setDeletingId(id);
        try {
            const response = await fetch(`/api/reviews/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete review');

            setReviews(reviews.filter((review) => review._id !== id));
        } catch (err) {
            alert('Failed to delete review');
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Reviews Management
                </h1>
                <div className="text-gray-500">
                    Total Reviews: {reviews.length}
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Reviewer</th>
                                <th scope="col" className="px-6 py-3">Rating</th>
                                <th scope="col" className="px-6 py-3">Comment</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((review) => (
                                <tr
                                    key={review._id}
                                    className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        {review.reviewerName}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-yellow-400">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="line-clamp-2 max-w-xs">{review.comment}</p>
                                        {review.images && review.images.length > 0 && (
                                            <div className="mt-2 flex gap-1">
                                                {review.images.map((img, idx) => (
                                                    <div key={idx} className="relative h-8 w-8 overflow-hidden rounded bg-gray-100">
                                                        <Image src={img} alt="review" fill className="object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDelete(review._id)}
                                            disabled={deletingId === review._id}
                                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-900/20"
                                        >
                                            {deletingId === review._id ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-5 w-5" />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {reviews.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500">
                                        No reviews found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
