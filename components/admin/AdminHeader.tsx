"use client";

import { Search } from "lucide-react";
import { usePathname } from "next/navigation";

interface AdminHeaderProps {
    session: {
        user?: {
            name?: string | null;
        };
    };
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
    "/admin": { title: "Dashboard", subtitle: "Monitor all library activity and manage resources here" },
    "/admin/users": { title: "All Users", subtitle: "View and manage all registered library members" },
    "/admin/books": { title: "All Books", subtitle: "Manage book inventory, add or remove titles" },
    "/admin/borrow-requests": { title: "Borrow Requests", subtitle: "Review and approve pending book borrow requests" },
    "/admin/account-requests": { title: "Account Requests", subtitle: "Review and approve new user account registrations" },
};

const AdminHeader = ({ session }: AdminHeaderProps) => {
    const pathname = usePathname();
    const pageInfo = pageTitles[pathname] || pageTitles["/admin"];
    const firstName = session?.user?.name?.split(" ")[0] || "Admin";

    return (
        <header className="admin-header">
            <div>
                <h1 className="admin-header-title">
                    {pathname === "/admin"
                        ? `Welcome, ${firstName}`
                        : pageInfo.title}
                </h1>
                <p className="admin-header-subtitle">
                    {pageInfo.subtitle}
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
