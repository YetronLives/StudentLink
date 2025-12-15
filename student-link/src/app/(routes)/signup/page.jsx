import { signIn } from "@/auth";
import Link from 'next/link';
import styles from './signup.module.css';

export default function Signup() {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear + i);

    return (
        <div className={styles.container}>
            <div className={styles.signupCard}>
                <h1 className={styles.title}>Student Link</h1>
                <p className={styles.subtitle}>Create your account to get started.</p>

                {/* Google Sign Up */}
                <div style={{ marginBottom: 10, textAlign: "center" }}>
                    <form action={async () => {
                        "use server";
                        try {
                            await signIn("google", { redirectTo: "/profile" });
                        } catch (error) {
                            // Log the specific error to your terminal
                            console.error("Google Sign-In Error:", error);

                            // IMPORTANT: You must re-throw the error, otherwise
                            // the Next.js redirect signal is caught and stopped.
                            throw error;
                        }
                    }}>
                        <button type="submit" className={styles.signupButton}>Sign up with Google</button>
                    </form>
                </div>

                {/* Credential Sign Up */}
                <form action={async (form) => {
                    "use server";

                    const body = {
                        firstName: form.get("firstName"),
                        lastName: form.get("lastName"),
                        email: form.get("email"),
                        password: form.get("password"),
                        confirmPassword: form.get("confirmPassword"),
                        username: form.get("username"),
                        school: form.get("school"),
                        major: form.get("major"),
                        year: form.get("year")
                    };

                    if (body.confirmPassword !== body.password) {
                        console.error("Passwords don't match");
                        // Ideally, return a state error here to show on UI
                        return;
                    }

                    // 1. Attempt User Creation
                    try {
                        // Fixed the double slash in URL: api//users -> api/users
                        const res = await fetch("http://localhost:3000/api/users", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(body),
                        });

                        if (!res.ok) {
                            throw new Error(`HTTP error! status: ${res.status}`);
                        }

                    } catch (error) {
                        console.error("Sign up failed during API call:", error);
                        // Stop execution here if creation failed
                        return;
                    }

                    // 2. Sign In (Outside the try/catch)
                    // We let this run freely. If it succeeds, it throws NEXT_REDIRECT
                    // which Next.js catches to handle the page navigation.
                    await signIn("credentials", {
                        email: body.email,
                        password: body.password,
                        redirectTo: "/profile",
                    });

                }} className={styles.form}>

                    {/* ... (Your Inputs remain unchanged) ... */}

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <input type="text" name="firstName" placeholder="First Name" className={styles.input} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <input type="text" name="lastName" placeholder="Last Name" className={styles.input} required />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <input type="text" name="username" placeholder="Username" className={styles.input} required />
                    </div>

                    <div className={styles.inputGroup}>
                        <input type="email" name="email" placeholder="Email address" className={styles.input} required />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <input type="password" name="password" placeholder="Password" className={styles.input} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <input type="password" name="confirmPassword" placeholder="Confirm Password" className={styles.input} required />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <input type="text" name="school" placeholder="School/University" className={styles.input} required />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <input type="text" name="major" placeholder="Major/Field of Study" className={styles.input} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <select name="year" className={styles.select} required>
                                <option value="">Graduation Year</option>
                                {years.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>
                    </div>

                    <button type="submit" className={styles.signupButton}>Create Account</button>
                </form>

                <p className={styles.loginText}>
                    Already have an account? <Link href="/login" className={styles.loginLink}>Login</Link>
                </p>
            </div>
        </div>
    );
}