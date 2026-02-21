"use client";

import React from "react";
import { cn } from "@/lib/utils";
import BookCoverSvg from "@/components/BookCoverSvg";
import Image from "next/image";
import config from "@/lib/config";

type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

const variantStyles: Record<BookCoverVariant, string> = {
    extraSmall: "book-cover_extra_small",
    small: "book-cover_small",
    medium: "book-cover_medium",
    regular: "book-cover_regular",
    wide: "book-cover_wide",
};

interface Props {
    className?: string;
    variant?: BookCoverVariant;
    coverColor: string;
    coverImage: string;
}

const resolveImageUrl = (src: string) => {
    if (src.startsWith("http")) return src;
    return `${config.env.imagekit.urlEndpoint}/${src}`;
};

const BookCover = ({
    className,
    variant = "regular",
    coverColor = "#012B48",
    coverImage = "https://placehold.co/400x600.png",
}: Props) => {
    const imageUrl = resolveImageUrl(coverImage);
    return (
        <div
            className={cn(
                "relative transition-all duration-500 ease-out group/book",
                "hover:scale-105 hover:-translate-y-1",
                variantStyles[variant],
                className,
            )}
        >
            <BookCoverSvg coverColor={coverColor} />

            <div
                className="absolute z-10 overflow-hidden"
                style={{ left: "12%", width: "87.5%", height: "88%" }}
            >
                <Image
                    src={imageUrl}
                    alt="Book cover"
                    fill
                    className="rounded-sm object-fill"
                    loading="lazy"
                />

                {/* Animated shine sweep on hover */}
                <div className="absolute inset-0 z-20 opacity-0 group-hover/book:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 -translate-x-full group-hover/book:translate-x-full transition-transform duration-700 ease-in-out bg-linear-to-r from-transparent via-white/20 to-transparent" />
                </div>

                {/* Permanent subtle top reflection */}
                <div
                    className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, transparent 100%)",
                    }}
                />
            </div>

            {/* Hover shadow deepening */}
            <div className="absolute -inset-2 -z-10 rounded-sm bg-black/0 group-hover/book:bg-black/20 blur-xl transition-all duration-500" />
        </div>
    );
};

export default BookCover;