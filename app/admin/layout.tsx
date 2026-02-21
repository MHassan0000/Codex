import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import "@/styles/admin.css";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user?.id) redirect("/sign-in");

    const isAdmin = await db
        .select({ isAdmin: users.role })
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1)
        .then((res) => res[0]?.isAdmin === "ADMIN");

    if (!isAdmin) redirect("/");

    return (
        <AdminShell session={session}>
            {children}
        </AdminShell>
    );
}

