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

    return (
        <div className="admin-root">
            <AdminSidebar
                session={session}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
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
