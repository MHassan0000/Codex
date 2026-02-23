"use client";

import React, { useRef, useState, useEffect } from "react";
import BookCard from "@/components/BookCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookListProps {
    title: string;
    books: Book[];
    containerClassName?: string;
}

const BookList = ({ title, books, containerClassName }: BookListProps) => {
    const scrollRef = useRef<HTMLUListElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    useEffect(() => {
        checkScroll();
        const el = scrollRef.current;
        el?.addEventListener("scroll", checkScroll);
        window.addEventListener("resize", checkScroll);
        return () => {
            el?.removeEventListener("scroll", checkScroll);
            window.removeEventListener("resize", checkScroll);
        };
    }, [books]);

    const scroll = (direction: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        const amount = el.clientWidth * 0.6;
        el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
    };

    if (books.length < 2) return null;

    return (
        <section className={containerClassName}>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {title}
                </h2>

                <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                        className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </button>
                </div>
            </div>

            <div className="relative mt-8">
                {/* Left fade gradient */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-10 sm:w-16 z-10 pointer-events-none transition-opacity duration-300"
                    style={{
                        background: "linear-gradient(to right, rgb(18 18 18 / 1), rgb(18 18 18 / 0.6), transparent)",
                        opacity: canScrollLeft ? 1 : 0,
                    }}
                />

                <ul
                    ref={scrollRef}
                    className="py-5 flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
                >
                    {books.map((book) => (
                        <BookCard
                            key={book.id}
                            id={book.id}
                            title={book.title}
                            genre={book.genre}
                            coverColor={book.coverColor}
                            coverImage={book.coverUrl}
                        />
                    ))}
                </ul>

                {/* Right fade gradient */}
                <div
                    className="absolute right-0 top-0 bottom-0 w-10 sm:w-16 z-10 pointer-events-none transition-opacity duration-300"
                    style={{
                        background: "linear-gradient(to left, rgb(18 18 18 / 1), rgb(18 18 18 / 0.6), transparent)",
                        opacity: canScrollRight ? 1 : 0,
                    }}
                />
            </div>
        </section>
    );
};

export default BookList;