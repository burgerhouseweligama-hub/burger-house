'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send reset email');
            }

            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_rgba(249,115,22,0.1)_0%,_transparent_50%)]" />
                <div className="absolute bottom-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-orange-500/5 rounded-full blur-3xl" />
                <div className="absolute top-1/4 left-0 w-36 sm:w-72 h-36 sm:h-72 bg-red-500/5 rounded-full blur-3xl" />
            </div>

            {/* Card */}
            <div className="relative w-full max-w-md">
                <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-6 sm:mb-8">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4">
                            <Image
                                src="/logo.png"
                                alt="Burger House Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                            Forgot Password
                        </h1>
                        <p className="text-zinc-400 text-xs sm:text-sm mt-1 text-center">
                            Enter your email to receive a reset link
                        </p>
                    </div>

                    {success ? (
                        <div className="text-center space-y-4 sm:space-y-6">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Check Your Email</h3>
                                <p className="text-zinc-400 text-xs sm:text-sm">
                                    If an account exists with <span className="text-orange-400 break-all">{email}</span>,
                                    you will receive a password reset link shortly.
                                </p>
                            </div>
                            <Link href="/admin/login">
                                <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-sm sm:text-base">
                                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            <div className="space-y-1.5 sm:space-y-2">
                                <Label htmlFor="email" className="text-zinc-300 text-sm">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-zinc-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@burgerhouse.lk"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-9 sm:pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500 text-sm sm:text-base"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-2.5 sm:p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <p className="text-red-400 text-xs sm:text-sm text-center">{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-5 sm:py-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 text-sm sm:text-base"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </Button>

                            <div className="text-center">
                                <Link
                                    href="/admin/login"
                                    className="text-xs sm:text-sm text-zinc-400 hover:text-zinc-300 transition-colors inline-flex items-center"
                                >
                                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-zinc-600 text-[10px] sm:text-xs mt-4 sm:mt-6">
                    © 2024 Burger House Weligama. All rights reserved.
                </p>
            </div>
        </div>
    );
}
