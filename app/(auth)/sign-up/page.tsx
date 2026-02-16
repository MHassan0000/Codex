"use client";

import AuthForm from "@/components/AuthForm";
import { signUpSchema } from "@/lib/validations";

const signUpWithCredentials = async (data: {
    fullName: string;
    email: string;
    universityId: number;
    universityCard: string;
    password: string;
}) => {
    // Placeholder — will integrate with backend later
    console.log("Sign up:", data);
    return { success: true };
};

const SignUpPage = () => (
    <AuthForm
        type="SIGN_UP"
        schema={signUpSchema}
        defaultValues={{
            fullName: "",
            email: "",
            universityId: 0,
            universityCard: "",
            password: "",
        }}
        onSubmit={signUpWithCredentials}
    />
);

export default SignUpPage;