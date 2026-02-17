import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import BookList from "@/components/Booklist";
import { sampleBooks } from "@/constants";
import { Mail, GraduationCap, CalendarDays, BookOpen } from "lucide-react";

const ProfilePage = async () => {
    const session = await auth();
    if (!session?.user) redirect("/sign-in");

    const { user } = session;

    const borrowedBooks = sampleBooks.slice(0, 4).map((book) => ({
        id: book.id,
        title: book.title,
        genre: book.genre,
        color: book.color,
        cover: book.cover,
    }));

    return (
        <section className="mx-auto max-w-7xl px-6 lg:px-10 py-10 sm:py-16">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-2 border-orange-accent/30 shadow-lg shadow-orange-accent/5">
                    <AvatarFallback className="bg-orange-accent/10 text-orange-accent text-3xl sm:text-4xl font-bold">
                        {getInitials(user.name || "U")}
                    </AvatarFallback>
                </Avatar>

                <div className="flex flex-col items-center sm:items-start gap-2 flex-1">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        {user.name}
                    </h1>
                    <p className="text-white/40 text-sm">Member since 2025</p>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 mt-3">
                        <div className="flex items-center gap-2 text-sm text-white/50">
                            <Mail size={14} className="text-orange-accent/70" />
                            <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/50">
                            <GraduationCap size={14} className="text-orange-accent/70" />
                            <span>University Student</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-10">
                {[
                    { icon: BookOpen, label: "Books Borrowed", value: "4" },
                    { icon: CalendarDays, label: "Days Active", value: "32" },
                    { icon: GraduationCap, label: "On Time Returns", value: "100%" },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white/3 border border-white/6 rounded-lg p-5 flex flex-col gap-1.5 hover:border-orange-accent/20 transition-colors duration-300"
                    >
                        <stat.icon size={18} className="text-orange-accent/60" />
                        <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                        <p className="text-xs text-white/40">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Borrowed Books */}
            <div className="mt-14">
                <BookList
                    title="Borrowed Books"
                    books={borrowedBooks}
                    containerClassName=""
                />
            </div>
        </section>
    );
};

export default ProfilePage;