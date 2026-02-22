"use server";

import { books, borrowRecords } from "@/database/schema";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createBook = async (params: BookParams) => {
  try {
    const newBook = await db
      .insert(books)
      .values({
        ...params,
        availableCopies: params.totalCopies,
      })
      .returning();

    revalidatePath("/admin/books");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while creating the book",
    };
  }
};

export const updateBook = async (bookId: string, params: BookParams) => {
  try {
    const [existing] = await db
      .select({ totalCopies: books.totalCopies, availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!existing) {
      return { success: false, message: "Book not found" };
    }

    const copiesDiff = params.totalCopies - existing.totalCopies;
    const newAvailable = Math.max(0, existing.availableCopies + copiesDiff);

    const updated = await db
      .update(books)
      .set({
        ...params,
        availableCopies: newAvailable,
      })
      .where(eq(books.id, bookId))
      .returning();

    revalidatePath("/admin/books");
    revalidatePath(`/admin/books/${bookId}`);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updated[0])),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred while updating the book",
    };
  }
};

export const deleteBook = async (bookId: string) => {
  try {
    await db.delete(borrowRecords).where(eq(borrowRecords.bookId, bookId));
    await db.delete(books).where(eq(books.id, bookId));

    revalidatePath("/admin/books");
    return { success: true };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred while deleting the book",
    };
  }
};