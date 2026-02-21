import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getDashboardData } from "@/lib/admin-actions/dashboard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import config from "@/lib/config";
import DashboardCharts from "@/components/admin/DashboardCharts";
import {
    BookCopy,
    Users,
    BookOpen,
    Clock,
    UserCheck,
    Plus,
    ArrowRight,
} from "lucide-react";

const resolveImageUrl = (src: string) => {
    if (src.startsWith("http")) return src;
    return `${config.env.imagekit.urlEndpoint}/${src}`;
};

const AdminDashboard = async () => {
    const session = await auth();
    if (!session?.user) redirect("/sign-in");

    const result = await getDashboardData();

    if (!result.success || !result.data) {
        return (
            <div className="admin-panel-empty">
                Failed to load dashboard data.
            </div>
        );
    }

    const {
        stats,
        recentBorrowRequests,
        recentBooks,
        pendingAccounts,
        genreData,
        borrowTrend,
    } = result.data;

    return (
        <div>
            {/* Welcome */}
            <div className="dashboard-welcome">
                <div>
                    <h1 className="dashboard-welcome-title">
                        Welcome back, {session.user.name?.split(" ")[0]}
                    </h1>
                    <p className="dashboard-welcome-sub">
                        Monitor and manage your library from here
                    </p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="dashboard-stats-grid">
                <div className="dashboard-stat-card">
                    <div className="dashboard-stat-icon books">
                        <BookCopy size={20} />
                    </div>
                    <div>
                        <p className="dashboard-stat-value">
                            {stats.totalBooks}
                        </p>
                        <p className="dashboard-stat-label">Total Books</p>
                    </div>
                </div>
                <div className="dashboard-stat-card">
                    <div className="dashboard-stat-icon users">
                        <Users size={20} />
                    </div>
                    <div>
                        <p className="dashboard-stat-value">
                            {stats.totalUsers}
                        </p>
                        <p className="dashboard-stat-label">Total Users</p>
                    </div>
                </div>
                <div className="dashboard-stat-card">
                    <div className="dashboard-stat-icon borrowed">
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <p className="dashboard-stat-value">
                            {stats.borrowedBooks}
                        </p>
                        <p className="dashboard-stat-label">Borrowed Books</p>
                    </div>
                </div>
                <div className="dashboard-stat-card">
                    <div className="dashboard-stat-icon pending">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="dashboard-stat-value">
                            {stats.pendingBorrows}
                        </p>
                        <p className="dashboard-stat-label">
                            Pending Requests
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <DashboardCharts
                borrowTrend={borrowTrend}
                genreData={genreData}
            />

            {/* Bottom grid: 2 columns */}
            <div className="dashboard-bottom-grid">
                {/* Left column */}
                <div className="dashboard-bottom-left">
                    {/* Borrow Requests */}
                    <div className="dashboard-card">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">
                                Borrow Requests
                            </h3>
                            <Link
                                href="/admin/borrow-requests"
                                className="dashboard-view-all"
                            >
                                View all <ArrowRight size={14} />
                            </Link>
                        </div>

                        {recentBorrowRequests.length === 0 ? (
                            <div className="admin-panel-empty">
                                No pending borrow requests
                            </div>
                        ) : (
                            <div className="dashboard-list">
                                {recentBorrowRequests.map((req: any) => (
                                    <div
                                        key={req.id}
                                        className="dashboard-list-item"
                                    >
                                        <div
                                            className="dashboard-list-cover"
                                            style={{
                                                backgroundColor:
                                                    req.bookCoverColor,
                                            }}
                                        >
                                            <Image
                                                src={resolveImageUrl(
                                                    req.bookCoverUrl
                                                )}
                                                alt={req.bookTitle}
                                                width={36}
                                                height={50}
                                                className="dashboard-list-cover-img"
                                            />
                                        </div>
                                        <div className="dashboard-list-info">
                                            <p className="dashboard-list-title">
                                                {req.bookTitle}
                                            </p>
                                            <p className="dashboard-list-meta">
                                                By {req.bookAuthor} •{" "}
                                                {req.bookGenre}
                                            </p>
                                            <p className="dashboard-list-user">
                                                <span className="dashboard-list-avatar">
                                                    {getInitials(req.userName)}
                                                </span>
                                                {req.userName} •{" "}
                                                {new Date(
                                                    req.borrowDate
                                                ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Account Requests */}
                    <div className="dashboard-card">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">
                                Account Requests
                            </h3>
                            <Link
                                href="/admin/account-requests"
                                className="dashboard-view-all"
                            >
                                View all <ArrowRight size={14} />
                            </Link>
                        </div>

                        {pendingAccounts.length === 0 ? (
                            <div className="admin-panel-empty">
                                No pending account requests
                            </div>
                        ) : (
                            <div className="dashboard-accounts-grid">
                                {pendingAccounts.map((acc: any) => (
                                    <Link
                                        key={acc.id}
                                        href={`/admin/users/${acc.id}`}
                                        className="dashboard-account-item"
                                    >
                                        <Avatar className="dashboard-account-avatar">
                                            <AvatarFallback className="admin-user-avatar-fallback">
                                                {getInitials(acc.fullName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <p className="dashboard-account-name">
                                            {acc.fullName}
                                        </p>
                                        <p className="dashboard-account-email">
                                            {acc.email}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right column — Recently Added Books */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title">
                            Recently Added Books
                        </h3>
                        <Link
                            href="/admin/books"
                            className="dashboard-view-all"
                        >
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>

                    <Link
                        href="/admin/books/new"
                        className="dashboard-add-book"
                    >
                        <Plus size={18} />
                        <span>Add New Book</span>
                    </Link>

                    <div className="dashboard-list">
                        {recentBooks.map((book: any) => (
                            <Link
                                key={book.id}
                                href={`/admin/books/${book.id}`}
                                className="dashboard-list-item clickable"
                            >
                                <div
                                    className="dashboard-list-cover"
                                    style={{
                                        backgroundColor: book.coverColor,
                                    }}
                                >
                                    <Image
                                        src={resolveImageUrl(book.coverUrl)}
                                        alt={book.title}
                                        width={36}
                                        height={50}
                                        className="dashboard-list-cover-img"
                                    />
                                </div>
                                <div className="dashboard-list-info">
                                    <p className="dashboard-list-title">
                                        {book.title}
                                    </p>
                                    <p className="dashboard-list-meta">
                                        By {book.author} • {book.genre}
                                    </p>
                                    <p className="dashboard-list-meta">
                                        📅{" "}
                                        {book.createdAt
                                            ? new Date(
                                                book.createdAt
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "2-digit",
                                            })
                                            : "—"}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
