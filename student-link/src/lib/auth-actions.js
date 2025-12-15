"use server";

import { signIn as nextAuthSignIn } from "@/auth";
import { redirect } from "next/navigation";
import { AuthError } from "@/auth";

export async function signInWithCredentials(formData) {
    try {
        const result = await nextAuthSignIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });

        if (result?.error) {
            return { error: result.error };
        }

        // If successful, redirect
        redirect("/profile");
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials." };
                default:
                    return { error: "Something went wrong." };
            }
        }
        throw error;
    }
}

export async function signInWithGoogle() {
    try {
        await nextAuthSignIn("google", {
            redirectTo: "/profile",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: "Google sign-in failed." };
        }
        throw error;
    }
}
