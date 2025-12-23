'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, MessageSquare, Plus, Quote, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ReviewForm from './ReviewForm';
import { useAuth } from '@/context/AuthContext';

interface Review {
    _id: string;
    reviewerName: string;
    rating: number;
    comment: string;
    images: string[];
    userImage?: string;
    createdAt: string;
}

export default function ReviewSection() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const { user, loading: authLoading, signInWithGoogle } = useAuth();

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/reviews');
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error('Failed to fetch reviews', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmitted = () => {
        setShowForm(false);
        fetchReviews();
    };

    // Calculate average rating
    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : '5.0';

    return (
        <section className="py-24 md:py-32 relative overflow-hidden bg-zinc-950" id="reviews">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900/80 backdrop-blur-md border border-zinc-700 rounded-full text-orange-400 text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        Customer Love
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
                        What Our <span className="text-orange-500">Customers</span> Say
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-8">
                        Don't just take our word for it. Here's what burger lovers have to say about their experience.
                    </p>

                    {/* Stats Row */}
                    <div className="flex flex-wrap justify-center gap-8 mb-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-6 h-6 fill-current" />
                                ))}
                            </div>
                            <p className="text-3xl font-black text-white">{avgRating}</p>
                            <p className="text-zinc-500 text-sm">Average Rating</p>
                        </div>
                        <div className="w-px h-16 bg-zinc-800 hidden sm:block" />
                        <div className="text-center">
                            <p className="text-3xl font-black text-white">{reviews.length}</p>
                            <p className="text-zinc-500 text-sm">Happy Reviews</p>
                        </div>
                        <div className="w-px h-16 bg-zinc-800 hidden sm:block" />
                        <div className="text-center">
                            <p className="text-3xl font-black text-white">100%</p>
                            <p className="text-zinc-500 text-sm">Satisfaction</p>
                        </div>
                    </div>

                    {/* Write Review Button */}
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300"
                        >
                            <Plus className="w-5 h-5" />
                            Write a Review
                        </button>
                    )}
                </div>

                {/* Review Form Modal */}
                {showForm && (
                    <div className="mb-16 max-w-2xl mx-auto">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-white">Share Your Experience</h3>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {authLoading ? (
                                <div className="p-8 text-center">
                                    <div className="w-12 h-12 border-4 border-zinc-700 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
                                    <p className="text-zinc-400">Checking login status...</p>
                                </div>
                            ) : user ? (
                                <ReviewForm
                                    onReviewSubmitted={handleReviewSubmitted}
                                    userImage={user.photoURL}
                                    defaultName={user.displayName}
                                />
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <MessageSquare className="w-10 h-10 text-zinc-600" />
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-2">Sign In Required</h4>
                                    <p className="text-zinc-400 mb-6">Join our community to share your experience</p>
                                    <button
                                        onClick={() => signInWithGoogle()}
                                        className="inline-flex items-center gap-3 px-6 py-3 bg-white text-zinc-900 rounded-full font-semibold hover:bg-zinc-100 transition-colors shadow-lg"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Continue with Google
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Reviews Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-16 h-16 border-4 border-zinc-800 border-t-orange-500 rounded-full animate-spin" />
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800">
                        <Quote className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                        <p className="text-zinc-400 text-lg">No reviews yet. Be the first to share your experience!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review, index) => (
                            <div
                                key={review._id}
                                className="group relative animate-in fade-in slide-in-from-bottom-4 duration-500"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Glow Effect */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500" />

                                <div className="relative h-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 group-hover:border-orange-500/30 transition-all duration-300">
                                    {/* Quote Icon */}
                                    <Quote className="absolute top-6 right-6 w-8 h-8 text-zinc-800 group-hover:text-orange-500/20 transition-colors" />

                                    {/* Header */}
                                    <div className="flex items-center gap-4 mb-4">
                                        {review.userImage ? (
                                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-zinc-700 group-hover:border-orange-500/50 transition-colors">
                                                <Image
                                                    src={review.userImage}
                                                    alt={review.reviewerName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-xl">
                                                {review.reviewerName.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white text-lg">{review.reviewerName}</h4>
                                            <p className="text-zinc-500 text-sm">
                                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-zinc-700'}`}
                                            />
                                        ))}
                                        <span className="ml-2 text-zinc-500 text-sm font-medium">{review.rating}.0</span>
                                    </div>

                                    {/* Comment */}
                                    <p className="text-zinc-300 leading-relaxed mb-4 line-clamp-4">
                                        "{review.comment}"
                                    </p>

                                    {/* Images */}
                                    {review.images && review.images.length > 0 && (
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-800">
                                            {review.images.slice(0, 3).map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="relative w-16 h-16 rounded-xl overflow-hidden border border-zinc-700 cursor-pointer hover:border-orange-500/50 transition-colors"
                                                    onClick={() => setSelectedReview(review)}
                                                >
                                                    <Image
                                                        src={img}
                                                        alt={`Review image ${idx}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))}
                                            {review.images.length > 3 && (
                                                <div
                                                    className="w-16 h-16 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm font-bold cursor-pointer hover:bg-zinc-700 transition-colors"
                                                    onClick={() => setSelectedReview(review)}
                                                >
                                                    +{review.images.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Image Lightbox */}
            {selectedReview && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedReview(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-zinc-400 hover:text-white p-2"
                        onClick={() => setSelectedReview(null)}
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <div className="flex gap-4 overflow-x-auto max-w-5xl">
                        {selectedReview.images.map((img, idx) => (
                            <div
                                key={idx}
                                className="relative w-80 h-80 flex-shrink-0 rounded-2xl overflow-hidden"
                                onClick={e => e.stopPropagation()}
                            >
                                <Image
                                    src={img}
                                    alt={`Review image ${idx}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
