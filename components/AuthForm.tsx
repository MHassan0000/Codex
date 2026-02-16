"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    DefaultValues,
    FieldValues,
    Path,
    SubmitHandler,
    useForm,
} from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import FileUpload from "@/components/FileUpload";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Props<T extends FieldValues> {
    schema: z.ZodType<T>;
    defaultValues: T;
    onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
    type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
    type,
    schema,
    defaultValues,
    onSubmit,
}: Props<T>) => {
    const router = useRouter();

    const isSignIn = type === "SIGN_IN";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form = useForm({
        resolver: zodResolver(schema as any),
        defaultValues: defaultValues as DefaultValues<T>,
    });

    const handleSubmit: SubmitHandler<T> = async (data) => {
        const result = await onSubmit(data);

        if (result.success) {
            toast({
                title: "Success",
                description: isSignIn
                    ? "You have successfully signed in."
                    : "You have successfully signed up.",
            });

            router.push("/");
        } else {
            toast({
                title: `Error ${isSignIn ? "signing in" : "signing up"}`,
                description: result.error ?? "An error occurred.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-white">
                {isSignIn
                    ? "Welcome back to Codex"
                    : "Create your library account"}
            </h1>
            <p className="text-sm text-white/50 leading-relaxed">
                {isSignIn
                    ? "Access the vast collection of resources, and stay updated"
                    : "Please complete all fields and upload a valid university ID to gain access to the library"}
            </p>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="w-full space-y-5 mt-4"
                >
                    {Object.keys(defaultValues).map((field) => (
                        <FormField
                            key={field}
                            control={form.control}
                            name={field as Path<T>}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-white/60">
                                        {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                                    </FormLabel>
                                    <FormControl>
                                        {field.name === "universityCard" ? (
                                            <FileUpload
                                                type="image"
                                                accept="image/*"
                                                placeholder="Upload your ID"
                                                folder="ids"
                                                variant="dark"
                                                onFileChange={field.onChange}
                                            />
                                        ) : (
                                            <Input
                                                required
                                                type={
                                                    FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                                                }
                                                {...field}
                                                className="h-11 bg-white/3 border-white/10 text-white placeholder:text-white/25 rounded-sm focus:border-orange-accent focus:ring-1 focus:ring-orange-accent/30 transition-all duration-300"
                                            />
                                        )}
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-400" />
                                </FormItem>
                            )}
                        />
                    ))}

                    <Button
                        type="submit"
                        className="w-full mt-2 bg-orange-accent hover:bg-orange-deep text-black font-semibold uppercase text-xs tracking-widest py-5 rounded-sm transition-all duration-300"
                    >
                        {isSignIn ? "Sign In" : "Sign Up"}
                    </Button>
                </form>
            </Form>

            <p className="text-center text-sm text-white/40 mt-2">
                {isSignIn ? "New to Codex? " : "Already have an account? "}
                <Link
                    href={isSignIn ? "/sign-up" : "/sign-in"}
                    className="font-semibold text-orange-accent hover:text-orange-light transition-colors duration-300"
                >
                    {isSignIn ? "Create an account" : "Sign in"}
                </Link>
            </p>
        </div>
    );
};

export default AuthForm;
