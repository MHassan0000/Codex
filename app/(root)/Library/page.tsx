import React from "react";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";
import LibrarySearch from "@/components/LibrarySearch"

const LibraryPage = async () => {
    const allBooks = (await db
        .select()
        .from(books)
        .orderBy(desc(books.createdAt))) as Book[];

    return <LibrarySearch books={allBooks} />;
};

export default LibraryPage;