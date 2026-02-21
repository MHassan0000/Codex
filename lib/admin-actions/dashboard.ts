"use server";

import { db } from "@/database/drizzle";
import { books, users, borrowRecords } from "@/database/schema";
import { eq, sql, desc, count } from "drizzle-orm";

export const getDashboardData = async () => {
  try {
    // Total counts
    const [bookCount] = await db
      .select({ count: count() })
      .from(books);

    const [userCount] = await db
      .select({ count: count() })
      .from(users);

    const [borrowedCount] = await db
      .select({ count: count() })
      .from(borrowRecords)
      .where(eq(borrowRecords.status, "BORROWED"));

    const [pendingBorrowCount] = await db
      .select({ count: count() })
      .from(borrowRecords)
      .where(eq(borrowRecords.status, "PENDING"));

    const [pendingAccountCount] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.status, "PENDING"));

    // Recent borrow requests (last 5 PENDING)
    const recentBorrowRequests = await db
      .select({
        id: borrowRecords.id,
        borrowDate: borrowRecords.borrowDate,
        status: borrowRecords.status,
        bookTitle: books.title,
        bookAuthor: books.author,
        bookGenre: books.genre,
        bookCoverUrl: books.coverUrl,
        bookCoverColor: books.coverColor,
        bookId: books.id,
        userName: users.fullName,
        userId: users.id,
      })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .where(eq(borrowRecords.status, "PENDING"))
      .orderBy(desc(borrowRecords.createdAt))
      .limit(5);

    // Recently added books (last 6)
    const recentBooks = await db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        genre: books.genre,
        coverUrl: books.coverUrl,
        coverColor: books.coverColor,
        createdAt: books.createdAt,
      })
      .from(books)
      .orderBy(desc(books.createdAt))
      .limit(6);

    // Pending account requests (up to 6)
    const pendingAccounts = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
      })
      .from(users)
      .where(eq(users.status, "PENDING"))
      .orderBy(desc(users.createdAt))
      .limit(6);

    // Genre distribution
    const genreData = await db
      .select({
        genre: books.genre,
        count: count(),
      })
      .from(books)
      .groupBy(books.genre)
      .orderBy(desc(count()));

    // Borrow trend — last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const borrowTrend = await db
      .select({
        date: sql<string>`DATE(${borrowRecords.createdAt})`.as("date"),
        count: count(),
      })
      .from(borrowRecords)
      .where(
        sql`${borrowRecords.createdAt} >= ${sevenDaysAgo.toISOString()}`
      )
      .groupBy(sql`DATE(${borrowRecords.createdAt})`)
      .orderBy(sql`DATE(${borrowRecords.createdAt})`);

    // Fill in missing days for the chart
    const trendMap = new Map(
      borrowTrend.map((t) => [t.date, t.count])
    );

    const filledTrend = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().split("T")[0];
      filledTrend.push({
        date: d.toLocaleDateString("en-US", { weekday: "short" }),
        count: trendMap.get(key) || 0,
      });
    }

    return {
      success: true,
      data: JSON.parse(
        JSON.stringify({
          stats: {
            totalBooks: bookCount.count,
            totalUsers: userCount.count,
            borrowedBooks: borrowedCount.count,
            pendingBorrows: pendingBorrowCount.count,
            pendingAccounts: pendingAccountCount.count,
          },
          recentBorrowRequests,
          recentBooks,
          pendingAccounts,
          genreData,
          borrowTrend: filledTrend,
        })
      ),
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to fetch dashboard data" };
  }
};
