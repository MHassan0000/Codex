"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface NavbarSession {
    user?: {
        id?: string;
        name?: string | null;
        email?: string | null;
    };
}

export default function Navbar({ session }: { session: NavbarSession | null }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/6"
                : "bg-transparent border-b border-transparent"
                }`}
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <Image
                            src="/images/logo.png"
                            alt="Codex"
                            width={50}
                            height={50}
                            className="transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="text-3xl font-semibold tracking-tight text-white/90 group-hover:text-orange-accent transition-colors duration-300">
                            Codex
                        </span>
                    </Link>

                    {/* Right actions */}
                    <div className="flex items-center gap-5">
                        <button className="inline-flex items-center text-sm font-semibold tracking-widest gap-2 text-white rounded-sm hover:text-orange-accent transition-all duration-300">
                            <Search size={14} />
                            Search
                        </button>

                        {session?.user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="focus:outline-none"
                                >
                                    <Avatar className="h-9 w-9 border border-white/10 hover:border-orange-accent/50 transition-colors duration-300 cursor-pointer">
                                        <AvatarFallback className="bg-orange-accent/15 text-orange-accent text-xs font-semibold">
                                            {getInitials(session.user.name || "U")}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>

                                {menuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-56 z-50 bg-[#141414] border border-white/10 rounded-md shadow-xl py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-4 py-3 border-b border-white/5">
                                                <p className="text-sm font-medium text-white truncate">
                                                    {session.user.name}
                                                </p>
                                                <p className="text-xs text-white/40 truncate">
                                                    {session.user.email}
                                                </p>
                                            </div>
                                            <Link
                                                href="/Profile"
                                                onClick={() => setMenuOpen(false)}
                                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-white/60 hover:text-orange-accent hover:bg-white/5 transition-colors duration-200"
                                            >
                                                <User size={14} />
                                                My Profile
                                            </Link>
                                            <button
                                                onClick={() => signOut()}
                                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-white/60 hover:text-red-400 hover:bg-white/5 transition-colors duration-200"
                                            >
                                                <LogOut size={14} />
                                                Sign out
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/sign-in"
                                className="text-sm font-semibold tracking-wider text-white/60 hover:text-orange-accent transition-colors duration-300"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
