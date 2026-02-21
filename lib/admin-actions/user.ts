"use server";

import { db } from "@/database/drizzle";
import { users, borrowRecords } from "@/database/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getAllUsers = async () => {
  try {
    const result = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        universityId: users.universityId,
        universityCard: users.universityCard,
        status: users.status,
        role: users.role,
        createdAt: users.createdAt,
        lastActivityDate: users.lastActivityDate,
        borrowCount: sql<number>`COALESCE(COUNT(${borrowRecords.id}), 0)`.as(
          "borrow_count"
        ),
      })
      .from(users)
      .leftJoin(borrowRecords, eq(users.id, borrowRecords.userId))
      .groupBy(users.id)
      .orderBy(users.createdAt);

    return { success: true, data: JSON.parse(JSON.stringify(result)) };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to fetch users" };
  }
};

export const getUserById = async (userId: string) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) return { success: false, message: "User not found" };

    const records = await db
      .select()
      .from(borrowRecords)
      .where(eq(borrowRecords.userId, userId));

    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
        borrowRecords: JSON.parse(JSON.stringify(records)),
      },
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to fetch user" };
  }
};

export const updateUserRole = async (
  userId: string,
  role: "USER" | "ADMIN"
) => {
  try {
    await db.update(users).set({ role }).where(eq(users.id, userId));
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to update role" };
  }
};

export const updateUserStatus = async (
  userId: string,
  status: "PENDING" | "APPROVED" | "REJECTED"
) => {
  try {
    await db.update(users).set({ status }).where(eq(users.id, userId));
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to update status" };
  }
};

export const deleteUser = async (userId: string) => {
  try {
    await db
      .delete(borrowRecords)
      .where(eq(borrowRecords.userId, userId));
    await db.delete(users).where(eq(users.id, userId));
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to delete user" };
  }
};
