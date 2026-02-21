"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteUser, updateUserRole, updateUserStatus } from "@/lib/admin-actions/user";
import { toast } from "@/hooks/use-toast";

interface Props {
    userId: string;
    currentRole: "USER" | "ADMIN";
    currentStatus: "PENDING" | "APPROVED" | "REJECTED";
}

const UserActions = ({ userId, currentRole, currentStatus }: Props) => {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleRoleChange = async () => {
        const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
        setLoading("role");
        const result = await updateUserRole(userId, newRole);
        setLoading(null);
        if (result.success) {
            toast({ title: "Success", description: `Role updated to ${newRole}` });
            router.refresh();
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
    };

    const handleStatusChange = async (status: "APPROVED" | "REJECTED") => {
        setLoading("status");
        const result = await updateUserStatus(userId, status);
        setLoading(null);
        if (result.success) {
            toast({ title: "Success", description: `User ${status.toLowerCase()}` });
            router.refresh();
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
    };

    const handleDelete = async () => {
        setLoading("delete");
        const result = await deleteUser(userId);
        setLoading(null);
        setShowDeleteConfirm(false);
        if (result.success) {
            toast({ title: "Success", description: "User deleted successfully" });
            router.refresh();
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
    };

    return (
        <>
            {/* Status actions */}
            {currentStatus === "PENDING" && (
                <div className="admin-actions">
                    <button
                        className="admin-action-btn approve"
                        title="Approve"
                        disabled={loading === "status"}
                        onClick={() => handleStatusChange("APPROVED")}
                    >
                        ✓
                    </button>
                    <button
                        className="admin-action-btn reject"
                        title="Reject"
                        disabled={loading === "status"}
                        onClick={() => handleStatusChange("REJECTED")}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Role toggle */}
            {currentStatus === "APPROVED" && (
                <button
                    className="admin-action-btn role-toggle"
                    title={currentRole === "ADMIN" ? "Demote to User" : "Promote to Admin"}
                    disabled={loading === "role"}
                    onClick={handleRoleChange}
                >
                    {loading === "role" ? "…" : currentRole === "ADMIN" ? "↓" : "↑"}
                </button>
            )}

            {/* Delete */}
            <button
                className="admin-action-btn delete"
                title="Delete User"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading === "delete"}
            >
                🗑
            </button>

            {/* Delete confirmation overlay */}
            {showDeleteConfirm && (
                <div className="admin-confirm-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="admin-confirm-dialog" onClick={(e) => e.stopPropagation()}>
                        <h3>Delete User</h3>
                        <p>This will permanently delete this user and all their borrow records. This action cannot be undone.</p>
                        <div className="admin-confirm-actions">
                            <button
                                className="admin-confirm-cancel"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="admin-confirm-delete"
                                onClick={handleDelete}
                                disabled={loading === "delete"}
                            >
                                {loading === "delete" ? "Deleting…" : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserActions;
