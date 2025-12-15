import { signIn } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "./signup.module.css";

export default function Signup() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear + i);

  return (
    <div className={styles.container}>
      <div className={styles.signupCard}>
        <h1 className={styles.title}>Student Link</h1>
        <p className={styles.subtitle}>Create your account to get started.</p>

        <div style={{ marginBottom: 10, textAlign: "center" }}>
          <form
            action={async () => {
              "use server";
              try {
                const url = await signIn("google", { redirectTo: "/" });
                if (url) return redirect(url);
              } catch (error) {
                console.error("Google signup failed:", error);
                throw error;
              }
            }}
          >
            <button className={styles.signupButton}>Sign up with Google</button>
          </form>
        </div>

        <form
          action={async (form) => {
            "use server";
            try {
              const body = {
                firstName: form.get("firstName"),
                lastName: form.get("lastName"),
                email: form.get("email"),
                password: form.get("password"),
                confirmPassword: form.get("confirmPassword"),
                username: form.get("username"),
                school: form.get("school"),
                major: form.get("major"),
                year: form.get("year"),
              };

              if (body.confirmPassword !== body.password) {
                console.error("Passwords don't match");
                return;
              }

              await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
              });

              const url = await signIn("credentials", {
                email: form.get("email"),
                password: form.get("password"),
                redirectTo: "/profile",
              });

              if (url) return redirect(url);
              return redirect("/profile");
            } catch (error) {
              console.error("❌ SignUp failed:", error);
              if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
              throw new Error("Sign up failed");
            }
          }}
          className={styles.form}
        >
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
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className={styles.signupButton}>
            Create Account
          </button>
        </form>

        <p className={styles.loginText}>
          Already have an account?{" "}
          <Link href="/login" className={styles.loginLink}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

