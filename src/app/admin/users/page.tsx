'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Users, Mail, ShieldCheck, Calendar } from 'lucide-react';
import Pagination from '@/components/admin/Pagination';
import SearchFilterBar from '@/components/admin/SearchFilterBar';

interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    authProvider?: string;
    createdAt: string;
}

interface UsersResponse {
    users: AdminUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    todayNew: number;
}

export default function UsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [todayNew, setTodayNew] = useState(0);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(currentPage),
                limit: String(pageSize),
            });

            if (searchQuery) {
                params.set('search', searchQuery);
            }

            const res = await fetch(`/api/admin/users?${params}`);
            if (!res.ok) {
                throw new Error('Failed to fetch users');
            }
            const data: UsersResponse = await res.json();
            setUsers(data.users || []);
            setTotalItems(data.total || 0);
            setTotalPages(data.totalPages || 0);
            setTodayNew(data.todayNew || 0);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, searchQuery]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

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
        <div className="space-y-4 sm:space-y-6">
            <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Users</h2>
                <p className="text-sm sm:text-base text-zinc-400">Registered customers from the database</p>
            </div>

            {/* Stats & Search */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                        <div className="flex items-center gap-2 text-zinc-300">
                            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                            <span className="font-semibold text-sm sm:text-base">Total:</span>
                            <span className="text-white text-sm sm:text-base">{totalItems}</span>
                        </div>
                        {todayNew > 0 && (
                            <div className="flex items-center gap-2 text-zinc-300">
                                <span className="text-emerald-400 text-sm sm:text-base">+{todayNew} today</span>
                            </div>
                        )}
                    </div>

                    <SearchFilterBar
                        searchPlaceholder="Search by name or email..."
                        searchValue={searchQuery}
                        onSearchChange={handleSearchChange}
                        onClear={handleClearFilters}
                        isLoading={loading}
                    />
                </CardContent>
            </Card>

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center py-8 sm:py-10">
                    <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 animate-spin" />
                </div>
            ) : users.length === 0 ? (
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                        <Users className="h-10 w-10 sm:h-12 sm:w-12 text-zinc-600 mb-3 sm:mb-4" />
                        <p className="text-zinc-500 text-xs sm:text-sm">
                            {searchQuery ? 'No users match your search.' : 'No users found.'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="space-y-3 sm:space-y-4">
                        {users.map((user) => (
                            <Card key={user._id} className="bg-zinc-900/80 border-zinc-800">
                                <CardContent className="p-3 sm:p-4 flex flex-col gap-3">
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                                            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-white font-semibold text-sm sm:text-base truncate">{user.name || 'Customer'}</p>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-zinc-400 mt-0.5">
                                                <span className="inline-flex items-center gap-1 truncate"><Mail className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" /><span className="truncate max-w-[140px] sm:max-w-none">{user.email}</span></span>
                                                <span className="inline-flex items-center gap-1 capitalize text-amber-400/90"><ShieldCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3" />{user.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs sm:text-sm text-zinc-400 flex flex-wrap items-center gap-1.5 sm:gap-2 ml-10 sm:ml-13">
                                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-zinc-500 flex-shrink-0" />
                                        <span>Joined {formatDate(user.createdAt)}</span>
                                        <span className="text-zinc-600">•</span>
                                        <span className="capitalize">{user.authProvider || 'local'}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardContent className="px-4 sm:px-6 py-2">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                pageSize={pageSize}
                                onPageChange={handlePageChange}
                                onPageSizeChange={handlePageSizeChange}
                                isLoading={loading}
                            />
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
