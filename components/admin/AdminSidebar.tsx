"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    BookCopy,
    ClipboardList,
    UserCheck,
    LogOut,
} from "lucide-react";

interface AdminSidebarProps {
    session: {
        user?: {
            name?: string | null;
            email?: string | null;
        };
    };
}

const navItems = [
    { href: "/admin", label: "Home", icon: LayoutDashboard },
    { href: "/admin/users", label: "All Users", icon: Users },
    { href: "/admin/books", label: "All Books", icon: BookCopy },
    { href: "/admin/borrow-requests", label: "Borrow Requests", icon: ClipboardList },
    { href: "/admin/account-requests", label: "Account Requests", icon: UserCheck },
];

const AdminSidebar = ({ session }: AdminSidebarProps) => {
    const pathname = usePathname();

    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar-logo">
                <Link href="/admin">
                    <Image
                        src="/images/logo.png"
                        alt="Codex"
                        width={40}
                        height={40}
                        className="invert"
                    />
                    <span>Codex</span>
                </Link>
                <span className="admin-badge">Admin</span>
            </div>

            <nav className="admin-nav">
                <ul>
                    {navItems.map((item) => {
                        const isActive =
                            item.href === "/admin"
                                ? pathname === "/admin"
                                : pathname.startsWith(item.href);

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`admin-nav-link${isActive ? " active" : ""}`}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="admin-sidebar-footer">
                <div className="admin-sidebar-footer-inner">
                    <Avatar className="h-9 w-9" style={{ border: "1px solid #e2e8f0" }}>
                        <AvatarFallback
                            style={{
                                background: "rgba(255, 77, 0, 0.08)",
                                color: "#ff4d00",
                                fontSize: "12px",
                                fontWeight: 600,
                            }}
                        >
                            {getInitials(session?.user?.name || "A")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="admin-footer-info">
                        <p className="admin-footer-name">
                            {session?.user?.name || "Admin"}
                        </p>
                        <p className="admin-footer-email">
                            {session?.user?.email}
                        </p>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="admin-signout-btn"
                        title="Sign out"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
