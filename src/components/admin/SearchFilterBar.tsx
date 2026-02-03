'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface FilterOption {
    value: string;
    label: string;
}

interface FilterConfig {
    key: string;
    label: string;
    options: FilterOption[];
    defaultValue?: string;
}

interface SearchFilterBarProps {
    searchPlaceholder?: string;
    searchValue: string;
    onSearchChange: (value: string) => void;
    filters?: FilterConfig[];
    filterValues?: Record<string, string>;
    onFilterChange?: (key: string, value: string) => void;
    onClear?: () => void;
    debounceMs?: number;
    isLoading?: boolean;
}

export default function SearchFilterBar({
    searchPlaceholder = 'Search...',
    searchValue,
    onSearchChange,
    filters = [],
    filterValues = {},
    onFilterChange,
    onClear,
    debounceMs = 300,
    isLoading = false,
}: SearchFilterBarProps) {
    const [localSearch, setLocalSearch] = useState(searchValue);

    // Sync local search with prop when prop changes externally
    useEffect(() => {
        setLocalSearch(searchValue);
    }, [searchValue]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== searchValue) {
                onSearchChange(localSearch);
            }
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [localSearch, debounceMs, onSearchChange, searchValue]);

    const handleClear = useCallback(() => {
        setLocalSearch('');
        onSearchChange('');
        onClear?.();
    }, [onSearchChange, onClear]);

    const hasActiveFilters = searchValue || Object.values(filterValues).some(v => v && v !== 'all');

    return (
        <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search input */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="pl-9 pr-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500 text-sm sm:text-base"
                        disabled={isLoading}
                    />
                    {localSearch && (
                        <button
                            onClick={() => {
                                setLocalSearch('');
                                onSearchChange('');
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Filter dropdowns */}
                {filters.map((filter) => (
                    <div key={filter.key} className="w-full sm:w-48">
                        <Select
                            value={filterValues[filter.key] || filter.defaultValue || 'all'}
                            onValueChange={(value) => onFilterChange?.(filter.key, value)}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white text-sm sm:text-base">
                                <Filter className="h-4 w-4 mr-2 flex-shrink-0" />
                                <SelectValue placeholder={filter.label} />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                                {filter.options.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                        className="text-white"
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ))}

                {/* Clear button */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        onClick={handleClear}
                        className="text-zinc-400 hover:text-white hover:bg-zinc-800 whitespace-nowrap"
                        disabled={isLoading}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
}
