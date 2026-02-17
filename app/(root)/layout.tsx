import React from "react";
import { auth } from "@/auth";
import Navbar from "@/components/shared/Navbar";

export default async function RootGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <main className="flex flex-col min-h-screen overflow-x-hidden">
            <Navbar session={session} />
            <div className="flex-1 pt-20">{children}</div>
        </main>
    );
}