import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import "@/styles/admin.css";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user?.id) redirect("/sign-in");

    return (
        <AdminShell session={session}>
            {children}
        </AdminShell>
    );
}

