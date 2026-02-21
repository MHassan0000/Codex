"use client";

import React, { useState, useMemo } from "react";
import { Search, BookOpen, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import BookCard from "@/components/BookCard";

const BOOKS_PER_PAGE = 8;

interface LibrarySearchProps {
    books: Book[];
}

const LibrarySearch = ({ books }: LibrarySearchProps) => {
    const [query, setQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGenre, setSelectedGenre] = useState("All");

    const genres = useMemo(() => {
        const set = new Set(books.map((b) => b.genre));
        return ["All", ...Array.from(set).sort()];
    }, [books]);

    const filtered = useMemo(() => {
        const q = query.toLowerCase().trim();
        return books.filter((book) => {
            const matchesSearch =
                !q ||
                book.title.toLowerCase().includes(q) ||
                book.author.toLowerCase().includes(q) ||
                book.genre.toLowerCase().includes(q);
            const matchesGenre =
                selectedGenre === "All" || book.genre === selectedGenre;
            return matchesSearch && matchesGenre;
        });
    }, [books, query, selectedGenre]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / BOOKS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginated = filtered.slice(
        (safePage - 1) * BOOKS_PER_PAGE,
        safePage * BOOKS_PER_PAGE
    );

    const handleSearch = (val: string) => {
        setQuery(val);
        setCurrentPage(1);
    };

    const handleGenre = (genre: string) => {
        setSelectedGenre(genre);
        setCurrentPage(1);
    };

    return (
        <>
            {/* ── Hero search banner ── */}
            <section className="relative w-full overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-accent/[0.04] via-transparent to-transparent" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-orange-accent/[0.03] blur-[120px]" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-14 sm:py-20 lg:py-28 text-center">
                    <span className="text-[10px] font-semibold uppercase tracking-[3px] text-white/30">
                        Discover Your Next Great Read
                    </span>
                    <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
                        Explore and Search for{" "}
                        <br className="hidden sm:block" />
                        <span className="text-orange-accent">Any Book</span> In Our Library
                    </h1>

                    {/* Search bar */}
                    <div className="mt-8 sm:mt-10 max-w-xl mx-auto">
                        <div className="relative group">
                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-orange-accent transition-colors duration-300"
                            />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search by title, author, or genre..."
                                className="w-full pl-12 pr-4 py-4 bg-white/[0.04] border border-white/10 rounded-sm text-sm text-white placeholder:text-white/30 outline-none focus:border-orange-accent/50 focus:bg-white/[0.06] transition-all duration-300"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Main content ── */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-16 lg:pb-24">
                {/* Genre filter pills */}
                <div className="flex items-center gap-3 mb-8 overflow-x-auto scrollbar-hide pb-2">
                    <SlidersHorizontal size={14} className="text-white/30 shrink-0" />
                    {genres.map((genre) => (
                        <button
                            key={genre}
                            onClick={() => handleGenre(genre)}
                            className={`shrink-0 px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded-sm border transition-all duration-300 ${selectedGenre === genre
                                    ? "border-orange-accent bg-orange-accent/10 text-orange-accent"
                                    : "border-white/8 text-white/40 hover:text-white/70 hover:border-white/15"
                                }`}
                        >
                            {genre}
                        </button>
                    ))}
                </div>

                {/* Results header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        {query || selectedGenre !== "All" ? (
                            <>
                                Search Results for{" "}
                                <span className="text-orange-accent">
                                    {query || selectedGenre}
                                </span>
                            </>
                        ) : (
                            "All Books"
                        )}
                    </h2>
                    <span className="text-xs text-white/30 font-mono">
                        {filtered.length} {filtered.length === 1 ? "book" : "books"}
                    </span>
                </div>

                {/* Book grid or empty state */}
                {paginated.length > 0 ? (
                    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8">
                        {paginated.map((book) => (
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
                ) : (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center py-20 sm:py-28">
                        <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/8 flex items-center justify-center mb-6">
                            <BookOpen size={32} className="text-white/20" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">
                            No Results Found
                        </h3>
                        <p className="text-sm text-white/40 text-center max-w-sm">
                            We couldn&apos;t find any books matching{" "}
                            <span className="text-orange-accent font-medium">
                                &quot;{query || selectedGenre}&quot;
                            </span>
                            . Try a different search term or browse all books.
                        </p>
                        <button
                            onClick={() => {
                                setQuery("");
                                setSelectedGenre("All");
                                setCurrentPage(1);
                            }}
                            className="mt-6 px-6 py-3 border border-orange-accent text-orange-accent text-xs font-semibold uppercase tracking-widest rounded-sm hover:bg-orange-accent hover:text-black transition-all duration-300"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={safePage === 1}
                            className="w-9 h-9 flex items-center justify-center rounded-sm border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
                            aria-label="Previous page"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                            (page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-9 h-9 flex items-center justify-center rounded-sm text-xs font-bold transition-all duration-300 ${page === safePage
                                            ? "bg-orange-accent text-black"
                                            : "border border-white/10 text-white/50 hover:text-white hover:border-white/30"
                                        }`}
                                >
                                    {page}
                                </button>
                            )
                        )}

                        <button
                            onClick={() =>
                                setCurrentPage((p) => Math.min(totalPages, p + 1))
                            }
                            disabled={safePage === totalPages}
                            className="w-9 h-9 flex items-center justify-center rounded-sm border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
                            aria-label="Next page"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default LibrarySearch;
