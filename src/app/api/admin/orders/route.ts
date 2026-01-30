import { NextRequest, NextResponse } from 'next/server';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';
import connectToDatabase from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// Helper to verify admin authentication
async function verifyAdmin() {
    const auth = await verifyAuth();

    if (!auth || auth.role !== 'admin') {
        return null;
    }

    return auth.userId;
}

// GET - Fetch all orders (admin only)
export async function GET(req: NextRequest) {
    try {
        const adminId = await verifyAdmin();

        if (!adminId) {
            return NextResponse.json(
                { message: 'Unauthorized. Admin access required.' },
                { status: 401 }
            );
        }

        await connectToDatabase();

        // Get query parameters for filtering
        const { searchParams } = new URL(req.url);
        const statusFilter = searchParams.get('status');

        // Build query
        const query: any = {};
        if (statusFilter && statusFilter !== 'all') {
            query.status = statusFilter;
        }

        // Ensure models are registered for populate
        void User;
        void Product;

        // Fetch orders with populated user data
        const orders = await Order.find(query)
            .populate('user', 'displayName email')
            .populate('items.product', 'name image')
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
