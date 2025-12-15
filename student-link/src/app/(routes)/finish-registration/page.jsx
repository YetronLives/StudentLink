import styles from './finish-registration.module.css';
import { signIn } from "@/auth";

export default async function FinishRegistrationPage({ searchParams }) {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear + i);

    // Await searchParams (Required for Next.js 15+)
    const { email } = await searchParams;

    return (
        <div className={styles.container}>
            <div className={styles.signupCard}>
                <h1 className={styles.title}>Student Link</h1>
                <p className={styles.subtitle}>Create your account to get started.</p>

                <form action={async (formData) => {
                    "use server";

                    const body = {
                        firstName: formData.get("firstName"),
                        lastName: formData.get("lastName"),
                        email: email,
                        username: formData.get("username"),
                        school: formData.get("school"),
                        major: formData.get("major"),
                        year: formData.get("year")
                    };

                    try {
                        // 1. Create the user in your database
                        const res = await fetch("http://localhost:3000/api/users/complete", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(body),
                        });

                        if (!res.ok) {
                            const text = await res.text();
                            console.error("API returned non-OK:", res.status, text);
                            throw new Error(`API Error ${res.status}`);
                        }

                    } catch (error) {
                        console.error("Registration failed:", error);
                        // We throw here to stop execution so we don't try to sign in if DB failed
                        throw new Error("Sign up failed");
                    }

                    // 2. TRIGGER SIGN-IN
                    // This must be OUTSIDE the try/catch block because Next.js redirects
                    // are technically errors. If you catch them, the redirect won't happen.
                    await signIn("google", { redirectTo: "/profile" });
                }}
                      className={styles.form}>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                className={styles.input}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            name="school"
                            placeholder="School/University"
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                name="major"
                                placeholder="Major/Field of Study"
                                className={styles.input}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <select
                                name="year"
                                className={styles.select}
                                required
                                defaultValue=""
                            >
                                <option value="" disabled>Graduation Year</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button type="submit" className={styles.signupButton}>
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
}