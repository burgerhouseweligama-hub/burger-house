import { NextRequest, NextResponse } from 'next/server';
import Order from '@/models/Order';
import connectToDatabase from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { sendOrderStatusEmail } from '@/lib/email';
import mongoose from 'mongoose';

// Helper to verify admin authentication
async function verifyAdmin() {
    const auth = await verifyAuth();

    if (!auth || auth.role !== 'admin') {
        return null;
    }

    return auth.userId;
}

// GET - Fetch single order details (admin only)
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const adminId = await verifyAdmin();

        if (!adminId) {
            return NextResponse.json(
                { message: 'Unauthorized. Admin access required.' },
                { status: 401 }
            );
        }

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: 'Invalid order ID' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const order = await Order.findById(id)
            .populate('user', 'displayName email photoURL')
            .populate('items.product', 'name image price')
            .lean();

        if (!order) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(order, { status: 200 });
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { message: 'Failed to fetch order' },
            { status: 500 }
        );
    }
}

// PUT - Update order status (admin only)
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const adminId = await verifyAdmin();

        if (!adminId) {
            return NextResponse.json(
                { message: 'Unauthorized. Admin access required.' },
                { status: 401 }
            );
        }

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: 'Invalid order ID' },
                { status: 400 }
            );
        }

        const body = await req.json();
        const { status } = body;

        // Validate status
        const validStatuses = [
            'order_received',
            'pending_confirmation',
            'preparing',
            'ready_for_pickup',
            'picked_up',
            'out_for_delivery',
            'delivered',
            'cancelled',
        ];
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json(
                { message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        )
            .populate('user', 'displayName email')
            .populate('items.product', 'name image')
            .lean();

        if (!order) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        // Send email notification to customer (fire-and-forget)
        sendOrderStatusEmail(order as any, status).catch((err) => {
            console.error('Failed to send status email:', err);
        });

        return NextResponse.json(
            {
                message: 'Order status updated successfully',
                order,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { message: 'Failed to update order' },
            { status: 500 }
        );
    }
}

