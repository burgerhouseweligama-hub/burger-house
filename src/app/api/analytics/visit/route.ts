import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Visitor from '@/models/Visitor';

export const runtime = 'nodejs';

function getTodayKey() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = `${now.getMonth() + 1}`.padStart(2, '0');
    const dd = `${now.getDate()}`.padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const today = getTodayKey();

        await Visitor.findOneAndUpdate(
            { date: today },
            { $inc: { count: 1 } },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Visitor track error:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

// Optional ping endpoint to check current count
export async function GET() {
    try {
        await connectDB();
        const today = getTodayKey();
        const doc = await Visitor.findOne({ date: today }).lean();
        return NextResponse.json({ date: today, count: doc?.count || 0 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching visitor count' }, { status: 500 });
    }
}
