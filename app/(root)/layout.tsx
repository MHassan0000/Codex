import React from "react";
import Navbar from "@/components/shared/Navbar";

export default function RootGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="flex flex-col min-h-screen overflow-x-hidden">
            <Navbar />
            <div className="flex-1 pt-20">{children}</div>
        </main>
    )
}