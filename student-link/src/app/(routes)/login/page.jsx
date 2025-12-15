import { redirect } from "next/navigation";
import styles from './login.module.css';
import { signIn } from "@/auth";
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

                        await signIn("credentials", {
                            email: form.get("email"),
                            password: form.get("password"),
                            redirectTo: "/profile", // v5 will handle redirect internally
                        });
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
                        await signIn("google", { redirectTo: "/profile" });
                    }}
                >
                    <button className={styles.loginButton}>Sign in with Google</button>
                </form>

                <p className={styles.signupText}>
                    Don't have an account? <Link href="/signup" className={styles.signupLink}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
