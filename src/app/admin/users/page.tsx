'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Users, Mail, ShieldCheck, Calendar, Search } from 'lucide-react';

interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    authProvider?: string;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [query, setQuery] = useState('');
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            const res = await fetch('/api/admin/users');
            if (!res.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await res.json();
            setUsers(Array.isArray(data?.users) ? data.users : []);
            setTotal(typeof data?.total === 'number' ? data.total : (data?.users?.length || 0));
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }

    const filteredUsers = useMemo(() => {
        if (!query.trim()) return users;
        const q = query.toLowerCase();
        return users.filter((user) =>
            user.name?.toLowerCase().includes(q) ||
            user.email?.toLowerCase().includes(q) ||
            user.authProvider?.toLowerCase().includes(q) ||
            user.role?.toLowerCase().includes(q)
        );
    }, [query, users]);

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return '—';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Users</h2>
                <p className="text-zinc-400">Registered customers from the database</p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-2 text-zinc-300">
                            <Users className="h-5 w-5 text-orange-500" />
                            <span className="font-semibold">Total Customers:</span>
                            <span className="text-white">{total}</span>
                        </div>
                        <div className="w-full md:w-80 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <Input
                                placeholder="Search by name, email, or provider..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-6 w-6 text-orange-500 animate-spin" />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <p className="text-zinc-500 text-sm">No users match your search.</p>
                    ) : (
                        <div className="space-y-4">
                            {filteredUsers.map((user) => (
                                <Card key={user._id} className="bg-zinc-900/80 border-zinc-800">
                                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                                                <Users className="h-5 w-5 text-orange-400" />
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold">{user.name || 'Customer'}</p>
                                                <div className="flex items-center gap-3 text-xs text-zinc-400">
                                                    <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{user.email}</span>
                                                    <span className="inline-flex items-center gap-1 capitalize text-amber-400/90"><ShieldCheck className="h-3 w-3" />{user.role}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-zinc-500" />
                                            <span>Joined {formatDate(user.createdAt)}</span>
                                            <span className="text-zinc-500">•</span>
                                            <span className="capitalize">{user.authProvider || 'local'}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
