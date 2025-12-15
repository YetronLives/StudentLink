import { redirect } from "next/navigation";
import styles from './login.module.css';
import { signIn } from "next-auth";
import {AuthError} from "next-auth";
import Link from "next/link";

export default async function Login() {


    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <h1 className={styles.title}>Student Link</h1>
                <p className={styles.subtitle}>Welcome back! Please login to your account.</p>
                <form
                    action={async (form) => {
                        "use server";
                        const result = await signIn("credentials", {
                            email: form.get("email"),
                            password: form.get("password"),
                            redirectTo: "/profile",
                        });

                        // NextAuth may return a URL string or just internally redirect
                        if (typeof result === "string") {
                            return redirect(result);
                        }

                        // If result is null, that means invalid credentials
                        if (!result) {
                            throw new Error("Invalid credentials");
                        }

                        return redirect("/profile");
                    }}
                    className={styles.form}
                >
                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.options}>

                        <a href="#" className={styles.forgotPassword}>
                            Forgot your password?
                        </a>
                    </div>

                    <button type="submit" className={styles.loginButton}>
                        Login
                    </button>
                </form>
                {/* OAuth buttons */}

                <form
                    action={async () => {
                        "use server";
                        try {
                            const url = await signIn("google", {redirectTo: "/profile",});

                            if (url) return redirect(url);
                        } catch (error) {
                            if (error instanceof AuthError) {
                                return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
                            }
                            throw error;
                        }
                    }}
                >
                    <button className={styles.loginButton}>
                        Sign in with Google
                    </button>
                </form>

                <p className={styles.signupText}>
                    Don't have an account? <Link href="/signup" className={styles.signupLink}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
