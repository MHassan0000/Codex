import React from "react";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq, ne, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import BookOverview from "@/components/BookOverview";
import BookVideo from "@/components/BookVideo";
import BookList from "@/components/Booklist";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;
    const session = await auth();

    const [bookDetails] = await db
        .select()
        .from(books)
        .where(eq(books.id, id))
        .limit(1);

    if (!bookDetails) redirect("/404");

    const similarBooks = await db
        .select()
        .from(books)
        .where(and(eq(books.genre, bookDetails.genre), ne(books.id, id)))
        .limit(6);

    return (
        <>
            <BookOverview {...bookDetails} userId={session?.user?.id as string} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-16 lg:pb-24">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                    {/* Main content */}
                    <div className="flex-[1.5] min-w-0">
                        {/* Video section */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-6 bg-orange-accent rounded-full" />
                                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                    Book Trailer
                                </h3>
                            </div>

                            <div className="relative rounded-lg overflow-hidden border border-white/8 bg-white/2">
                                <BookVideo videoUrl={bookDetails.videoUrl} />
                            </div>
                        </section>

                        {/* Summary section */}
                        <section className="mt-12 sm:mt-16">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-6 bg-orange-accent rounded-full" />
                                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                    Summary
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {bookDetails.summary.split("\n").map((line, i) => (
                                    <p
                                        key={i}
                                        className="text-sm sm:text-base leading-relaxed text-white/60"
                                    >
                                        {line}
                                    </p>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar — Quick Info */}
                    <aside className="lg:w-80 shrink-0">
                        <div className="lg:sticky lg:top-28 space-y-6">
                            <div className="border border-white/8 rounded-lg bg-white/2 p-6">
                                <h4 className="text-xs font-semibold uppercase tracking-[2px] text-white/30 mb-5">
                                    Book Info
                                </h4>

                                <dl className="space-y-4">
                                    <div className="flex justify-between items-baseline">
                                        <dt className="text-sm text-white/40">Author</dt>
                                        <dd className="text-sm font-medium text-white text-right max-w-[60%]">
                                            {bookDetails.author}
                                        </dd>
                                    </div>
                                    <div className="w-full h-px bg-white/6" />

                                    <div className="flex justify-between items-baseline">
                                        <dt className="text-sm text-white/40">Genre</dt>
                                        <dd className="text-xs font-mono uppercase tracking-wide text-orange-accent">
                                            {bookDetails.genre}
                                        </dd>
                                    </div>
                                    <div className="w-full h-px bg-white/6" />

                                    <div className="flex justify-between items-baseline">
                                        <dt className="text-sm text-white/40">Rating</dt>
                                        <dd className="text-sm font-bold font-mono text-white">
                                            {bookDetails.rating} / 5
                                        </dd>
                                    </div>
                                    <div className="w-full h-px bg-white/6" />

                                    <div className="flex justify-between items-baseline">
                                        <dt className="text-sm text-white/40">Total Copies</dt>
                                        <dd className="text-sm font-bold font-mono text-white">
                                            {bookDetails.totalCopies}
                                        </dd>
                                    </div>
                                    <div className="w-full h-px bg-white/6" />

                                    <div className="flex justify-between items-baseline">
                                        <dt className="text-sm text-white/40">Available</dt>
                                        <dd className="text-sm font-bold font-mono text-orange-accent">
                                            {bookDetails.availableCopies}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Similar Books */}
                {similarBooks.length >= 2 && (
                    <div className="mt-16 sm:mt-20 pt-12 border-t border-white/6">
                        <BookList
                            title="Similar Books"
                            books={similarBooks as Book[]}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default Page;
