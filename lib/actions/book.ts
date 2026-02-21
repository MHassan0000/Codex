"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq, and, or } from "drizzle-orm";
import dayjs from "dayjs";

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    const existingBorrow = await db
      .select({ id: borrowRecords.id })
      .from(borrowRecords)
      .where(
        and(
          eq(borrowRecords.userId, userId),
          eq(borrowRecords.bookId, bookId),
          or(
            eq(borrowRecords.status, "PENDING"),
            eq(borrowRecords.status, "BORROWED")
          )
        )
      )
      .limit(1);

    if (existingBorrow.length) {
      return {
        success: false,
        error: "You already have an active or pending request for this book",
      };
    }

    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length || book[0].availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available for borrowing",
      };
    }

    const dueDate = dayjs().add(7, "day").toDate().toDateString();

    await db.insert(borrowRecords).values({
      userId,
      bookId,
      dueDate,
      status: "PENDING",
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "An error occurred while borrowing the book",
    };
  }
};
