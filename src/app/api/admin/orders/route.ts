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

// GET - Fetch orders with pagination (admin only)
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

        // Get query parameters
        const { searchParams } = new URL(req.url);
        const statusFilter = searchParams.get('status');
        const search = searchParams.get('search')?.trim() || '';
        const pageParam = searchParams.get('page');
        const limitParam = searchParams.get('limit');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

        // Pagination settings
        const page = pageParam ? Math.max(parseInt(pageParam, 10), 1) : 1;
        const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10), 1), 100) : 10;
        const skip = (page - 1) * limit;

        // Build query
        const query: any = {};

        // Status filter
        if (statusFilter && statusFilter !== 'all') {
            query.status = statusFilter;
        }

        // Search filter (order number, email)
        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        // Ensure models are registered for populate
        void User;
        void Product;

        // Build sort object
        const sortObj: Record<string, 1 | -1> = {};
        sortObj[sortBy] = sortOrder;

        // Execute queries in parallel
        const [orders, total] = await Promise.all([
            Order.find(query)
                .populate('user', 'displayName email')
                .populate('items.product', 'name image')
                .sort(sortObj)
                .skip(skip)
                .limit(limit)
                .lean(),
            Order.countDocuments(query),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            orders,
            total,
            page,
            limit,
            totalPages,
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { message: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
