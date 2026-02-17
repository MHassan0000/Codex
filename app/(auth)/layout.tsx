import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();

    if (session) redirect("/");

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col lg:flex-row">
            {/* Cover image — on top for mobile, right side for desktop */}
            <div className="relative w-full h-48 sm:h-64 lg:h-auto lg:w-1/2 lg:max-w-3xl lg:order-2">
                <Image
                    src="/images/authcoverpage.png"
                    alt="Library books"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Bottom fade on mobile, left fade on desktop */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#050505] lg:bg-linear-to-r lg:from-[#050505] lg:via-transparent lg:to-transparent lg:w-32" />
            </div>

            {/* Form area */}
            <div className="flex flex-col justify-center flex-1 px-6 sm:px-10 lg:px-16 xl:px-24 py-10 lg:py-12 lg:order-1">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-10 lg:mb-12">
                    <Link href="/" className="hover:scale-105">
                        <Image
                            src="/images/logo.png"
                            alt="Codex"
                            width={40}
                            height={40}
                        />
                    </Link>
                    <span className="text-2xl font-semibold tracking-tight text-white/90 hover:text-orange-accent transition-colors duration-300">
                        Codex
                    </span>
                </div>

                {/* Form content */}
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;