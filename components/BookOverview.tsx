import React from "react";
import BookCover from "@/components/BookCover";
import { sampleBooks } from "@/constants";
import { Book, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const BookOverview = () => {
    const book = sampleBooks[0];

    return (
        <section className="w-full">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-10 sm:py-16 lg:py-24">
                <div className="flex flex-col-reverse lg:flex-row items-center gap-10 sm:gap-16 lg:gap-24">

                    {/* Left — Text content */}
                    <div className="flex-1 flex flex-col gap-4 sm:gap-6 max-w-xl text-center lg:text-left items-center lg:items-start">
                        {/* Section label — Swiss style */}
                        <span className="text-[10px] font-semibold uppercase tracking-[3px] text-white/40">
                            Featured Book
                        </span>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                            {book.title}
                        </h1>

                        {/* Author + Genre + Rating */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 sm:gap-x-4 gap-y-2 text-sm">
                            <span className="text-white/50">
                                By{" "}
                                <span className="font-semibold text-orange-accent">
                                    {book.author}
                                </span>
                            </span>

                            <span className="hidden sm:block w-px h-4 bg-white/10" />

                            <span className="text-white/50 font-mono text-xs uppercase tracking-wide">
                                {book.genre}
                            </span>

                            <span className="hidden sm:block w-px h-4 bg-white/10" />

                            <span className="inline-flex items-center gap-1 text-white/50">
                                <Star size={13} className="fill-orange-accent text-orange-accent" />
                                <span className="font-mono text-xs font-bold text-white">
                                    {book.rating}
                                </span>
                            </span>
                        </div>

                        {/* Stats row */}
                        <div className="flex items-center gap-6 mt-1 sm:mt-2">
                            <div className="flex flex-col items-center lg:items-start">
                                <span className="text-[10px] font-semibold uppercase tracking-[2px] text-white/30">
                                    Total Books
                                </span>
                                <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                                    {book.total_copies}
                                </span>
                            </div>
                            <div className="w-px h-8 sm:h-10 bg-white/8" />
                            <div className="flex flex-col items-center lg:items-start">
                                <span className="text-[10px] font-semibold uppercase tracking-[2px] text-white/30">
                                    Available
                                </span>
                                <span className="text-xl sm:text-2xl font-bold font-mono text-orange-accent">
                                    {book.available_copies}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm leading-relaxed text-white/50 max-w-md">
                            {book.description}
                        </p>

                        {/* CTA */}
                        <div className="mt-1 sm:mt-2">
                            <Button
                                variant="outline"
                                className="border-orange-accent text-orange-accent hover:bg-orange-accent hover:text-black uppercase text-xs font-semibold tracking-widest px-5 sm:px-6 py-4 sm:py-5 rounded-none transition-all duration-300"
                            >
                                <span className="inline-flex items-center gap-2">
                                    <span>
                                        <Book size={16} />
                                    </span>
                                    <span className="text-sm sm:text-base">Borrow Book Request</span>
                                </span>
                            </Button>
                        </div>
                    </div>

                    {/* Right — Book cover visual */}
                    <div className="relative shrink-0">
                        {/* Ambient glow */}
                        <div
                            className="absolute -inset-8 sm:-inset-12 rounded-full opacity-20 blur-3xl pointer-events-none"
                            style={{ background: book.color }}
                        />

                        {/* Stacked book behind (decorative) — hidden on very small screens */}
                        <div className="hidden sm:block absolute top-4 left-6 opacity-40 rotate-6 scale-95">
                            <BookCover
                                variant="wide"
                                coverColor={book.color}
                                coverImage={book.cover}
                                className="max-sm:w-50! max-sm:h-70.5!"
                            />
                        </div>

                        {/* Main book */}
                        <div className="relative z-10 -rotate-3 hover:rotate-0 transition-transform duration-500">
                            <BookCover
                                variant="wide"
                                coverColor={book.color}
                                coverImage={book.cover}
                                className="max-sm:w-50! max-sm:h-70.5!"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookOverview;