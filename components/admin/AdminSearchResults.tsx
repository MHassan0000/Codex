"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Users, BookCopy, ClipboardList } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface SearchUser {
    id: string;
    fullName: string;
    email: string;
    role: string;
    status: string;
}

interface SearchBook {
    id: string;
    title: string;
    author: string;
    genre: string;
}

interface SearchBorrow {
    id: string;
    status: string;
    bookTitle: string;
    bookId: string;
    userName: string;
    userId: string;
}

interface SearchData {
    users: SearchUser[];
    books: SearchBook[];
    borrowRequests: SearchBorrow[];
}

interface Props {
    data: SearchData;
    loading: boolean;
    query: string;
    onClose: () => void;
}

const AdminSearchResults = ({ data, loading, query, onClose }: Props) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                const wrapper = (e.target as HTMLElement).closest(".admin-search-wrapper");
                if (!wrapper) onClose();
            }
        };

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);

    if (loading) {
        return (
            <div className="admin-search-results" ref={ref}>
                <div className="admin-search-loading">
                    <div className="admin-search-spinner" />
                    <span>Searching…</span>
                </div>
            </div>
        );
    }

    const totalResults =
        data.users.length + data.books.length + data.borrowRequests.length;

    if (totalResults === 0) {
        return (
            <div className="admin-search-results" ref={ref}>
                <div className="admin-search-empty">
                    No results found for &quot;{query}&quot;
                </div>
            </div>
        );
    }

    return (
        <div className="admin-search-results" ref={ref}>
            {data.users.length > 0 && (
                <div className="admin-search-category">
                    <div className="admin-search-category-header">
                        <Users size={14} />
                        <span>Users</span>
                        <span className="admin-search-count">
                            {data.users.length}
                        </span>
                    </div>
                    {data.users.map((user) => (
                        <Link
                            key={user.id}
                            href={`/admin/users/${user.id}`}
                            className="admin-search-item"
                            onClick={onClose}
                        >
                            <span className="admin-search-avatar">
                                {getInitials(user.fullName)}
                            </span>
                            <div className="admin-search-item-info">
                                <span className="admin-search-item-title">
                                    {user.fullName}
                                </span>
                                <span className="admin-search-item-meta">
                                    {user.email}
                                </span>
                            </div>
                            <span
                                className={`admin-search-badge ${user.role?.toLowerCase()}`}
                            >
                                {user.role}
                            </span>
                        </Link>
                    ))}
                </div>
            )}

            {data.books.length > 0 && (
                <div className="admin-search-category">
                    <div className="admin-search-category-header">
                        <BookCopy size={14} />
                        <span>Books</span>
                        <span className="admin-search-count">
                            {data.books.length}
                        </span>
                    </div>
                    {data.books.map((book) => (
                        <Link
                            key={book.id}
                            href={`/admin/books/${book.id}`}
                            className="admin-search-item"
                            onClick={onClose}
                        >
                            <span className="admin-search-book-icon">📚</span>
                            <div className="admin-search-item-info">
                                <span className="admin-search-item-title">
                                    {book.title}
                                </span>
                                <span className="admin-search-item-meta">
                                    {book.author} • {book.genre}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {data.borrowRequests.length > 0 && (
                <div className="admin-search-category">
                    <div className="admin-search-category-header">
                        <ClipboardList size={14} />
                        <span>Borrow Requests</span>
                        <span className="admin-search-count">
                            {data.borrowRequests.length}
                        </span>
                    </div>
                    {data.borrowRequests.map((req) => (
                        <Link
                            key={req.id}
                            href={`/admin/borrow-requests?status=${req.status}`}
                            className="admin-search-item"
                            onClick={onClose}
                        >
                            <span className="admin-search-book-icon">📋</span>
                            <div className="admin-search-item-info">
                                <span className="admin-search-item-title">
                                    {req.bookTitle}
                                </span>
                                <span className="admin-search-item-meta">
                                    Borrowed by {req.userName} •{" "}
                                    <span
                                        className={`admin-search-status ${req.status.toLowerCase()}`}
                                    >
                                        {req.status}
                                    </span>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminSearchResults;
