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

        const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10), 1), 100) : null;
        const page = pageParam ? Math.max(parseInt(pageParam, 10), 1) : 1;
        const skip = limit ? (page - 1) * limit : 0;

        const baseQuery = { role: { $ne: 'admin' } };

        // Compute start of day for daily metrics
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const userQuery = User.find(baseQuery)
            .sort({ createdAt: -1 })
            .select('name email role authProvider createdAt');

        if (limit) {
            userQuery.skip(skip).limit(limit);
        }

        const [users, total, todayNew] = await Promise.all([
            userQuery.lean(),
            User.countDocuments(baseQuery),
            User.countDocuments({ ...baseQuery, createdAt: { $gte: startOfDay } }),
        ]);

        return NextResponse.json({
            users,
            total,
            page: limit ? page : 1,
            limit: limit || users.length,
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
