import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import config from "@/lib/config";
import BorrowRequestActions from "@/components/admin/BorrowRequestActions";

const resolveImageUrl = (src: string) => {
    if (src.startsWith("http")) return src;
    return `${config.env.imagekit.urlEndpoint}/${src}`;
};

const BorrowRequestsPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) => {
    const { status: filterStatus } = await searchParams;

    const records = await db
        .select({
            id: borrowRecords.id,
            borrowDate: borrowRecords.borrowDate,
            dueDate: borrowRecords.dueDate,
            returnDate: borrowRecords.returnDate,
            status: borrowRecords.status,
            bookId: books.id,
            bookTitle: books.title,
            bookCoverUrl: books.coverUrl,
            bookCoverColor: books.coverColor,
            userId: users.id,
            userName: users.fullName,
            userEmail: users.email,
        })
        .from(borrowRecords)
        .innerJoin(books, eq(borrowRecords.bookId, books.id))
        .innerJoin(users, eq(borrowRecords.userId, users.id))
        .orderBy(borrowRecords.createdAt);

    const filtered = filterStatus
        ? records.filter((r) => r.status === filterStatus)
        : records;

    const counts = {
        all: records.length,
        PENDING: records.filter((r) => r.status === "PENDING").length,
        BORROWED: records.filter((r) => r.status === "BORROWED").length,
        RETURNED: records.filter((r) => r.status === "RETURNED").length,
    };

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Borrow Requests</h2>
                    <p className="admin-page-count">
                        Manage all book borrow requests
                    </p>
                </div>
            </div>

            {/* Filter tabs */}
            <div className="admin-filter-tabs">
                <Link
                    href="/admin/borrow-requests"
                    className={`admin-filter-tab ${!filterStatus ? "active" : ""}`}
                >
                    All ({counts.all})
                </Link>
                <Link
                    href="/admin/borrow-requests?status=PENDING"
                    className={`admin-filter-tab ${filterStatus === "PENDING" ? "active" : ""}`}
                >
                    Pending ({counts.PENDING})
                </Link>
                <Link
                    href="/admin/borrow-requests?status=BORROWED"
                    className={`admin-filter-tab ${filterStatus === "BORROWED" ? "active" : ""}`}
                >
                    Borrowed ({counts.BORROWED})
                </Link>
                <Link
                    href="/admin/borrow-requests?status=RETURNED"
                    className={`admin-filter-tab ${filterStatus === "RETURNED" ? "active" : ""}`}
                >
                    Returned ({counts.RETURNED})
                </Link>
            </div>

            {filtered.length === 0 ? (
                <div className="admin-table-empty">
                    No {filterStatus?.toLowerCase() || ""} borrow requests
                    found.
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Book</th>
                                <th>Borrower</th>
                                <th>Borrow Date</th>
                                <th>Due Date</th>
                                <th>Return Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((record) => (
                                <tr key={record.id}>
                                    <td>
                                        <div className="admin-book-cell">
                                            <div
                                                className="admin-book-cover"
                                                style={{
                                                    backgroundColor:
                                                        record.bookCoverColor,
                                                }}
                                            >
                                                <Image
                                                    src={resolveImageUrl(
                                                        record.bookCoverUrl
                                                    )}
                                                    alt={record.bookTitle}
                                                    width={40}
                                                    height={56}
                                                    className="admin-book-cover-img"
                                                />
                                            </div>
                                            <Link
                                                href={`/admin/books/${record.bookId}`}
                                                className="admin-row-link"
                                            >
                                                {record.bookTitle}
                                            </Link>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="admin-user-info">
                                            <Link
                                                href={`/admin/users/${record.userId}`}
                                                className="admin-row-link"
                                            >
                                                {record.userName}
                                            </Link>
                                            <span className="admin-user-email">
                                                {record.userEmail}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="admin-date">
                                        {new Date(
                                            record.borrowDate
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="admin-date">
                                        {record.dueDate}
                                    </td>
                                    <td className="admin-date">
                                        {record.returnDate || "—"}
                                    </td>
                                    <td>
                                        <span
                                            className={`admin-borrow-status ${record.status.toLowerCase()}`}
                                        >
                                            {record.status}
                                        </span>
                                    </td>
                                    <td>
                                        <BorrowRequestActions
                                            recordId={record.id}
                                            status={record.status}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BorrowRequestsPage;
