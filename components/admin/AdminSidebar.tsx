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
    X,
    PanelLeftClose,
    PanelLeft,
} from "lucide-react";

interface AdminSidebarProps {
    session: {
        user?: {
            name?: string | null;
            email?: string | null;
        };
    };
    isOpen: boolean;
    collapsed: boolean;
    onClose: () => void;
    onCollapseToggle: () => void;
}

const navItems = [
    { href: "/admin", label: "Home", icon: LayoutDashboard },
    { href: "/admin/users", label: "All Users", icon: Users },
    { href: "/admin/books", label: "All Books", icon: BookCopy },
    { href: "/admin/borrow-requests", label: "Borrow Requests", icon: ClipboardList },
    { href: "/admin/account-requests", label: "Account Requests", icon: UserCheck },
];

const AdminSidebar = ({ session, isOpen, collapsed, onClose, onCollapseToggle }: AdminSidebarProps) => {
    const pathname = usePathname();

    const sidebarClass = [
        "admin-sidebar",
        isOpen ? "open" : "",
        collapsed ? "collapsed" : "",
    ].filter(Boolean).join(" ");

    return (
        <>
            {/* Overlay */}
            <div
                className={`admin-sidebar-overlay${isOpen ? " visible" : ""}`}
                onClick={onClose}
            />

            <aside className={sidebarClass}>
                <div className="admin-sidebar-logo">
                    <Link href="/admin">
                        <Image
                            src="/images/logo.png"
                            alt="Codex"
                            width={40}
                            height={40}
                            className="invert"
                        />
                        <span className="sidebar-label">Codex</span>
                    </Link>
                    <span className="admin-badge sidebar-label">Admin</span>
                    <button
                        className="admin-sidebar-close"
                        onClick={onClose}
                        aria-label="Close sidebar"
                    >
                        <X size={18} />
                    </button>
                </div>

                <nav className="admin-nav">
                    {/* Desktop collapse toggle — above nav links */}
                    <button
                        className="admin-collapse-toggle"
                        onClick={onCollapseToggle}
                        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
                        <span className="sidebar-label">
                            {collapsed ? "Expand" : "Collapse"}
                        </span>
                    </button>

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
                                        onClick={onClose}
                                        title={collapsed ? item.label : undefined}
                                    >
                                        <item.icon size={18} />
                                        <span className="sidebar-label">{item.label}</span>
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
                        <div className="admin-footer-info sidebar-label">
                            <p className="admin-footer-name">
                                {session?.user?.name || "Admin"}
                            </p>
                            <p className="admin-footer-email">
                                {session?.user?.email}
                            </p>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="admin-signout-btn sidebar-label"
                            title="Sign out"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;

