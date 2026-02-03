import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import connectToDatabase from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

async function verifyAdmin() {
    const auth = await verifyAuth();

    if (!auth || auth.role !== 'admin') {
        return null;
    }

    return auth.userId;
}

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

        const { searchParams } = new URL(req.url);
        const limitParam = searchParams.get('limit');
        const pageParam = searchParams.get('page');
        const search = searchParams.get('search')?.trim() || '';

        const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10), 1), 100) : 10;
        const page = pageParam ? Math.max(parseInt(pageParam, 10), 1) : 1;
        const skip = (page - 1) * limit;

        // Build base query
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const baseQuery: any = { role: { $ne: 'admin' } };

        // Add search filter
        if (search) {
            baseQuery.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        // Compute start of day for daily metrics
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const [users, total, todayNew] = await Promise.all([
            User.find(baseQuery)
                .sort({ createdAt: -1 })
                .select('name email role authProvider createdAt')
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments(baseQuery),
            User.countDocuments({ ...baseQuery, createdAt: { $gte: startOfDay } }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            users,
            total,
            page,
            limit,
            totalPages,
            todayNew,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { message: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}
