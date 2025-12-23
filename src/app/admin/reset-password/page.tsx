'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to reset password');
            }

            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    }

    if (!token) {
        return (
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Lock className="w-8 h-8 text-red-500" />
                </div>
                <div>
                    <h3 className="text-white font-semibold mb-2">Invalid Link</h3>
                    <p className="text-zinc-400 text-sm">
                        This password reset link is invalid or has expired.
                    </p>
                </div>
                <Link href="/admin/forgot-password">
                    <Button className="bg-orange-500 hover:bg-orange-600">
                        Request New Link
                    </Button>
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div>
                    <h3 className="text-white font-semibold mb-2">Password Reset Successfully!</h3>
                    <p className="text-zinc-400 text-sm">
                        Your password has been changed. You can now login with your new password.
                    </p>
                </div>
                <Button
                    onClick={() => router.push('/admin/login')}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                    Go to Login
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">
                    New Password
                </Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500"
                        required
                        minLength={6}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-zinc-300">
                    Confirm Password
                </Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                    <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500"
                        required
                        minLength={6}
                    />
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
            )}

            <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20"
            >
                {loading ? (
                    <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Resetting...
                    </>
                ) : (
                    'Reset Password'
                )}
            </Button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_rgba(249,115,22,0.1)_0%,_transparent_50%)]" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
                <div className="absolute top-1/4 left-0 w-72 h-72 bg-red-500/5 rounded-full blur-3xl" />
            </div>

            {/* Card */}
            <div className="relative w-full max-w-md">
                <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative w-20 h-20 mb-4">
                            <Image
                                src="/logo.png"
                                alt="Burger House Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                            Reset Password
                        </h1>
                        <p className="text-zinc-400 text-sm mt-1 text-center">
                            Enter your new password below
                        </p>
                    </div>

                    <Suspense fallback={<div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>

                {/* Footer */}
                <p className="text-center text-zinc-600 text-xs mt-6">
                    © 2024 Burger House Weligama. All rights reserved.
                </p>
            </div>
        </div>
    );
}
