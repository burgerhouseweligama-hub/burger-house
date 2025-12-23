'use client';

import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

interface Product {
    _id: string;
    name: string;
    price: number;
    image: string;
    category?: any;
    description?: string;
    isAvailable: boolean;
}

export default function AddToCartButton({ product }: { product: Product }) {
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const { addToCart } = useCart();
    const { showToast } = useToast();

    const handleAddToCart = async () => {
        if (!product.isAvailable) return;

        setIsLoading(true);
        try {
            await addToCart(product._id, quantity);
            showToast(`Added ${quantity} ${product.name} to cart`);
            setQuantity(1); // Reset quantity
        } catch (error) {
            showToast("Failed to add to cart", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!product.isAvailable) {
        return (
            <button disabled className="w-full bg-zinc-800 text-zinc-500 py-4 rounded-xl font-bold cursor-not-allowed">
                Sold Out
            </button>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3">
                <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="text-zinc-400 hover:text-white transition-colors"
                >
                    <Minus className="w-5 h-5" />
                </button>
                <span className="font-bold text-xl min-w-[20px] text-center">{quantity}</span>
                <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="text-zinc-400 hover:text-white transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-70 disabled:hover:scale-100"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <ShoppingCart className="w-5 h-5" />
                )}
                Add to Cart - ${(product.price * quantity).toFixed(2)}
            </button>
        </div>
    );
}
