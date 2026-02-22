import React from "react";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import config from "@/lib/config";
import { resolveImageUrl } from "@/lib/image";
import BookVideo from "@/components/BookVideo";
import BookActions from "@/components/admin/BookActions";
import { ArrowLeft, Star, BookOpen, Users, Layers } from "lucide-react";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;

    const [book] = await db
        .select()
        .from(books)
        .where(eq(books.id, id))
        .limit(1);

    if (!book) redirect("/admin/books");

    return (
        <div>
            {/* Back link + actions */}
            <div className="admin-detail-topbar">
                <Link
                    href="/admin/books"
                    className="admin-detail-back"
                >
                    <ArrowLeft size={16} />
                    Back to Books
                </Link>
                <div className="admin-actions">
                    <Link href={`/admin/books/${id}/edit`} className="admin-detail-btn role" title="Edit">
                        ✎ Edit
                    </Link>
                    <BookActions bookId={id} />
                </div>
            </div>

            {/* Header card */}
            <div className="admin-detail-header">
                <div
                    className="admin-detail-cover"
                    style={{ backgroundColor: book.coverColor }}
                >
                    <Image
                        src={resolveImageUrl(book.coverUrl)}
                        alt={book.title}
                        width={120}
                        height={168}
                        className="admin-detail-cover-img"
                    />
                </div>

                <div className="admin-detail-info">
                    <div>
                        <span className="admin-genre-tag">{book.genre}</span>
                        <h1 className="admin-detail-title">{book.title}</h1>
                        <p className="admin-detail-author">by {book.author}</p>
                    </div>

                    <div className="admin-detail-stats">
                        <div className="admin-detail-stat">
                            <Star size={14} className="admin-detail-stat-icon" />
                            <span className="admin-detail-stat-value">{book.rating}</span>
                            <span className="admin-detail-stat-label">Rating</span>
                        </div>
                        <div className="admin-detail-stat-divider" />
                        <div className="admin-detail-stat">
                            <Layers size={14} className="admin-detail-stat-icon" />
                            <span className="admin-detail-stat-value">{book.totalCopies}</span>
                            <span className="admin-detail-stat-label">Total Copies</span>
                        </div>
                        <div className="admin-detail-stat-divider" />
                        <div className="admin-detail-stat">
                            <BookOpen size={14} className="admin-detail-stat-icon" />
                            <span className="admin-detail-stat-value">{book.availableCopies}</span>
                            <span className="admin-detail-stat-label">Available</span>
                        </div>
                        <div className="admin-detail-stat-divider" />
                        <div className="admin-detail-stat">
                            <Users size={14} className="admin-detail-stat-icon" />
                            <span className="admin-detail-stat-value">
                                {book.totalCopies - book.availableCopies}
                            </span>
                            <span className="admin-detail-stat-label">Borrowed</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content grid */}
            <div className="admin-detail-grid">
                {/* Description */}
                <div className="admin-detail-section">
                    <h2 className="admin-detail-section-title">Description</h2>
                    <p className="admin-detail-text">{book.description}</p>
                </div>

                {/* Summary */}
                <div className="admin-detail-section">
                    <h2 className="admin-detail-section-title">Summary</h2>
                    <div className="admin-detail-text">
                        {book.summary.split("\n").map((line, i) => (
                            <p key={i} style={{ marginBottom: line ? "12px" : "0" }}>
                                {line}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Video */}
            <div className="admin-detail-section" style={{ marginTop: "24px" }}>
                <h2 className="admin-detail-section-title">Book Trailer</h2>
                <div className="admin-detail-video">
                    <BookVideo videoUrl={book.videoUrl} />
                </div>
            </div>

            {/* Metadata footer */}
            <div className="admin-detail-meta">
                <span>
                    Created:{" "}
                    {book.createdAt
                        ? new Date(book.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })
                        : "—"}
                </span>
                <span>ID: {book.id}</span>
            </div>
        </div>
    );
};

export default Page;
