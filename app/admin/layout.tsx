import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import "@/styles/admin.css";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user?.id) redirect("/sign-in");

    return (
        <div className="admin-root">
            <AdminSidebar session={session} />
            <div className="admin-main">
                <AdminHeader session={session} />
                <main className="admin-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
