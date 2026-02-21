import BookCover from "@/components/BookCover";
import { Star } from "lucide-react";
import Link from "next/link";
import BorrowBook from "./BorrowBook";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

interface BookOverviewProps extends Book {
    userId: string;
}

const BookOverview = async ({
    id,
    title,
    author,
    genre,
    rating,
    totalCopies,
    availableCopies,
    description,
    coverColor,
    coverUrl,
    userId,
}: BookOverviewProps) => {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

    const borrowingEligibility = {
        isEligible: availableCopies > 0 && user?.status === "APPROVED",
        message:
            availableCopies <= 0
                ? "Book is not available"
                : "You are not eligible to borrow this book",
    }
    return (
        <section className="w-full">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-10 sm:py-16 lg:py-24">
                <div className="flex flex-col-reverse lg:flex-row items-center gap-10 sm:gap-16 lg:gap-24">

                    {/* Left — Text content */}
                    <div className="flex-1 flex flex-col gap-4 sm:gap-6 max-w-xl text-center lg:text-left items-center lg:items-start">
                        <span className="text-[10px] font-semibold uppercase tracking-[3px] text-white/40">
                            Featured Book
                        </span>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                            {title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 sm:gap-x-4 gap-y-2 text-sm">
                            <span className="text-white/50">
                                By{" "}
                                <span className="font-semibold text-orange-accent">
                                    {author}
                                </span>
                            </span>

                            <span className="hidden sm:block w-px h-4 bg-white/10" />

                            <span className="text-white/50 font-mono text-xs uppercase tracking-wide">
                                {genre}
                            </span>

                            <span className="hidden sm:block w-px h-4 bg-white/10" />

                            <span className="inline-flex items-center gap-1 text-white/50">
                                <Star size={13} className="fill-orange-accent text-orange-accent" />
                                <span className="font-mono text-xs font-bold text-white">
                                    {rating}
                                </span>
                            </span>
                        </div>

                        <div className="flex items-center gap-6 mt-1 sm:mt-2">
                            <div className="flex flex-col items-center lg:items-start">
                                <span className="text-[10px] font-semibold uppercase tracking-[2px] text-white/30">
                                    Total Books
                                </span>
                                <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                                    {totalCopies}
                                </span>
                            </div>
                            <div className="w-px h-8 sm:h-10 bg-white/8" />
                            <div className="flex flex-col items-center lg:items-start">
                                <span className="text-[10px] font-semibold uppercase tracking-[2px] text-white/30">
                                    Available
                                </span>
                                <span className="text-xl sm:text-2xl font-bold font-mono text-orange-accent">
                                    {availableCopies}
                                </span>
                            </div>
                        </div>

                        <p className="text-xs sm:text-sm leading-relaxed text-white/50 max-w-md">
                            {description}
                        </p>

                        {user && (
                            <div className="mt-1 sm:mt-2">
                                <BorrowBook bookId={id} userId={userId} borrowingEligibility={borrowingEligibility} />
                            </div>
                        )}
                    </div>

                    {/* Right — Book cover visual */}
                    <Link href={`/books/${id}`}>
                        <div className="relative shrink-0">
                            <div
                                className="absolute -inset-8 sm:-inset-12 rounded-full opacity-20 blur-3xl pointer-events-none"
                                style={{ background: coverColor }}
                            />

                            <div className="hidden sm:block absolute top-4 left-6 opacity-40 rotate-6 scale-95">
                                <BookCover
                                    variant="wide"
                                    coverColor={coverColor}
                                    coverImage={coverUrl}
                                    className="max-sm:w-50! max-sm:h-70.5!"
                                />
                            </div>

                            <div className="relative z-10 -rotate-3 hover:rotate-0 transition-transform duration-500">
                                <BookCover
                                    variant="wide"
                                    coverColor={coverColor}
                                    coverImage={coverUrl}
                                    className="max-sm:w-50! max-sm:h-70.5!"
                                />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BookOverview;