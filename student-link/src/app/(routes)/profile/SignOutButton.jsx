"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut({ redirect: false }); // don't auto redirect
        router.push("/");                   // navigate to homepage
        router.refresh();                   // IMPORTANT: refresh session everywhere (navbar too)
    };

    return (
        <button onClick={handleSignOut}>
            Sign Out
        </button>
    );
}
