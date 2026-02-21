"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Menu } from "lucide-react";
import { globalSearch } from "@/lib/admin-actions/search";
import AdminSearchResults from "@/components/admin/AdminSearchResults";

interface AdminHeaderProps {
    session: {
        user?: {
            name?: string | null;
        };
    };
    onMenuToggle: () => void;
}

const emptyData = { users: [], books: [], borrowRequests: [] };

const AdminHeader = ({ session, onMenuToggle }: AdminHeaderProps) => {
    const firstName = session?.user?.name?.split(" ")[0] || "Admin";
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(emptyData);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const performSearch = useCallback(async (q: string) => {
        if (!q || q.trim().length < 2) {
            setResults(emptyData);
            setShowResults(false);
            setLoading(false);
            return;
        }

        setLoading(true);
        setShowResults(true);
        const result = await globalSearch(q);
        if (result.success && result.data) {
            setResults(result.data);
        } else {
            setResults(emptyData);
        }
        setLoading(false);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            performSearch(value);
        }, 300);
    };

    const handleClose = () => {
        setShowResults(false);
    };

    const handleFocus = () => {
        if (query.trim().length >= 2) {
            setShowResults(true);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <header className="admin-header">
            <button
                className="admin-menu-toggle"
                onClick={onMenuToggle}
                aria-label="Open sidebar"
            >
                <Menu size={22} />
            </button>

            <div>
                <h1 className="admin-header-title">
                    Welcome, {firstName}
                </h1>
                <p className="admin-header-subtitle">
                    Monitor and manage your library from one place
                </p>
            </div>

            <div className="admin-search-wrapper">
                <Search size={16} className="admin-search-icon" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    placeholder="Search users, books by title, author, or genre"
                    className="admin-search-input"
                />
                <kbd className="admin-search-kbd">⌘K</kbd>

                {showResults && (
                    <AdminSearchResults
                        data={results}
                        loading={loading}
                        query={query}
                        onClose={handleClose}
                    />
                )}
            </div>
        </header>
    );
};

export default AdminHeader;
