import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateResetToken } from '@/lib/auth';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json(
                { success: true, message: 'If an account exists with this email, a reset link has been sent.' },
                { status: 200 }
            );
        }

        // Generate reset token
        const resetToken = generateResetToken();
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Save token to user
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // Build reset URL
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const resetUrl = `${baseUrl}/admin/reset-password?token=${resetToken}`;

        // Check if Gmail credentials are configured
        if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
            // Send email using Nodemailer
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_APP_PASSWORD,
                },
            });

            await transporter.sendMail({
                from: `"Burger House" <${process.env.GMAIL_USER}>`,
                to: user.email,
                subject: 'Password Reset - Burger House Admin',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #f97316;">Burger House Admin</h2>
                        <p>Hello ${user.name},</p>
                        <p>You requested to reset your password. Click the link below to set a new password:</p>
                        <p>
                            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #f97316, #dc2626); color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                Reset Password
                            </a>
                        </p>
                        <p>This link will expire in 1 hour.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="color: #666; font-size: 12px;">Burger House Weligama</p>
                    </div>
                `,
            });

            console.log('Password reset email sent to:', user.email);
        } else {
            // Gmail not configured - log the reset URL for development
            console.log('======================================');
            console.log('GMAIL_USER/GMAIL_APP_PASSWORD not configured. Reset URL:');
            console.log(resetUrl);
            console.log('======================================');
        }

        return NextResponse.json(
            { success: true, message: 'If an account exists with this email, a reset link has been sent.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
