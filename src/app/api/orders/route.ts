import { NextRequest, NextResponse } from 'next/server';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import User from '@/models/User';
import connectToDatabase from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { broadcastEvent } from '@/lib/realtime';

// Helper to get user ID from token
async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) return null;

    try {
        const decoded: any = jwt.verify(
            token.value,
            process.env.JWT_SECRET || 'burger-house-super-secret-jwt-key-2024'
        );
        return decoded.userId || decoded.id;
    } catch (error) {
        return null;
    }
}

// Phone validation helper (Sri Lankan format)
function isValidPhone(phone: string): boolean {
    // Accepts formats: 0771234567, +94771234567, 94771234567
    const phoneRegex = /^(\+?94|0)?[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// POST - Create new order
export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json(
                { message: 'Unauthorized. Please login to place an order.' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { email, phone, deliveryDetails } = body;

        // Validate required fields
        if (!email || !phone || !deliveryDetails) {
            return NextResponse.json(
                { message: 'Missing required fields: email, phone, or delivery details' },
                { status: 400 }
            );
        }

        // Validate phone
        if (!isValidPhone(phone)) {
            return NextResponse.json(
                { message: 'Invalid phone number format' },
                { status: 400 }
            );
        }

        // Validate delivery details
        const { fullName, address, city, postalCode } = deliveryDetails;
        if (!fullName || !address || !city || !postalCode) {
            return NextResponse.json(
                { message: 'All delivery details are required (fullName, address, city, postalCode)' },
                { status: 400 }
            );
        }

        // Get user's cart
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return NextResponse.json(
                { message: 'Your cart is empty' },
                { status: 400 }
            );
        }

        // Prepare order items from cart
        const orderItems = cart.items.map((item: any) => ({
            product: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image || '',
        }));

        // Calculate total
        const totalAmount = orderItems.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
        );

        // Create order
        const order = new Order({
            user: userId,
            email: email.toLowerCase().trim(),
            phone: phone.replace(/\s/g, ''),
            deliveryDetails: {
                fullName: fullName.trim(),
                address: address.trim(),
                city: city.trim(),
                postalCode: postalCode.trim(),
                location: deliveryDetails.location || null,
            },
            items: orderItems,
            totalAmount,
            paymentMethod: 'cash_on_delivery',
            status: 'received',
        });

        await order.save();

        // Clear cart after successful order
        cart.items = [];
        await cart.save();

        // Notify admin listeners about the new order
        broadcastEvent('order_created', {
            orderId: order._id,
            orderNumber: order.orderNumber,
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: order.createdAt,
            customerName: fullName.trim(),
            phone: phone.replace(/\s/g, ''),
            items: orderItems.map((item: any) => ({ name: item.name, quantity: item.quantity })),
        });

        return NextResponse.json(
            {
                message: 'Order placed successfully!',
                order: {
                    _id: order._id,
                    orderNumber: order.orderNumber,
                    totalAmount: order.totalAmount,
                    status: order.status,
                    paymentMethod: order.paymentMethod,
                    deliveryDetails: order.deliveryDetails,
                    itemCount: order.items.length,
                    items: orderItems.map((item: any) => ({
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                    createdAt: order.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { message: 'Failed to create order. Please try again.' },
            { status: 500 }
        );
    }
}

// GET - Get user's orders
export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { message: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
