import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import UserActions from "@/components/admin/UserActions";
import TableSearch from "@/components/admin/TableSearch";
import { getAllUsers } from "@/lib/admin-actions/user";

interface UserRecord {
    id: string;
    fullName: string;
    email: string;
    universityId: number;
    universityCard: string;
    status: string;
    role: string;
    createdAt: Date | null;
    borrowCount: number;
}

const UsersPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ query?: string }>;
}) => {
    const { query } = await searchParams;
    const result = await getAllUsers(query);
    const allUsers: UserRecord[] = result.success && result.data ? result.data : [];

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">All Users</h2>
                    <p className="admin-page-count">
                        {allUsers.length} {allUsers.length === 1 ? "user" : "users"}{query ? ` matching "${query}"` : " registered"}
                    </p>
                </div>
                <Suspense>
                    <TableSearch placeholder="Search users by name or email…" />
                </Suspense>
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
                                        {query
                                            ? `No users found matching "${query}".`
                                            : "No users found."}
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
