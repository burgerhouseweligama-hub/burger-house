import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'burger-house-super-secret-jwt-key-2024';

export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
        return null;
    }
}

// Get token from cookies
export async function getTokenFromCookies(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');
    return token?.value || null;
}

// Verify auth and get user from cookies
export async function verifyAuth(): Promise<JWTPayload | null> {
    const token = await getTokenFromCookies();
    if (!token) return null;
    return verifyToken(token);
}

// Generate random reset token
export function generateResetToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 64; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}
