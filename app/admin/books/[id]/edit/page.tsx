import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import BookForm from "@/components/admin/BookForm";
import Link from "next/link";

const EditBookPage = async ({
    params,
}: {
    params: Promise<{ id: string }>;
}) => {
    const { id } = await params;

    const [book] = await db
        .select()
        .from(books)
        .where(eq(books.id, id))
        .limit(1);

    if (!book) redirect("/admin/books");

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <Link href={`/admin/books/${id}`} className="admin-back-link">
                        ← Back to Book
                    </Link>
                    <h2 className="admin-page-title">Edit Book</h2>
                    <p className="admin-page-count">
                        Update the details for &quot;{book.title}&quot;
                    </p>
                </div>
            </div>

            <div className="admin-form-container">
                <BookForm type="update" {...book} />
            </div>
        </div>
    );
};

export default EditBookPage;
