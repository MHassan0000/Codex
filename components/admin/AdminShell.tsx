"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

interface AdminShellProps {
    session: any;
    children: React.ReactNode;
}

const AdminShell = ({ session, children }: AdminShellProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const rootClass = `admin-root${collapsed ? " sidebar-collapsed" : ""}`;

    return (
        <div className={rootClass}>
            <AdminSidebar
                session={session}
                isOpen={sidebarOpen}
                collapsed={collapsed}
                onClose={() => setSidebarOpen(false)}
                onCollapseToggle={() => setCollapsed((prev) => !prev)}
            />
            <div className="admin-main">
                <AdminHeader
                    session={session}
                    onMenuToggle={() => setSidebarOpen(true)}
                />
                <main className="admin-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminShell;

