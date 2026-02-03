'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Redirect to admin dashboard
            router.push('/admin');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
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

            {/* Login Card */}
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
                            Admin Login
                        </h1>
                        <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                            Sign in to manage your restaurant
                        </p>
                    </div>

                    {/* Form */}
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

                        <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="password" className="text-zinc-300 text-sm">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-zinc-500" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-9 sm:pl-10 pr-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500 text-sm sm:text-base"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                                    ) : (
                                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                                    )}
                                </button>
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
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>

                        <div className="text-center">
                            <Link
                                href="/admin/forgot-password"
                                className="text-xs sm:text-sm text-orange-400 hover:text-orange-300 transition-colors"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                    </form>

                    {/* Back to site */}
                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-zinc-800 text-center">
                        <Link
                            href="/"
                            className="text-xs sm:text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                            ← Back to website
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-zinc-600 text-[10px] sm:text-xs mt-4 sm:mt-6">
                    © 2024 Burger House Weligama. All rights reserved.
                </p>
            </div>
        </div>
    );
}
