"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    updateUserRole,
    updateUserStatus,
    deleteUser,
} from "@/lib/admin-actions/user";
import { toast } from "@/hooks/use-toast";

interface Props {
    userId: string;
    currentRole: "USER" | "ADMIN";
    currentStatus: "PENDING" | "APPROVED" | "REJECTED";
}

const UserStatusActions = ({ userId, currentRole, currentStatus }: Props) => {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleRoleChange = async () => {
        const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
        setLoading("role");
        const result = await updateUserRole(userId, newRole);
        setLoading(null);
        if (result.success) {
            toast({
                title: "Success",
                description: `Role updated to ${newRole}`,
            });
            router.refresh();
        } else {
            toast({
                title: "Error",
                description: result.message,
                variant: "destructive",
            });
        }
    };

    const handleStatusChange = async (status: "APPROVED" | "REJECTED") => {
        setLoading("status");
        const result = await updateUserStatus(userId, status);
        setLoading(null);
        if (result.success) {
            toast({
                title: "Success",
                description: `User ${status.toLowerCase()} successfully`,
            });
            router.refresh();
        } else {
            toast({
                title: "Error",
                description: result.message,
                variant: "destructive",
            });
        }
    };

    const handleDelete = async () => {
        setLoading("delete");
        const result = await deleteUser(userId);
        setLoading(null);
        if (result.success) {
            toast({
                title: "Success",
                description: "User deleted successfully",
            });
            router.push("/admin/users");
        } else {
            toast({
                title: "Error",
                description: result.message,
                variant: "destructive",
            });
        }
    };

    return (
        <div className="admin-user-detail-actions">
            {/* Status management */}
            {currentStatus === "PENDING" && (
                <>
                    <button
                        className="admin-detail-btn approve"
                        onClick={() => handleStatusChange("APPROVED")}
                        disabled={loading === "status"}
                    >
                        {loading === "status" ? "Processing…" : "✓ Approve User"}
                    </button>
                    <button
                        className="admin-detail-btn reject"
                        onClick={() => handleStatusChange("REJECTED")}
                        disabled={loading === "status"}
                    >
                        ✕ Reject User
                    </button>
                </>
            )}

            {currentStatus === "REJECTED" && (
                <button
                    className="admin-detail-btn approve"
                    onClick={() => handleStatusChange("APPROVED")}
                    disabled={loading === "status"}
                >
                    {loading === "status" ? "Processing…" : "✓ Approve User"}
                </button>
            )}

            {/* Role toggle */}
            {currentStatus === "APPROVED" && (
                <button
                    className="admin-detail-btn role"
                    onClick={handleRoleChange}
                    disabled={loading === "role"}
                >
                    {loading === "role"
                        ? "Updating…"
                        : currentRole === "ADMIN"
                            ? "↓ Demote to User"
                            : "↑ Promote to Admin"}
                </button>
            )}

            {/* Delete */}
            {!showDeleteConfirm ? (
                <button
                    className="admin-detail-btn danger"
                    onClick={() => setShowDeleteConfirm(true)}
                >
                    Delete User
                </button>
            ) : (
                <div className="admin-inline-confirm">
                    <p>Are you sure? This cannot be undone.</p>
                    <div className="admin-inline-confirm-btns">
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
                            {loading === "delete"
                                ? "Deleting…"
                                : "Confirm Delete"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserStatusActions;
