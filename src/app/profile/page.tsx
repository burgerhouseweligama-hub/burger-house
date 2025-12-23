
"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function ProfilePage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white">My Profile</h1>
                    <Button
                        variant="outline"
                        onClick={logout}
                        className="border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                    </Button>
                </div>

                {/* Profile Card */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar */}
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-800">
                            {user.photoURL ? (
                                <Image
                                    src={user.photoURL}
                                    alt={user.displayName || "User"}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                    <UserIcon className="h-12 w-12 text-zinc-500" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h2 className="text-2xl font-bold text-white">
                                {user.displayName || "Burger Lover"}
                            </h2>
                            <p className="text-zinc-400">
                                {user.email}
                            </p>
                            <div className="pt-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                    Member
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders (Placeholder) */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8 text-center">
                        <p className="text-zinc-500">No recent orders found.</p>
                        <Button variant="link" asChild className="text-orange-400 mt-2">
                            <Link href="/menu">Browse Menu</Link>
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
