"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { bookSchema } from "@/lib/validations";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import ColorPicker from "@/components/admin/ColorPicker";
import { createBook, updateBook } from "@/lib/admin-actions/book";
import { toast } from "@/hooks/use-toast";

type BookFormValues = z.infer<typeof bookSchema>;

interface Props extends Partial<Book> {
    type?: "create" | "update";
}

const BookForm = ({ type = "create", ...book }: Props) => {
    const router = useRouter();
    const isUpdate = type === "update";

    const form = useForm<BookFormValues>({
        resolver: zodResolver(bookSchema) as any,
        defaultValues: {
            title: book.title || "",
            description: book.description || "",
            author: book.author || "",
            genre: book.genre || "",
            rating: book.rating || 1,
            totalCopies: book.totalCopies || 1,
            coverUrl: book.coverUrl || "",
            coverColor: book.coverColor || "",
            videoUrl: book.videoUrl || "",
            summary: book.summary || "",
        },
    });

    const onSubmit = async (values: BookFormValues) => {
        if (isUpdate && book.id) {
            const result = await updateBook(book.id, values);
            if (result.success) {
                toast({
                    title: "Success",
                    description: "Book updated successfully",
                });
                router.push(`/admin/books/${book.id}`);
            } else {
                toast({
                    title: "Error",
                    description: result.message,
                    variant: "destructive",
                });
            }
        } else {
            const result = await createBook(values);
            if (result.success) {
                toast({
                    title: "Success",
                    description: "Book created successfully",
                });
                router.push(`/admin/books/${result.data.id}`);
            } else {
                toast({
                    title: "Error",
                    description: result.message,
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="book-form">
                {/* ── Book Details ── */}
                <div className="book-form-grid">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="book-form-item">
                                <FormLabel className="book-form-label">
                                    Book Title
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        required
                                        placeholder="Enter the book title"
                                        {...field}
                                        className="book-form_input"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                            <FormItem className="book-form-item">
                                <FormLabel className="book-form-label">
                                    Author
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        required
                                        placeholder="Enter the author name"
                                        {...field}
                                        className="book-form_input"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* ── Categorization ── */}
                <div className="book-form-grid-3">
                    <FormField
                        control={form.control}
                        name="genre"
                        render={({ field }) => (
                            <FormItem className="book-form-item">
                                <FormLabel className="book-form-label">
                                    Genre
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        required
                                        placeholder="e.g. Fiction"
                                        {...field}
                                        className="book-form_input"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                            <FormItem className="book-form-item">
                                <FormLabel className="book-form-label">
                                    Rating
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={5}
                                        placeholder="1–5"
                                        {...field}
                                        className="book-form_input"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="totalCopies"
                        render={({ field }) => (
                            <FormItem className="book-form-item">
                                <FormLabel className="book-form-label">
                                    Total Copies
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={10000}
                                        placeholder="No. of copies"
                                        {...field}
                                        className="book-form_input"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* ── Media ── */}
                <div className="book-form-grid">
                    <FormField
                        control={form.control}
                        name="coverUrl"
                        render={({ field }) => (
                            <FormItem className="book-form-item">
                                <FormLabel className="book-form-label">
                                    Book Cover
                                </FormLabel>
                                <FormControl>
                                    <FileUpload
                                        type="image"
                                        accept="image/*"
                                        placeholder="Upload a book cover"
                                        folder="books/covers"
                                        variant="light"
                                        onFileChange={field.onChange}
                                        value={field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="coverColor"
                        render={({ field }) => (
                            <FormItem className="book-form-item">
                                <FormLabel className="book-form-label">
                                    Primary Color
                                </FormLabel>
                                <FormControl>
                                    <ColorPicker
                                        onPickerChange={field.onChange}
                                        value={field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* ── Description ── */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="book-form-item">
                            <FormLabel className="book-form-label">
                                Description
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Write a brief description of the book"
                                    {...field}
                                    rows={5}
                                    className="book-form_input"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* ── Video ── */}
                <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                        <FormItem className="book-form-item">
                            <FormLabel className="book-form-label">
                                Book Trailer
                            </FormLabel>
                            <FormControl>
                                <FileUpload
                                    type="video"
                                    accept="video/*"
                                    placeholder="Upload a book trailer"
                                    folder="books/videos"
                                    variant="light"
                                    onFileChange={field.onChange}
                                    value={field.value}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* ── Summary ── */}
                <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                        <FormItem className="book-form-item">
                            <FormLabel className="book-form-label">
                                Summary
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Write a summary of the book"
                                    {...field}
                                    rows={3}
                                    className="book-form_input"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="book-form_btn text-white">
                    {isUpdate ? "Update Book" : "Add Book to Library"}
                </Button>
            </form>
        </Form>
    );
};

export default BookForm;
