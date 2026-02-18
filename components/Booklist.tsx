import React from "react";
import BookCard from "@/components/BookCard";

interface BookListProps {
    title: string;
    books: {
        id: number;
        title: string;
        genre: string;
        color: string;
        cover: string;
    }[];
    containerClassName?: string;
}

const BookList = ({ title, books, containerClassName }: BookListProps) => {
    if (books.length < 2) return null;

    return (
        <section className={containerClassName}>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {title}
            </h2>

            <ul className="mt-8 py-5 flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {books.map((book) => (
                    <BookCard
                        key={book.id}
                        id={book.id}
                        title={book.title}
                        genre={book.genre}
                        coverColor={book.color}
                        coverImage={book.cover}
                    />
                ))}
            </ul>
        </section>
    );
};

export default BookList;