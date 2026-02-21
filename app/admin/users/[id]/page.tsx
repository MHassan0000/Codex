import { redirect } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import config from "@/lib/config";
import UserStatusActions from "@/components/admin/UserStatusActions"
import { getUserById } from "@/lib/admin-actions/user";

interface BorrowRecord {
    id: string;
    bookId: string;
    borrowDate: string;
    dueDate: string;
    returnDate: string | null;
    status: string;
    bookTitle: string;
    bookAuthor: string;
    bookGenre: string;
    bookCoverColor: string;
    bookCoverUrl: string;
}

const resolveImageUrl = (src: string) => {
    if (src.startsWith("http")) return src;
    return `${config.env.imagekit.urlEndpoint}/${src}`;
};

const UserDetailPage = async ({
    params,
}: {
    params: Promise<{ id: string }>;
}) => {
    const { id } = await params;

    const result = await getUserById(id);

    if (!result.success || !result.data) redirect("/admin/users");

    const { user, borrowRecords: borrowedRecords } = result.data as {
        user: any;
        borrowRecords: BorrowRecord[];
    };

    const universityCardUrl = resolveImageUrl(user.universityCard);

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <Link href="/admin/users" className="admin-back-link">
                        ← Back to Users
                    </Link>
                    <h2 className="admin-page-title">{user.fullName}</h2>
                    <p className="admin-page-count">{user.email}</p>
                </div>
            </div>

            <div className="admin-user-detail-grid">
                {/* Profile Card */}
                <div className="admin-user-profile-card">
                    <Avatar className="admin-user-detail-avatar">
                        <AvatarFallback className="admin-user-avatar-fallback large">
                            {getInitials(user.fullName)}
                        </AvatarFallback>
                    </Avatar>

                    <h3 className="admin-user-detail-name">{user.fullName}</h3>
                    <p className="admin-user-detail-email">{user.email}</p>

                    <div className="admin-user-detail-badges">
                        <span
                            className={`admin-role-badge ${user.role?.toLowerCase()}`}
                        >
                            {user.role}
                        </span>
                        <span
                            className={`admin-status-badge ${user.status?.toLowerCase()}`}
                        >
                            {user.status}
                        </span>
                    </div>

                    <dl className="admin-user-detail-info">
                        <div>
                            <dt>University ID</dt>
                            <dd>{user.universityId}</dd>
                        </div>
                        <div>
                            <dt>Joined</dt>
                            <dd>
                                {user.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString(
                                        "en-US",
                                        {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }
                                    )
                                    : "—"}
                            </dd>
                        </div>
                        <div>
                            <dt>Last Active</dt>
                            <dd>{user.lastActivityDate || "—"}</dd>
                        </div>
                        <div>
                            <dt>Total Borrows</dt>
                            <dd>{borrowedRecords.length}</dd>
                        </div>
                    </dl>

                    <UserStatusActions
                        userId={user.id}
                        currentRole={user.role as "USER" | "ADMIN"}
                        currentStatus={
                            user.status as "PENDING" | "APPROVED" | "REJECTED"
                        }
                    />
                </div>

                {/* Right column */}
                <div className="admin-user-detail-right">
                    {/* University Card */}
                    <div className="admin-detail-section">
                        <h3 className="admin-detail-section-title">
                            University ID Card
                        </h3>
                        <div className="admin-id-card-preview">
                            <Image
                                src={universityCardUrl}
                                alt="University ID Card"
                                width={500}
                                height={300}
                                className="admin-id-card-image"
                            />
                        </div>
                    </div>

                    {/* Borrow History */}
                    <div className="admin-detail-section">
                        <h3 className="admin-detail-section-title">
                            Borrow History
                        </h3>

                        {borrowedRecords.length === 0 ? (
                            <div className="admin-table-empty">
                                This user hasn&apos;t borrowed any books yet.
                            </div>
                        ) : (
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Book</th>
                                            <th>Borrow Date</th>
                                            <th>Due Date</th>
                                            <th>Return Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {borrowedRecords.map((record: any) => (
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
                                                                src={resolveImageUrl(record.bookCoverUrl)}
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
                                                <td className="admin-date">
                                                    {new Date(
                                                        record.borrowDate
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        }
                                                    )}
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
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailPage;
