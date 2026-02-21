"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Book as BookIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { borrowBook } from "@/lib/actions/book";

interface Props {
    userId: string;
    bookId: string;
    borrowingEligibility: {
        isEligible: boolean;
        message: string;
    };
}

const BorrowBook = ({
    userId,
    bookId,
    borrowingEligibility: { isEligible, message },
}: Props) => {
    const router = useRouter();
    const [borrowing, setBorrowing] = useState(false);

    const handleBorrowBook = async () => {
        if (!isEligible) {
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
            return;
        }

        setBorrowing(true);

        try {
            const result = await borrowBook({ bookId, userId });

            if (result.success) {
                toast({
                    title: "Success",
                    description:
                        "Borrow request submitted! Waiting for admin approval.",
                });

                router.push("/");
            } else {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occurred while borrowing the book",
                variant: "destructive",
            });
        } finally {
            setBorrowing(false);
        }
    };

    return (
        <Button
            variant="outline"
            className="border-orange-accent text-orange-accent hover:bg-orange-accent hover:text-black uppercase text-xs font-semibold tracking-widest px-5 sm:px-6 py-4 sm:py-5 rounded-none transition-all duration-300 disabled:opacity-50"
            onClick={handleBorrowBook}
            disabled={borrowing}
        >
            <span className="inline-flex items-center gap-2">
                <span>
                    {borrowing ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <BookIcon size={16} />
                    )}
                </span>
                <span className="text-sm sm:text-base">
                    {borrowing ? "Submitting..." : "Borrow Book Request"}
                </span>
            </span>
        </Button>
    );
};

export default BorrowBook;