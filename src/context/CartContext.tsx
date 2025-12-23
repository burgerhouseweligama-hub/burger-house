'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext'; // Assuming this exists

export interface CartProduct {
    _id: string;
    name: string;
    price: number;
    image: string;
    category?: any; // Simplify for frontend
}

export interface CartItem {
    _id?: string; // Item ID in array (optional depending on mongoose)
    product: CartProduct;
    quantity: number;
}

export interface CartContextType {
    items: CartItem[];
    addToCart: (productId: string, quantity?: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, action: 'increase' | 'decrease') => Promise<void>;
    cartCount: number;
    cartTotal: number;
    isLoading: boolean;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth(); // Assuming AuthContext provides user object

    const fetchCart = async () => {
        if (!user) {
            setItems([]);
            return;
        }

        try {
            const res = await fetch('/api/cart');
            if (res.ok) {
                const data = await res.json();
                if (data && data.items) {
                    setItems(data.items);
                }
            } else {
                console.error("Failed to fetch cart");
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (productId: string, quantity: number = 1) => {
        if (!user) {
            alert("Please login to add to cart"); // TODO: Replace with Toast later
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity }),
            });

            if (res.ok) {
                const updatedCart = await res.json();
                setItems(updatedCart.items);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromCart = async (productId: string) => {
        try {
            const res = await fetch(`/api/cart?productId=${productId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                const updatedCart = await res.json();
                setItems(updatedCart.items);
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const updateQuantity = async (productId: string, action: 'increase' | 'decrease') => {
        try {
            // For decrease, we use DELETE endpoint with action param based on my API design,
            // or I could have used PUT/PATCH. In my API route, DELETE handles 'decrease'.
            // Wait, I need to check my API logic.
            // DELETE with action='decrease' decrements.
            // But for increase? I should use POST again? Or implement a dedicated update route.
            // POST adds quantity, so calling POST with quantity 1 effectively increases.
            // Let's use POST for increase and DELETE (decrease) for decrease.

            if (action === 'increase') {
                await addToCart(productId, 1);
            } else {
                const res = await fetch(`/api/cart?productId=${productId}&action=decrease`, {
                    method: 'DELETE',
                });
                if (res.ok) {
                    const updatedCart = await res.json();
                    setItems(updatedCart.items);
                }
            }

        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    }

    const cartCount = items.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal, isLoading, refreshCart: fetchCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
