import Link from "next/link";
import Image from "next/image";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";
import { Plus } from "lucide-react";
import config from "@/lib/config";
import BookActions from "@/components/admin/BookActions";

const resolveImageUrl = (src: string) => {
    if (src.startsWith("http")) return src;
    return `${config.env.imagekit.urlEndpoint}/${src}`;
};

const BooksPage = async () => {
    const allBooks = await db
        .select()
        .from(books)
        .orderBy(desc(books.createdAt));

    return (
        <div>
            {/* Page header */}
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">All Books</h2>
                    <p className="admin-page-count">
                        {allBooks.length} {allBooks.length === 1 ? "book" : "books"} in the library
                    </p>
                </div>
                <Link href="/admin/books/new" className="admin-btn-primary">
                    <Plus size={16} />
                    Create a New Book
                </Link>
            </div>

            {/* Table */}
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Book Title</th>
                            <th>Author</th>
                            <th>Genre</th>
                            <th>Rating</th>
                            <th>Copies</th>
                            <th>Date Created</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allBooks.length === 0 ? (
                            <tr>
                                <td colSpan={7}>
                                    <div className="admin-table-empty">
                                        No books found. Create your first book to get started.
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            allBooks.map((book) => (
                                <tr key={book.id} className="admin-table-row-link">
                                    <td>
                                        <div className="admin-book-cell">
                                            <div
                                                className="admin-book-cover"
                                                style={{ backgroundColor: book.coverColor }}
                                            >
                                                <Image
                                                    src={resolveImageUrl(book.coverUrl)}
                                                    alt={book.title}
                                                    width={40}
                                                    height={56}
                                                    className="admin-book-cover-img"
                                                />
                                            </div>
                                            <Link
                                                href={`/admin/books/${book.id}`}
                                                className="admin-book-title admin-row-link"
                                            >
                                                {book.title}
                                            </Link>
                                        </div>
                                    </td>
                                    <td>{book.author}</td>
                                    <td>
                                        <span className="admin-genre-tag">{book.genre}</span>
                                    </td>
                                    <td>
                                        <span className="admin-rating">
                                            ★ {book.rating}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="admin-copies">
                                            {book.availableCopies}/{book.totalCopies}
                                        </span>
                                    </td>
                                    <td className="admin-date">
                                        {book.createdAt
                                            ? new Date(book.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })
                                            : "—"}
                                    </td>
                                    <td>
                                        <div className="admin-actions">
                                            <Link href={`/admin/books/${book.id}/edit`} className="admin-action-btn edit" title="Edit">
                                                ✎
                                            </Link>
                                            <BookActions bookId={book.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BooksPage;

