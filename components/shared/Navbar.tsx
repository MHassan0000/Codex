"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border border-white">
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

                    {/* Search button */}
                    <button className="inline-flex items-center text-sm font-semibold tracking-widest gap-2 text-white rounded-sm hover:text-orange-accent transition-all duration-300">
                        <Search size={14} />
                        Search
                    </button>
                </div>
            </div>
        </nav>
    );
}
