import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
    try {
        const user = await verifyAuth();

        if (!user) {
            return NextResponse.json(
                { authenticated: false },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                authenticated: true,
                user: {
                    userId: user.userId,
                    email: user.email,
                    role: user.role,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Verify error:', error);
        return NextResponse.json(
            { authenticated: false },
            { status: 401 }
        );
    }
}
