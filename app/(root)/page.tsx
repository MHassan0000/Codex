import BookOverview from "@/components/BookOverview";
import BookList from "@/components/Booklist";
import Footer from "@/components/Footer";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";

export default async function Home() {
  const session = await auth();

  const latestBooks = (await db
    .select()
    .from(books)
    .limit(10)
    .orderBy(desc(books.createdAt))) as Book[];

  return (
    <>
      {latestBooks.length > 0 && (
        <BookOverview {...latestBooks[0]} userId={session?.user?.id as string} />
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-16 lg:pb-24 space-y-12">
        <BookList title="Trending Books" books={latestBooks.slice(1)} />
      </div>

      <Footer />
    </>
  );
}
