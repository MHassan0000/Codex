"use client";

import { Search, Menu } from "lucide-react";

interface AdminHeaderProps {
    session: {
        user?: {
            name?: string | null;
        };
    };
    onMenuToggle: () => void;
}

const AdminHeader = ({ session, onMenuToggle }: AdminHeaderProps) => {
    const firstName = session?.user?.name?.split(" ")[0] || "Admin";

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
                    type="text"
                    placeholder="Search users, books by title, author, or genre"
                    className="admin-search-input"
                />
            </div>
        </header>
    );
};

export default AdminHeader;
