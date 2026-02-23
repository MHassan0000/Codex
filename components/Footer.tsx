import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";

const Footer = () => {
    return (
        <footer className="w-full border-t border-white/6 bg-black/40">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-10">
                    {/* Brand */}
                    <div className="flex flex-col gap-4 max-w-xs">
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/images/logo.png"
                                alt="Codex"
                                width={28}
                                height={28}
                            />
                            <span className="text-lg font-bold text-white tracking-tight">
                                Codex
                            </span>
                        </Link>
                        <p className="text-sm text-white/35 leading-relaxed">
                            Your personal library companion. Discover, borrow,
                            and manage books with ease.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex gap-16 sm:gap-20">
                        <div>
                            <h4 className="text-[10px] font-semibold uppercase tracking-[2px] text-white/25 mb-4">
                                Navigate
                            </h4>
                            <ul className="flex flex-col gap-3">
                                <li>
                                    <Link
                                        href="/"
                                        className="text-sm text-white/50 hover:text-orange-accent transition-colors duration-300"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/Library"
                                        className="text-sm text-white/50 hover:text-orange-accent transition-colors duration-300"
                                    >
                                        Library
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-semibold uppercase tracking-[2px] text-white/25 mb-4">
                                Legal
                            </h4>
                            <ul className="flex flex-col gap-3">
                                <li>
                                    <Link
                                        href="/privacy-policy"
                                        className="text-sm text-white/50 hover:text-orange-accent transition-colors duration-300"
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/terms-of-service"
                                        className="text-sm text-white/50 hover:text-orange-accent transition-colors duration-300"
                                    >
                                        Terms of Service
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-white/20">
                        &copy; {new Date().getFullYear()} Codex. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-white/20">
                        <BookOpen size={12} />
                        <span>Built for readers, by readers.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
