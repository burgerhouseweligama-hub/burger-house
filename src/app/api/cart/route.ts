import { NextRequest, NextResponse } from 'next/server';
import Cart, { ICart } from '@/models/Cart';
import Product from '@/models/Product';
import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';
import User from '@/models/User';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// Helper to get user ID from token
async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) return null;

    try {
        const decoded: any = jwt.verify(token.value, process.env.JWT_SECRET || 'burger-house-super-secret-jwt-key-2024');
        return decoded.userId || decoded.id;
    } catch (error) {
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        let cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }

        return NextResponse.json(cart, { status: 200 });
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { productId, quantity } = await req.json();

        if (!productId || typeof quantity !== 'number') {
            return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
        }

        // simple validation to check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();

        // Re-fetch populated cart
        const populatedCart = await Cart.findById(cart._id).populate('items.product');

        return NextResponse.json(populatedCart, { status: 200 });
    } catch (error) {
        console.error('Error adding to cart:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectToDatabase();
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');
        const action = searchParams.get('action'); // 'remove' (single item) or 'clear' (all) or 'decrease'

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
        }

        if (productId) {
            if (action === 'decrease') {
                const existingItemIndex = cart.items.findIndex(
                    (item) => item.product.toString() === productId
                );
                if (existingItemIndex > -1) {
                    if (cart.items[existingItemIndex].quantity > 1) {
                        cart.items[existingItemIndex].quantity -= 1;
                    } else {
                        cart.items.splice(existingItemIndex, 1);
                    }
                }
            } else {
                cart.items = cart.items.filter(item => item.product.toString() !== productId);
            }
        } else {
            // Clear cart or specific logic if needed, but for now allow clearing specific product
            cart.items = [];
        }

        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.product');

        return NextResponse.json(populatedCart, { status: 200 });

    } catch (error) {
        console.error('Error updating cart:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
