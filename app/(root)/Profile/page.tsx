import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import BookList from "@/components/Booklist";
import BookCard from "@/components/BookCard";
import { Mail, GraduationCap, CalendarDays, BookOpen, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { db } from "@/database/drizzle";
import { users, borrowRecords, books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { resolveImageUrl } from "@/lib/image";

const ProfilePage = async () => {
    const session = await auth();
    if (!session?.user) redirect("/sign-in");

    const { user } = session;

    const dbUser = await db
        .select({ universityCard: users.universityCard, universityId: users.universityId, createdAt: users.createdAt })
        .from(users)
        .where(eq(users.id, user.id!))
        .limit(1);

    const universityCardPath = dbUser[0]?.universityCard;
    const universityCard = universityCardPath
        ? resolveImageUrl(universityCardPath)
        : null;
    const universityId = dbUser[0]?.universityId;
    const memberSince = dbUser[0]?.createdAt
        ? new Date(dbUser[0].createdAt).getFullYear()
        : new Date().getFullYear();

    // Fetch borrowed books with book details
    const borrowedRecords = await db
        .select({
            borrowId: borrowRecords.id,
            borrowDate: borrowRecords.borrowDate,
            dueDate: borrowRecords.dueDate,
            returnDate: borrowRecords.returnDate,
            status: borrowRecords.status,
            bookId: books.id,
            title: books.title,
            author: books.author,
            genre: books.genre,
            coverColor: books.coverColor,
            coverUrl: books.coverUrl,
            rating: books.rating,
            totalCopies: books.totalCopies,
            availableCopies: books.availableCopies,
            description: books.description,
            videoUrl: books.videoUrl,
            summary: books.summary,
        })
        .from(borrowRecords)
        .innerJoin(books, eq(borrowRecords.bookId, books.id))
        .where(eq(borrowRecords.userId, user.id!));

    const activeBorrows = borrowedRecords.filter((r) => r.status === "BORROWED");
    const pendingRequests = borrowedRecords.filter((r) => r.status === "PENDING");

    const borrowedBooks = activeBorrows.map((r) => ({
        borrowId: r.borrowId,
        id: r.bookId,
        title: r.title,
        author: r.author,
        genre: r.genre,
        coverColor: r.coverColor,
        coverUrl: r.coverUrl,
        rating: r.rating,
        totalCopies: r.totalCopies,
        availableCopies: r.availableCopies,
        description: r.description,
        videoUrl: r.videoUrl,
        summary: r.summary,
        createdAt: null,
    }));

    const pendingBooks = pendingRequests.map((r) => ({
        borrowId: r.borrowId,
        id: r.bookId,
        title: r.title,
        genre: r.genre,
        coverColor: r.coverColor,
        coverUrl: r.coverUrl,
    }));

    const totalBorrowed = borrowedRecords.filter((r) => r.status !== "PENDING").length;
    const returnedOnTime = borrowedRecords.filter((r) => r.status === "RETURNED").length;
    const onTimeRate = totalBorrowed > 0
        ? Math.round((returnedOnTime / totalBorrowed) * 100)
        : 0;

    return (
        <section className="mx-auto max-w-7xl px-6 lg:px-10 py-10 sm:py-16">
            {/* ─── Top Section: Desktop 2-column, Mobile stacked ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

                {/* ─── Left: Profile Card ─── */}
                <div className="bg-white/3 border border-white/6 rounded-2xl p-8 sm:p-10">
                    {/* Header row */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                        <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-2 border-orange-accent/30 shadow-lg shadow-orange-accent/5 shrink-0">
                            <AvatarFallback className="bg-orange-accent/10 text-orange-accent text-3xl sm:text-4xl font-bold">
                                {getInitials(user.name || "U")}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col items-center sm:items-start gap-2 flex-1 min-w-0">
                            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                                {user.name}
                            </h1>
                            <p className="text-white/40 text-sm">Member since {memberSince}</p>

                            <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 mt-3">
                                <div className="flex items-center gap-2 text-sm text-white/50">
                                    <Mail size={14} className="text-orange-accent/70" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-white/50">
                                    <GraduationCap size={14} className="text-orange-accent/70" />
                                    <span>ID: {universityId}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* University ID Card — inside the profile card */}
                    {universityCard && (
                        <div className="mt-8 pt-8 border-t border-white/6">
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck size={16} className="text-orange-accent/70" />
                                <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50">
                                    University ID
                                </h2>
                            </div>
                            <div className="relative w-full max-w-sm rounded-lg overflow-hidden border border-white/6 bg-white/3 group">
                                <Image
                                    src={universityCard}
                                    alt="University ID Card"
                                    width={400}
                                    height={250}
                                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-xs text-white/70 font-mono uppercase tracking-wider">Verified</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── Right: Stats Sidebar ─── */}
                <div className="flex flex-row lg:flex-col gap-4">
                    {[
                        { icon: BookOpen, label: "Books Borrowed", value: String(totalBorrowed) },
                        { icon: CalendarDays, label: "Currently Borrowed", value: String(activeBorrows.length) },
                        { icon: GraduationCap, label: "On Time Returns", value: totalBorrowed > 0 ? `${onTimeRate}%` : "—" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white/3 border border-white/6 rounded-xl p-5 flex-1 flex flex-col gap-1.5 hover:border-orange-accent/20 transition-colors duration-300"
                        >
                            <stat.icon size={18} className="text-orange-accent/60" />
                            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                            <p className="text-xs text-white/40">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pending Requests */}
            {pendingBooks.length > 0 && (
                <div className="mt-14">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                        Pending Requests
                    </h2>
                    <p className="text-sm text-white/40 mb-6">
                        Waiting for admin approval
                    </p>
                    <ul className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                        {pendingBooks.map((book) => (
                            <BookCard
                                key={book.borrowId}
                                id={book.id}
                                title={book.title}
                                genre={book.genre}
                                coverColor={book.coverColor}
                                coverImage={book.coverUrl}
                            />
                        ))}
                    </ul>
                </div>
            )}

            {/* Borrowed Books */}
            <div className="mt-14">
                {borrowedBooks.length > 0 ? (
                    <>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-8">
                            Borrowed Books
                        </h2>
                        <ul className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                            {borrowedBooks.map((book) => (
                                <BookCard
                                    key={book.borrowId}
                                    id={book.id}
                                    title={book.title}
                                    genre={book.genre}
                                    coverColor={book.coverColor}
                                    coverImage={book.coverUrl}
                                />
                            ))}
                        </ul>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <BookOpen size={32} className="mx-auto text-white/15 mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">No Borrowed Books</h3>
                        <p className="text-sm text-white/40">
                            You haven&apos;t borrowed any books yet. Browse the library to find your next read.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProfilePage;
