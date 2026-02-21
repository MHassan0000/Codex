"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import {
    approveBorrowRequest,
    rejectBorrowRequest,
    markBookReturned,
} from "@/lib/admin-actions/borrow";

interface Props {
    recordId: string;
    status: string;
}

const BorrowActions = ({ recordId, status }: Props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleApprove = async () => {
        setLoading(true);
        const result = await approveBorrowRequest(recordId);
        if (result.success) {
            toast({ title: "Success", description: "Borrow request approved" });
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
        const result = await rejectBorrowRequest(recordId);
        if (result.success) {
            toast({ title: "Success", description: "Borrow request rejected" });
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

    const handleReturn = async () => {
        setLoading(true);
        const result = await markBookReturned(recordId);
        if (result.success) {
            toast({ title: "Success", description: "Book marked as returned" });
            router.refresh();
        } else {
            toast({
                title: "Error",
                description: result.message || "Failed to mark returned",
                variant: "destructive",
            });
        }
        setLoading(false);
    };

    if (status === "PENDING") {
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
    }

    if (status === "BORROWED") {
        return (
            <button
                className="admin-detail-btn approve"
                onClick={handleReturn}
                disabled={loading}
                style={{ fontSize: "11px", padding: "5px 12px" }}
            >
                {loading ? "..." : "Mark Returned"}
            </button>
        );
    }

    return <span className="admin-mono">—</span>;
};

export default BorrowActions;
