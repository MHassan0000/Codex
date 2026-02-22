"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { updateUserStatus } from "@/lib/admin-actions/user";

interface Props {
    userId: string;
}

const AccountRequestActions = ({ userId }: Props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleApprove = async () => {
        setLoading(true);
        const result = await updateUserStatus(userId, "APPROVED");
        if (result.success) {
            toast({ title: "Success", description: "Account approved" });
            router.refresh();
        } else {
            toast({
                title: "Error",
                description: result.message || "Failed to approve",
                variant: "destructive",
            });
        }
        setLoading(false);
    };

    const handleReject = async () => {
        setLoading(true);
        const result = await updateUserStatus(userId, "REJECTED");
        if (result.success) {
            toast({ title: "Success", description: "Account rejected" });
            router.refresh();
        } else {
            toast({
                title: "Error",
                description: result.message || "Failed to reject",
                variant: "destructive",
            });
        }
        setLoading(false);
    };

    return (
        <div className="admin-actions">
            <button
                className="admin-action-btn approve"
                onClick={handleApprove}
                disabled={loading}
                title="Approve"
            >
                ✓
            </button>
            <button
                className="admin-action-btn reject"
                onClick={handleReject}
                disabled={loading}
                title="Reject"
            >
                ✕
            </button>
        </div>
    );
};

export default AccountRequestActions;
