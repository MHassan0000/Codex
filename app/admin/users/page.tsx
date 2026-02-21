import { db } from "@/database/drizzle";
import { users, borrowRecords } from "@/database/schema";
import { eq, sql, desc } from "drizzle-orm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import UserActions from "@/components/admin/UserActions";

const UsersPage = async () => {
    const allUsers = await db
        .select({
            id: users.id,
            fullName: users.fullName,
            email: users.email,
            universityId: users.universityId,
            universityCard: users.universityCard,
            status: users.status,
            role: users.role,
            createdAt: users.createdAt,
            borrowCount:
                sql<number>`CAST(COALESCE(COUNT(${borrowRecords.id}), 0) AS INTEGER)`.as(
                    "borrow_count"
                ),
        })
        .from(users)
        .leftJoin(borrowRecords, eq(users.id, borrowRecords.userId))
        .groupBy(users.id)
        .orderBy(desc(users.createdAt));

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">All Users</h2>
                    <p className="admin-page-count">
                        {allUsers.length} {allUsers.length === 1 ? "user" : "users"} registered
                    </p>
                </div>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date Joined</th>
                            <th>Role</th>
                            <th>Books Borrowed</th>
                            <th>University ID No</th>
                            <th>University ID Card</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.length === 0 ? (
                            <tr>
                                <td colSpan={8}>
                                    <div className="admin-table-empty">
                                        No users found.
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            allUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="admin-user-cell">
                                            <Avatar className="admin-user-avatar">
                                                <AvatarFallback className="admin-user-avatar-fallback">
                                                    {getInitials(user.fullName)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="admin-user-info">
                                                <Link
                                                    href={`/admin/users/${user.id}`}
                                                    className="admin-user-name admin-row-link"
                                                >
                                                    {user.fullName}
                                                </Link>
                                                <span className="admin-user-email">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="admin-date">
                                        {user.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString(
                                                "en-US",
                                                {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                }
                                            )
                                            : "—"}
                                    </td>
                                    <td>
                                        <span
                                            className={`admin-role-badge ${user.role?.toLowerCase()}`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="admin-center-cell">
                                        {user.borrowCount}
                                    </td>
                                    <td className="admin-mono">
                                        {user.universityId}
                                    </td>
                                    <td>
                                        <Link
                                            href={`/admin/users/${user.id}`}
                                            className="admin-id-card-link"
                                        >
                                            View ID Card ↗
                                        </Link>
                                    </td>
                                    <td>
                                        <span
                                            className={`admin-status-badge ${user.status?.toLowerCase()}`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>
                                    <td>
                                        <UserActions
                                            userId={user.id}
                                            currentRole={user.role as "USER" | "ADMIN"}
                                            currentStatus={
                                                user.status as
                                                | "PENDING"
                                                | "APPROVED"
                                                | "REJECTED"
                                            }
                                        />
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

export default UsersPage;
