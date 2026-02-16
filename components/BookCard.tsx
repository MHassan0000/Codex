import React from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookCardProps {
    id: number;
    title: string;
    genre: string;
    coverColor: string;
    coverImage: string;
    isLoanedBook?: boolean;
}

const BookCard = ({
    id,
    title,
    genre,
    coverColor,
    coverImage,
    isLoanedBook = false,
}: BookCardProps) => (
    <li className={cn("group", isLoanedBook && "xs:w-52 w-full")}>
        <Link
            href={`/books/${id}`}
            className={cn(
                "block transition-transform duration-300 hover:-translate-y-1",
                isLoanedBook && "w-full flex flex-col items-center",
            )}
        >
            <BookCover
                variant={isLoanedBook ? "medium" : "regular"}
                coverColor={coverColor}
                coverImage={coverImage}
            />

            <div className={cn("mt-4", !isLoanedBook && "max-w-40")}>
                <p className="text-sm font-semibold text-white line-clamp-1 group-hover:text-orange-accent transition-colors duration-300">
                    {title}
                </p>
                <p className="text-xs text-white/40 mt-1 font-mono uppercase tracking-wide line-clamp-1">
                    {genre}
                </p>
            </div>

            {isLoanedBook && (
                <div className="mt-3 w-full">
                    <div className="flex items-center gap-2 px-3 py-2 border border-white/8 rounded-none">
                        <Calendar size={14} className="text-orange-accent shrink-0" />
                        <p className="text-xs text-white/60">11 days left to return</p>
                    </div>

                    <Button className="w-full mt-2 bg-orange-accent/10 text-orange-accent border border-orange-accent/20 hover:bg-orange-accent hover:text-black rounded-none uppercase text-xs font-semibold tracking-widest py-3 transition-all duration-300">
                        Download receipt
                    </Button>
                </div>
            )}
        </Link>
    </li>
);

export default BookCard;
