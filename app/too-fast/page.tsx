import Link from "next/link";
import { Clock, ArrowLeft } from "lucide-react";

const TooFastPage = () => {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-orange-accent/10 border border-orange-accent/20">
                    <Clock size={36} className="text-orange-accent" />
                </div>

                {/* Text */}
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    Whoa, slow down!
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-white/50 max-w-sm mx-auto">
                    You&apos;ve been making too many requests. For security purposes,
                    please wait a moment before trying again.
                </p>

                {/* Countdown hint */}
                <div className="mt-8 inline-flex items-center gap-2 rounded-md bg-white/3 border border-white/6 px-5 py-3">
                    <div className="h-2 w-2 rounded-full bg-orange-accent animate-pulse" />
                    <span className="text-xs text-white/40 font-mono uppercase tracking-widest">
                        Rate limit resets in ~1 minute
                    </span>
                </div>

                {/* Action */}
                <div className="mt-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-orange-accent hover:text-orange-light transition-colors duration-300"
                    >
                        <ArrowLeft size={16} />
                        Back to homepage
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default TooFastPage;
