import React from "react";
import { auth } from "@/auth";
import Navbar from "@/components/shared/Navbar";
import { after } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
export default async function RootGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    after(async () => {
        if (!session?.user?.id) return;

        const user = await db
            .select()
            .from(users)
            .where(eq(users.id, session?.user?.id))
            .limit(1);

        if (user[0].lastActivityDate === new Date().toISOString().slice(0, 10))
            return;

        await db
            .update(users)
            .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
            .where(eq(users.id, session?.user?.id));
    });

    return (
        <main className="flex flex-col min-h-screen overflow-x-hidden">
            <Navbar session={session} />
            <div className="flex-1 pt-20">{children}</div>
        </main>
    );
}