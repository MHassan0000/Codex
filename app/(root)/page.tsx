import BookOverview from "@/components/BookOverview";
import BookList from "@/components/Booklist";
import { sampleBooks } from "@/constants";

export default function Home() {
  return (
    <>
      <BookOverview />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-16 lg:pb-24 space-y-12">
        <BookList title="Trending Books" books={sampleBooks} />

      </div>
    </>
  );
}
