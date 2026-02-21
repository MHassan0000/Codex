import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import config from "@/lib/config";
import AccountRequestActions from "@/components/admin/AccountRequestActions";

const resolveImageUrl = (src: string) => {
    if (src.startsWith("http")) return src;
    return `${config.env.imagekit.urlEndpoint}/${src}`;
};

const AccountRequestsPage = async () => {
    const pendingUsers = await db
        .select()
        .from(users)
        .where(eq(users.status, "PENDING"))
        .orderBy(users.createdAt);

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Account Requests</h2>
                    <p className="admin-page-count">
                        {pendingUsers.length} pending request
                        {pendingUsers.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {pendingUsers.length === 0 ? (
                <div className="admin-table-empty">
                    No pending account requests. All caught up! 🎉
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>University ID</th>
                                <th>ID Card</th>
                                <th>Registered</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <span className="admin-user-name">
                                            {user.fullName}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="admin-user-email" style={{ color: "#475569" }}>
                                            {user.email}
                                        </span>
                                    </td>
                                    <td className="admin-mono">
                                        {user.universityId}
                                    </td>
                                    <td>
                                        <a
                                            href={resolveImageUrl(
                                                user.universityCard
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="admin-id-card-link"
                                        >
                                            View Card ↗
                                        </a>
                                    </td>
                                    <td className="admin-date">
                                        {user.createdAt
                                            ? new Date(
                                                user.createdAt
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })
                                            : "—"}
                                    </td>
                                    <td>
                                        <AccountRequestActions
                                            userId={user.id}
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

export default AccountRequestsPage;
