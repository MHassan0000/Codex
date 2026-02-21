"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";

const TableSearch = ({ placeholder }: { placeholder?: string }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("query") || "";
    const [value, setValue] = useState(initialQuery);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const pushQuery = useCallback(
        (q: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (q.trim()) {
                params.set("query", q.trim());
            } else {
                params.delete("query");
            }
            router.push(`${pathname}?${params.toString()}`);
        },
        [router, pathname, searchParams]
    );

    useEffect(() => {
        setValue(searchParams.get("query") || "");
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            pushQuery(newValue);
        }, 300);
    };

    const handleClear = () => {
        setValue("");
        pushQuery("");
    };

    return (
        <div className="admin-table-search">
            <Search size={15} className="admin-table-search-icon" />
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder || "Search…"}
                className="admin-table-search-input"
            />
            {value && (
                <button
                    onClick={handleClear}
                    className="admin-table-search-clear"
                    title="Clear search"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
};

export default TableSearch;
