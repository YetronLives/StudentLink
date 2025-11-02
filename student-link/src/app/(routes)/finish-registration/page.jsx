import styles from './finish-registration.module.css';
import { redirect } from "next/navigation";

export default async function FinishRegistrationPage({searchParams}) {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear + i);
    const { email } = await searchParams;


    return (
        <div className={styles.container}>
            <div className={styles.signupCard}>
                <h1 className={styles.title}>Student Link</h1>
                <p className={styles.subtitle}>Create your account to get started.</p>

                <form action={async(form) =>{
                    "use server";
                    try{
                        const body = {
                            firstName: form.get("firstName"),
                            lastName: form.get("lastName"),
                            email: email,
                            username: form.get("username"),
                            school: form.get("school"),
                            major: form.get("major"),
                            year: form.get("year")
                        }

                        const res = await fetch("http://localhost:3000/api/users/complete", {
                            method: "POST",
                            headers: {"Content-Type":"application/json"},
                            body: JSON.stringify(body),

                        });
                        if (!res.ok) {
                            const text = await res.text();
                            console.error("API returned non-OK:", res.status, text);
                            throw new Error(`API Error ${res.status}`);
                        }

                    }catch(error){
                        throw new Error("Sign up failed")
                    }
                    redirect("/profile")

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
                            >
                                <option value="">Graduation Year</option>
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