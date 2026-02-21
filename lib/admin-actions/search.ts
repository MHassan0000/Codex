"use server";

import { db } from "@/database/drizzle";
import { books, users, borrowRecords } from "@/database/schema";
import { ilike, or, eq, desc } from "drizzle-orm";

export const globalSearch = async (query: string) => {
  try {
    if (!query || query.trim().length < 2) {
      return { success: true, data: { users: [], books: [], borrowRequests: [] } };
    }

    const searchPattern = `%${query.trim()}%`;

    const matchedUsers = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        role: users.role,
        status: users.status,
      })
      .from(users)
      .where(
        or(
          ilike(users.fullName, searchPattern),
          ilike(users.email, searchPattern)
        )
      )
      .orderBy(desc(users.createdAt))
      .limit(5);

    const matchedBooks = await db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        genre: books.genre,
        coverUrl: books.coverUrl,
        coverColor: books.coverColor,
      })
      .from(books)
      .where(
        or(
          ilike(books.title, searchPattern),
          ilike(books.author, searchPattern),
          ilike(books.genre, searchPattern)
        )
      )
      .orderBy(desc(books.createdAt))
      .limit(5);

    const matchedBorrows = await db
      .select({
        id: borrowRecords.id,
        status: borrowRecords.status,
        borrowDate: borrowRecords.borrowDate,
        bookTitle: books.title,
        bookId: books.id,
        userName: users.fullName,
        userId: users.id,
      })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .where(
        or(
          ilike(books.title, searchPattern),
          ilike(users.fullName, searchPattern)
        )
      )
      .orderBy(desc(borrowRecords.createdAt))
      .limit(5);

    return {
      success: true,
      data: JSON.parse(
        JSON.stringify({
          users: matchedUsers,
          books: matchedBooks,
          borrowRequests: matchedBorrows,
        })
      ),
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Search failed" };
  }
};
