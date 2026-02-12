import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Visitor from '@/models/Visitor';
import { verifyAuth } from '@/lib/auth';

export const runtime = 'nodejs';

function getDateKey(date: Date) {
    const yyyy = date.getFullYear();
    const mm = `${date.getMonth() + 1}`.padStart(2, '0');
    const dd = `${date.getDate()}`.padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

export async function GET() {
    console.log('[API] /api/admin/analytics/visitors called');
    const auth = await verifyAuth();
    console.log('[API] Auth result:', auth);

    if (!auth || auth.role !== 'admin') {
        console.warn('[API] Unauthorized access attempt');
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log('[API] Connecting to DB...');
        await connectDB();
        console.log('[API] DB connected. Fetching visitors...');
        const days = 14;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - (days - 1));

        const docs = await Visitor.find({
            date: { $gte: getDateKey(startDate) },
        })
            .sort({ date: 1 })
            .lean();

        const map: Record<string, number> = {};
        docs.forEach((d) => {
            map[d.date] = d.count || 0;
        });

        const series: { date: string; count: number }[] = [];
        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const key = getDateKey(date);
            series.push({ date: key, count: map[key] || 0 });
        }

        const todayKey = getDateKey(today);
        const todayCount = series.find((d) => d.date === todayKey)?.count || 0;
        const total = series.reduce((sum, d) => sum + d.count, 0);

        return NextResponse.json({ series, today: todayCount, total, days });
    } catch (error) {
        console.error('Visitor analytics error:', error);
        return NextResponse.json({ message: 'Failed to fetch visitor analytics' }, { status: 500 });
    }
}
