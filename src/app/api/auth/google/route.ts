
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { name, email, uid, photoURL } = await req.json();

        if (!email || !uid) {
            return NextResponse.json(
                { message: 'Email and UID are required' },
                { status: 400 }
            );
        }

        // Check if user exists
        let user = await User.findOne({
            $or: [{ firebaseUid: uid }, { email: email }]
        });

        if (user) {
            // Update existing user with firebase UID if missing (linking accounts)
            if (!user.firebaseUid) {
                user.firebaseUid = uid;
                user.authProvider = 'google'; // Or keep 'local' but add 'google' support?
                // Let's set it to google if they are logging in with it
                user.authProvider = 'google';
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                name,
                email,
                firebaseUid: uid,
                authProvider: 'google',
                role: 'user', // Default role
            });
        }

        // Generate JWT Token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        const cookieStore = await cookies();
        cookieStore.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return NextResponse.json({
            message: 'Authentication successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                photoURL // We might not save this in DB yet, but return it for UI if needed
            }
        });

    } catch (error) {
        console.error('Google auth error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
