"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteBook } from "@/lib/admin-actions/book";
import { toast } from "@/hooks/use-toast";

interface Props {
    bookId: string;
}

const BookActions = ({ bookId }: Props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        const result = await deleteBook(bookId);
        setLoading(false);
        setShowConfirm(false);
        if (result.success) {
            toast({ title: "Success", description: "Book deleted successfully" });
            router.refresh();
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
    };

    return (
        <>
            <button
                className="admin-action-btn delete"
                title="Delete"
                onClick={() => setShowConfirm(true)}
            >
                🗑
            </button>

            {showConfirm && (
                <div className="admin-confirm-overlay" onClick={() => setShowConfirm(false)}>
                    <div className="admin-confirm-dialog" onClick={(e) => e.stopPropagation()}>
                        <h3>Delete Book</h3>
                        <p>This will permanently delete this book and all its borrow records. This action cannot be undone.</p>
                        <div className="admin-confirm-actions">
                            <button
                                className="admin-confirm-cancel"
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="admin-confirm-delete"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                {loading ? "Deleting…" : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookActions;
