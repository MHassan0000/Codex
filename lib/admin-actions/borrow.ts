"use server";

import { db } from "@/database/drizzle";
import { borrowRecords, books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const approveBorrowRequest = async (recordId: string) => {
  try {
    const [record] = await db
      .select({
        id: borrowRecords.id,
        bookId: borrowRecords.bookId,
        status: borrowRecords.status,
      })
      .from(borrowRecords)
      .where(eq(borrowRecords.id, recordId))
      .limit(1);

    if (!record) return { success: false, message: "Record not found" };
    if (record.status !== "PENDING")
      return { success: false, message: "Request is not pending" };

    const [book] = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, record.bookId))
      .limit(1);

    if (!book || book.availableCopies <= 0) {
      return { success: false, message: "No copies available" };
    }

    await db
      .update(borrowRecords)
      .set({ status: "BORROWED" })
      .where(eq(borrowRecords.id, recordId));

    await db
      .update(books)
      .set({ availableCopies: book.availableCopies - 1 })
      .where(eq(books.id, record.bookId));

    revalidatePath("/admin/borrow-requests");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to approve request" };
  }
};

export const rejectBorrowRequest = async (recordId: string) => {
  try {
    const [record] = await db
      .select({ status: borrowRecords.status })
      .from(borrowRecords)
      .where(eq(borrowRecords.id, recordId))
      .limit(1);

    if (!record) return { success: false, message: "Record not found" };
    if (record.status !== "PENDING")
      return { success: false, message: "Request is not pending" };

    await db.delete(borrowRecords).where(eq(borrowRecords.id, recordId));

    revalidatePath("/admin/borrow-requests");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to reject request" };
  }
};

export const markBookReturned = async (recordId: string) => {
  try {
    const [record] = await db
      .select({
        id: borrowRecords.id,
        bookId: borrowRecords.bookId,
        status: borrowRecords.status,
      })
      .from(borrowRecords)
      .where(eq(borrowRecords.id, recordId))
      .limit(1);

    if (!record) return { success: false, message: "Record not found" };
    if (record.status !== "BORROWED")
      return { success: false, message: "Book is not currently borrowed" };

    const [book] = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, record.bookId))
      .limit(1);

    await db
      .update(borrowRecords)
      .set({
        status: "RETURNED",
        returnDate: new Date().toDateString(),
      })
      .where(eq(borrowRecords.id, recordId));

    if (book) {
      await db
        .update(books)
        .set({ availableCopies: book.availableCopies + 1 })
        .where(eq(books.id, record.bookId));
    }

    revalidatePath("/admin/borrow-requests");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to mark as returned" };
  }
};
