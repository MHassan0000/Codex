"use client";

import AuthForm from "@/components/AuthForm";
import { signInSchema } from "@/lib/validations";

const signInWithCredentials = async (data: { email: string; password: string }) => {
    // Placeholder — will integrate with backend later
    console.log("Sign in:", data);
    return { success: true };
};

const SignInPage = () => (
    <AuthForm
        type="SIGN_IN"
        schema={signInSchema}
        defaultValues={{
            email: "",
            password: "",
        }}
        onSubmit={signInWithCredentials}
    />
);

export default SignInPage;