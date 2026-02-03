'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    pageSizeOptions?: number[];
    isLoading?: boolean;
}

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 50],
    isLoading = false,
}: PaginationProps) {
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const canGoPrev = currentPage > 1 && !isLoading;
    const canGoNext = currentPage < totalPages && !isLoading;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            {/* Items count */}
            <div className="text-sm text-zinc-400 order-2 sm:order-1">
                Showing <span className="font-medium text-white">{startItem}</span> to{' '}
                <span className="font-medium text-white">{endItem}</span> of{' '}
                <span className="font-medium text-white">{totalItems}</span> results
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 order-1 sm:order-2">
                {/* Page size selector */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-400 hidden sm:inline">Show</span>
                    <Select
                        value={String(pageSize)}
                        onValueChange={(value) => onPageSizeChange(Number(value))}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="w-20 bg-zinc-800 border-zinc-700 text-white text-sm h-9">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                            {pageSizeOptions.map((size) => (
                                <SelectItem key={size} value={String(size)} className="text-white">
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Navigation buttons */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
                        onClick={() => onPageChange(1)}
                        disabled={!canGoPrev}
                        title="First page"
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={!canGoPrev}
                        title="Previous page"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page indicator */}
                    <div className="flex items-center gap-1 px-2">
                        <span className="text-sm text-zinc-400">Page</span>
                        <span className="text-sm font-medium text-white min-w-[2ch] text-center">
                            {currentPage}
                        </span>
                        <span className="text-sm text-zinc-400">of {totalPages || 1}</span>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={!canGoNext}
                        title="Next page"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
                        onClick={() => onPageChange(totalPages)}
                        disabled={!canGoNext}
                        title="Last page"
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
